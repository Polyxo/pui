import path from "path";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

import {
  convertFolder,
  jsx,
  svgOptimized /* rollup*/,
} from "@progressiveui/icons-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcFolder = "../icons/src/svg"; // path.resolve(__dirname, '@progressiveui/humanitarian-icons/src');
const distFolder = path.resolve(__dirname, "dist");

await convertFolder(srcFolder, distFolder, jsx);

const generatedIndex = await readFile(path.join(distFolder, "index.js"), "utf8");
const iconNames = Array.from(
  generatedIndex.matchAll(/export \{ default as (\w+) \}/g),
  (match) => match[1],
);
const declarations = [
  'import type * as React from "react";',
  "",
  "export type IconProps = React.SVGProps<SVGSVGElement> & { description?: React.ReactNode };",
  ...iconNames.map(
    (name) => `export const ${name}: React.ComponentType<IconProps>;`,
  ),
  "",
].join("\n");
const esmBundle = await readFile(path.resolve(__dirname, "es/index.js"), "utf8");

await Promise.all([
  writeFile(path.resolve(__dirname, "es/index.d.ts"), declarations),
  writeFile(path.resolve(__dirname, "es/index.mjs"), esmBundle),
]);
/*convertFolder(
  srcFolder,
  path.resolve(__dirname, 'dist/svg'),
  convertToSvgOptimized
);
*/
