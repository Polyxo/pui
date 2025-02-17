import { rm, stat, readdir, writeFile, mkdir } from "fs/promises";
import path from "path";
import { parse } from "react-docgen-typescript";

const distUrl = path.resolve(__dirname, "../../website/types/");

const options = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldExtractValuesFromUnion: true,
  propFilter: (prop, component) => {
    if (prop.declarations !== undefined && prop.declarations.length > 0) {
      const hasPropAdditionalDescription = prop.declarations.find(
        (declaration) => {
          return !declaration.fileName.includes("node_modules");
        }
      );

      return Boolean(hasPropAdditionalDescription);
    }

    return true;
  },
};

export default async function walk(directory: string) {
  let fileList: string[] = [];
  // TODO: fix only run once
  const files = await readdir(directory);
  for (const file of files) {
    const p = path.join(directory, file);
    if ((await stat(p)).isDirectory()) {
      fileList = [...fileList, ...(await walk(p))];
    } else {
      fileList.push(p);
    }
  }

  const tsxFileList = fileList.filter(
    (file) =>
      file.endsWith(".tsx") &&
      !file.includes("test") &&
      !file.includes("stories") &&
      !file.includes("indexStories")
  );

  await Promise.all(
    tsxFileList.map(async (file) => {
      console.log("read file", file);

      //TODO: improve performance https://github.com/styleguidist/react-docgen-typescript/issues/112
      const propTypes = JSON.parse(JSON.stringify(parse(file, options)));

      try {
        await mkdir(path.dirname(path.join(distUrl, file)), {
          recursive: true,
        });
      } catch (error) {
        console.log("collectTypes error", error);
      }

      await writeFile(
        path.join(distUrl, file.replace(".tsx", ".json")),
        JSON.stringify(propTypes, null, 2)
      );
      return null;
    })
  );

  return fileList;
}

async function startGenerateTypes() {
  await rm(distUrl, { recursive: true, force: true });

  await walk("./src/components");
  process.exit();
}

startGenerateTypes();
