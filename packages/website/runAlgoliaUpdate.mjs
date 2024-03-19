import algoliasearch from "algoliasearch/lite.js";
import fs from "fs";
import matter from "gray-matter";
import { extname, resolve, join } from "path";
import "dotenv/config";

/*
 * This script is used to update the Algolia search index, which is used in the search bar on the website.
 * It is run as a build step in the @wfp/website package.
 * It only run in production. TODO: in the future.
 * It is similar to the api/buildIndex endpoint, but it is run at build time.
 */

const fsPromises = fs.promises;

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
    })
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

  // initialize the client with your environment variables
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_SEARCH_ADMIN_KEY
  );

  // initialize the index in Algolia
  const index = client.initIndex("ui-docs");
  await index.clearObjects();

  const algoliaResponse = await index.saveObjects(transformed);

  console.log(
    `🎉 Sucessfully added ${algoliaResponse.objectIDs.length} records to Algolia search.`
  );
};

runAlgoliaUpdate();
