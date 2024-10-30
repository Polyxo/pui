import React from "react";
import CodeBlockLive from "../Blog/Mdx/CodeBlockLive";
import { Story } from "@progressiveui/react";

export default function ReactImportStatements({ post }: any) {
  const { mainComponent, components = [] } = post;
  const componentList = [mainComponent, ...components].join(", ");

  const code = `import { ${componentList} } from "@progressiveui/react"`;

  return (
    <Story>
      <h3>Import statement</h3>
      <CodeBlockLive
        source={code}
        // live
        // hideWrapper

        // smallPreview
        // live
        // view={view}
        // showEditor={!showAllProps}
      />
    </Story>
  );
}
