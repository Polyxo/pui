import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { Node } from "unist"; // Import Node type for unist nodes
import { VFile } from "vfile"; // Import VFile type for vfile instances

interface HeadingNode extends Node {
  value?: string;
}

interface CustomVFile extends VFile {
  data: {
    headings: string[];
  };
}

function extractHeadings() {
  //TODO: Check any tree type
  return function transformer(tree: any, file: CustomVFile) {
    const headings: string[] = [];

    visit(tree, "heading", (node: any) => {
      let textContent = "";
      visit(node, (child) => {
        if (child.value) {
          textContent += child.value;
        }
      });

      /*visit(node, "inlineCode", (textNode: HeadingNode) => {
        textContent += textNode.value || "";
      });
      visit(node, "text", (textNode: HeadingNode) => {
        textContent += textNode.value || "";
      });*/
      headings.push(textContent);
    });
    file.data = { headings };
  };
}

function noopCompiler() {
  this.Compiler = (): string => {
    return "";
  };
}

export async function getHeadings(markdownText: string): Promise<string[]> {
  try {
    const file = await unified()
      .use(remarkParse)
      .use(extractHeadings)
      .use(noopCompiler)
      .process(markdownText) as CustomVFile; // Cast the result to CustomVFile to access custom data property
    return file.data.headings;
  } catch (error) {
    console.error("Error processing Markdown:", error);
    return [];
  }
}