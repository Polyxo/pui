import { getAllPosts, getPostByPath, getPostSlugs } from "../../lib/getPost";
import slugify from "slugify";
import { serialize } from "next-mdx-remote/serialize";
import remarkMdxCodeMeta from "remark-mdx-code-meta";
import remarkGfm from "remark-gfm";
import rehypeCode from "../../lib/rehypeCode";
import rehypeImgSize from "rehype-img-size";
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
            .join("/") === slug.join("/")
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

  const propTypes: any = [];

  if (post.mainComponent) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const file = require(`../../types/src/components/${post.mainComponent}/${post.mainComponent}.json`);
      propTypes.push(file[0]);
    } catch (e) {
      // console.log("Can't load typescript definitions!");
    }
  }

  if (post.componentsNew) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(
      post.componentsNew as { [key: string]: { path?: string } }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ).map(([key, component]) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const file = require(`../../types/src/components/${component.path}.json`);
        propTypes.push(file[0]);
      } catch (e) {
        // console.log("Can't load typescript definitions!");
      }
    });
  }

  if (post.components) {
    post.components.forEach((component) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const file = require(`../../types/src/components/${component}/${component}.json`);
        propTypes.push(file[0]);
      } catch (e) {
        // console.log("Can't load typescript definitions!");
      }
    });
  }

  if (post.slug === "Components/Overview") {
    posts.forEach((p) => {
      if (p.mainComponent) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const file = require(`../../types/src/components/${p.title}/${p.title}.json`);
          propTypes.push(file[0]);
        } catch (e) {
          // console.log("Can't load typescript definitions!");
        }
      }
      if (p.componentsNew) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(p.componentsNew).map(([i, cN]: any) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fileCn = require(`../../types/src/components/${cN.path}.json`);
            propTypes.push(fileCn[0]);
          });
        } catch (e) {
          // console.log("Can't load typescript definitions!");
        }
      }
    });
  }

  const mdxSource = await serialize(post.content, {
    //components,
    mdxOptions: {
      remarkPlugins: [remarkMdxCodeMeta, remarkGfm],
      rehypePlugins: [
        rehypeCode,
        rehypeFigmaImage,
        [rehypeComponentsList, posts, propTypes],
        [
          rehypeImgSize,
          {
            dir: "_posts/",
          },
        ],
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
