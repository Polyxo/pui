import { getAllPosts, getPostByPath, getPostSlugs } from "../../lib/getPost";
import slugify from "slugify";
import { serialize } from "next-mdx-remote/serialize";
import remarkMdxCodeMeta from "remark-mdx-code-meta";
import remarkGfm from "remark-gfm";
import rehypeCode from "../../lib/rehypeCode";
import rehypeFigmaImage from "../../lib/rehypeFigmaImage";
import rehypeComponentsList from "../../lib/rehypeComponentsList";
import { getHeadings } from "../../lib/getHeadingsFromMarkdown";

export default async function getPostContent(params: any) {
  const posts = await getAllPosts([
    "category",
    "title",
    "date",
    "status",
    "slug",
    "intro",
    "subtitle",
    "excerpt",
    "author",
    "ogImage",
    "coverImage",
    "previewScale",
    "mainComponent",
    "components",
    "componentsNew",
    "defaultProps",
    "sampleCode",
    "order",
  ]);

  const slug = params.slug || ["homepage"];

  const slugs: any = await getPostSlugs();
  const foundSlug = slug
    ? slugs.find(
        (f) =>
          f.slug
            .split("/")
            .map((e) => slugify(e, { lower: true }))
            .join("/") === slug.join("/"),
      )
    : null;

  const post: any = foundSlug?.path
    ? getPostByPath(foundSlug.path, [
        "title",
        "date",
        "status",
        "slug",
        "intro",
        "subtitle",
        "author",
        "content",
        "ogImage",
        "coverImage",
        "mainComponent",
        "components",
        "componentsNew",
        "defaultProps",
        "sampleCode",
        "excerpt",
        "figma",
        "github",
        "npm",
        "storybook",
      ])
    : {};

  const content = post?.content || "";

  const mdxExcerptSource = await serialize(post.excerpt, {
    // components,
  });

  const propTypes: any[] = [];
  const propTypeTasks: Promise<void>[] = [];

  const queuePropTypeLoad = (componentPath?: string | null) => {
    if (!componentPath) {
      return;
    }

    propTypeTasks.push(
      (async () => {
        try {
          const importedModule = await import(
            `../../types/src/components/${componentPath}.json`
          );
          const file = importedModule.default ?? importedModule;
          propTypes.push(file[0]);
        } catch {
          // console.log("Can't load typescript definitions!");
        }
      })(),
    );
  };

  if (post.mainComponent) {
    queuePropTypeLoad(`${post.mainComponent}/${post.mainComponent}`);
  }

  if (post.componentsNew) {
    Object.values(
      post.componentsNew as Record<string, { path?: string }>,
    ).forEach((component) => {
      queuePropTypeLoad(component?.path || null);
    });
  }

  if (post.components) {
    post.components.forEach((component) => {
      queuePropTypeLoad(`${component}/${component}`);
    });
  }

  if (post.slug === "Components/Overview") {
    posts.forEach((p) => {
      if (p.mainComponent) {
        queuePropTypeLoad(`${p.title}/${p.title}`);
      }
      if (p.componentsNew) {
        Object.values(
          p.componentsNew as Record<string, { path?: string }>,
        ).forEach((component) => {
          queuePropTypeLoad(component?.path || null);
        });
      }
    });
  }

  await Promise.all(propTypeTasks);

  const mdxSource = await serialize(post.content, {
    //components,
    mdxOptions: {
      // remarkPlugins: [remarkMdxCodeMeta, remarkGfm],
      rehypePlugins: [
        rehypeCode,
        rehypeFigmaImage,
        [rehypeComponentsList, posts, propTypes],
        /* [
          rehypeImgSize,
          {
            dir: "_posts/",
          },
        ], */
      ],
    },
  });

  const vfile = await getHeadings(post.content);

  return {
    props: {
      // variables: variables,
      // data: data,
      // query: query,
      propTypes: propTypes,
      posts,
      post: {
        ...post,
        headings: vfile,
        content,
        mdxSource,
        mdxExcerptSource,
      },
    },
  };
}
