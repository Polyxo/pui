import algoliasearch from "algoliasearch";
import fs from "fs";
import matter from "gray-matter";
import { extname, resolve, join } from "path";
import "dotenv/config";

/*
 * This is an administrative write operation for the documentation search index.
 * Run it only in a trusted deployment job. It is intentionally separate from the
 * website build and must never be imported by a Next.js page or API route.
 */

const fsPromises = fs.promises;
const indexName = process.env.ALGOLIA_SEARCH_INDEX_NAME || "ui-docs";
const writeConfirmation = "update-ui-docs";
const dryRun = process.argv.includes("--dry-run");

export const postsDirectory = join(process.cwd(), "_posts");

function extractTabName(path) {
  // Split the string by '/tab:' delimiter
  const parts = path.split("/tab:");
  // Check if the array has at least two elements
  if (parts.length >= 2) {
    // The part after '/tab:' is the name of the tab
    return parts[1];
  } else {
    // Return false if '/tab:' is not found
    return false;
  }
}

async function getFiles(dir) {
  const dirents = await fsPromises.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

export async function getPostSlugs() {
  const files = await getFiles(postsDirectory);

  const filesFiltered = files.filter((el) => extname(el) === ".mdx");
  const results = [];

  filesFiltered.map((f) => {
    const fileContents = fs.readFileSync(f, "utf8");
    const { data } = matter(fileContents);
    results.push({
      slug: data.slug.replace("tab:", ""),
      path: f,
    });
    /* if (data.slug.includes("/tab:Code")) {
      results.push({
        slug: data.slug.replace("tab:Code", "Props"),
        path: f,
        originalSlug: data.slug,
      });
    } */
  });

  return results;
}

export function getPostByPath(path, fields = []) {
  const fileContents = fs.readFileSync(path, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "content") {
      items[field] = content;
    }
    if (data[field]) {
      items[field] = data[field];
    }
  });
  return { ...items, path };
}

export async function getAllPosts(fields = []) {
  const slugs = await getPostSlugs();

  const posts = slugs
    .map((slug) => getPostByPath(slug.path, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

function transformPostsToSearchObjects(posts) {
  return posts.map((post) => {
    return {
      objectID: post.slug,
      title: extractTabName(post.slug)
        ? `${post.title} ${extractTabName(post.slug)}`
        : post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
      content: post.content,
    };
  });
}

function requireIndexingEnvironment() {
  if (process.env.ALGOLIA_INDEX_WRITE !== writeConfirmation) {
    throw new Error(
      `Refusing to update Algolia. Set ALGOLIA_INDEX_WRITE=${writeConfirmation} only in the trusted indexing job.`,
    );
  }

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_SEARCH_ADMIN_KEY;

  if (!appId || !adminKey) {
    throw new Error(
      "Algolia indexing requires NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_SEARCH_ADMIN_KEY.",
    );
  }

  return { appId, adminKey };
}

function validateSearchObjects(objects) {
  if (objects.length === 0) {
    throw new Error("Refusing to replace the Algolia index with no records.");
  }

  const objectIDs = new Set(objects.map(({ objectID }) => objectID));
  if (
    objectIDs.has(undefined) ||
    objectIDs.has("") ||
    objectIDs.size !== objects.length
  ) {
    throw new Error(
      "Refusing to update Algolia because record objectIDs are missing or duplicated.",
    );
  }
}

const runAlgoliaUpdate = async () => {
  const posts = await getAllPosts([
    "title",
    "date",
    "slug",
    "excerpt",
    "author",
    "content",
  ]);

  const transformed = transformPostsToSearchObjects(posts);
  validateSearchObjects(transformed);

  if (dryRun) {
    console.log(
      `Validated ${transformed.length} documentation records for ${indexName}.`,
    );
    return;
  }

  const { appId, adminKey } = requireIndexingEnvironment();
  const client = algoliasearch(appId, adminKey);

  const index = client.initIndex(indexName);

  // Algolia builds a temporary index and swaps it into place. This avoids a
  // failed upload leaving the live search index empty.
  await index.replaceAllObjects(transformed, { safe: true });

  console.log(
    `Successfully indexed ${transformed.length} documentation records.`,
  );
};

runAlgoliaUpdate().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Algolia indexing failed.",
  );
  process.exitCode = 1;
});
