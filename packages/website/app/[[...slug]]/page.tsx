import { Metadata } from "next";
import { getAllPosts } from "../../lib/getPost";
import getPostContent from "../../components/Post/getPostContent";
import slugify from "slugify";
import Layout from "../../components/Blog/Layout";
import slugifyWithSlashes from "lib/slugifyWithSlashes";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPosts(["slug"]);

  const staticParams = posts.map((post: any) => {
    const slug = post.slug.split("/").map((e) => slugify(e, { lower: true }));
    return { slug: slug };
  });

  return [...staticParams, { slug: ["/"] }];
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postContent = await getPostContent(params);
  const page = postContent?.props?.post;

  if (!page?.title) return { title: "Not found" };

  const postUrl =
    process.env.NEXT_PUBLIC_DOMAIN + slugifyWithSlashes(page.slug);

  return {
    title: page.title + " | WFP Bridge",
    description: page.description || page.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      title: page.title + " | WFP Bridge",
      description: page.description || page.excerpt,
      type: "article",
    },
  };
}

export default async function Page(args: any) {
  const data: any = await getPostContent(args.params);
  const { post, posts, propTypes } = data.props;

  if (!post?.slug && args.params.slug !== undefined) notFound();
  return <Layout posts={posts} post={post} propTypes={propTypes} />;
}

// export const revalidate = 3600;
