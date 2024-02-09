import type { NextApiRequest, NextApiResponse } from "next";
import algoliasearch from "algoliasearch/lite";
import { getAllPosts } from "../../lib/getPost";

type Data = {
  success: boolean;
  message: string;
};

function transformPostsToSearchObjects(posts) {
  return posts.map((post) => {
    return {
      objectID: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      date: post.date,
      content: post.content,
    };
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.ALGOLIA_SEARCH_ADMIN_KEY as string
  );

  // initialize the index in Algolia
  const index: any = client.initIndex("ui-docs");

  await index.clearObjects();

  const algoliaResponse = await index.saveObjects(transformed);

  console.log(
    `🎉 Sucessfully added ${
      algoliaResponse.objectIDs.length
    } records to Algolia search. Object IDs:\n${algoliaResponse.objectIDs.join(
      "\n"
    )}`
  );

  res.status(200).json({
    success: true,
    message: `Sucessfully added ${algoliaResponse.objectIDs.length}`,
  });
}
