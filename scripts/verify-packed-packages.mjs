import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const temporaryRoot = mkdtempSync(
  path.join(os.tmpdir(), "pui-packed-consumer-"),
);
const tarballDirectory = path.join(temporaryRoot, "tarballs");
const consumerDirectory = path.join(temporaryRoot, "consumer");
const npmCacheDirectory = path.join(temporaryRoot, "npm-cache");
const npmUserConfig = path.join(temporaryRoot, "npm-userconfig");
const npmGlobalConfig = path.join(temporaryRoot, "npm-globalconfig");

const packageDirectories = [
  "packages/react",
  "packages/icons-react",
  "packages/icons-core",
  "packages/styles",
  "packages/themes-core",
];

const requiredPackageFiles = {
  "@progressiveui/react": [
    "dist/index.mjs",
    "dist/index.cjs",
    "dist/index.umd.js",
    "dist/index.es.js",
    "dist/index.cjs.js",
    "dist/index.d.ts",
  ],
  "@progressiveui/icons-react": [
    "index.d.ts",
    "es/index.mjs",
    "es/index.d.ts",
    "umd/index.js",
  ],
  "@progressiveui/icons-core": [
    "build/bundle.js",
    "build/bundle.js.map",
    "dist/bundle.d.ts",
  ],
  "@progressiveui/styles": [
    "styles.css",
    "index.scss",
    "index-with-tokens.scss",
    "scss/components/button/_button.scss",
  ],
  "@progressiveui/themes-core": [
    "config.js",
    "config.d.ts",
    "scripts/config.js",
    "dist/json/variables-full.json",
    "dist/scss/default-css-theme.scss",
    "distDark/scss/default-css-theme.scss",
  ],
};

const childEnvironment = { ...process.env };
for (const key of Object.keys(childEnvironment)) {
  if (
    /^(?:NPM_TOKEN|NODE_AUTH_TOKEN|YARN_NPM_AUTH_TOKEN)$/iu.test(key) ||
    /^NPM_CONFIG_/iu.test(key)
  ) {
    delete childEnvironment[key];
  }
}

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    ...options,
    env: {
      ...childEnvironment,
      npm_config_cache: npmCacheDirectory,
      npm_config_globalconfig: npmGlobalConfig,
      npm_config_registry: "https://registry.npmjs.org/",
      npm_config_userconfig: npmUserConfig,
      ...options.env,
    },
  });

  if (result.error || result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw result.error ?? new Error(`${command} exited with ${result.status}`);
  }

  return result.stdout;
};

try {
  mkdirSync(tarballDirectory);
  mkdirSync(consumerDirectory);
  writeFileSync(npmUserConfig, "");
  writeFileSync(npmGlobalConfig, "");

  const packedPackages = packageDirectories.map((packageDirectory) => {
    const output = run(
      "npm",
      [
        "pack",
        path.join(root, packageDirectory),
        "--json",
        "--ignore-scripts",
        "--pack-destination",
        tarballDirectory,
      ],
      { cwd: temporaryRoot },
    );
    const [metadata] = JSON.parse(output);
    assert.ok(
      metadata?.filename,
      `npm pack returned no file for ${packageDirectory}`,
    );
    const packedPaths = new Set(
      metadata.files.map(({ path: filePath }) => filePath),
    );
    for (const requiredFile of requiredPackageFiles[metadata.name] ?? []) {
      assert.ok(
        packedPaths.has(requiredFile),
        `Required file missing from ${metadata.name}: ${requiredFile}`,
      );
    }
    const forbiddenFile = metadata.files.find(({ path: filePath }) =>
      /(?:^|\/)(?:__mocks__|__tests__|examples|node_modules|othersrc|tasks)(?:\/|$)|(?:^|\/)\.env$|(?:^|\/)\.npmrc$|\.DS_Store$|\.snap$|\.stories\.[cm]?[jt]sx?$/u.test(
        filePath,
      ),
    );
    assert.equal(
      forbiddenFile,
      undefined,
      `Non-production file packed by ${metadata.name}: ${forbiddenFile?.path}`,
    );
    return {
      ...metadata,
      tarball: path.join(tarballDirectory, path.basename(metadata.filename)),
    };
  });
  const tarballs = packedPackages.map(({ tarball }) => tarball);

  const reactManifest = JSON.parse(
    readFileSync(path.join(root, "packages/react/package.json"), "utf8"),
  );
  const stylesManifest = JSON.parse(
    readFileSync(path.join(root, "packages/styles/package.json"), "utf8"),
  );

  writeFileSync(
    path.join(consumerDirectory, "package.json"),
    `${JSON.stringify({ name: "pui-packed-consumer", private: true, type: "module" }, null, 2)}\n`,
  );

  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--package-lock=false",
      "--prefer-offline",
      ...tarballs,
      `react@${reactManifest.devDependencies.react}`,
      `react-dom@${reactManifest.devDependencies["react-dom"]}`,
      `@types/react@${reactManifest.devDependencies["@types/react"]}`,
      `@types/react-dom@${reactManifest.devDependencies["@types/react-dom"]}`,
      `typescript@${reactManifest.devDependencies.typescript}`,
      `sass@${stylesManifest.devDependencies.sass}`,
    ],
    { cwd: consumerDirectory },
  );

  writeFileSync(
    path.join(consumerDirectory, "smoke.cjs"),
    `const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const react = require("@progressiveui/react");
const reactLegacy = require("@progressiveui/react/dist/index.cjs.js");
const icons = require("@progressiveui/icons-react");
const iconTools = require("@progressiveui/icons-core");
const expectedReactExports = require("./react-public-exports.json");
assert.ok(react.Button);
assert.ok(icons.Add);
assert.equal(typeof iconTools.convertFolder, "function");
assert.deepEqual(Object.keys(react).sort(), expectedReactExports.sort());
assert.deepEqual(Object.keys(reactLegacy).sort(), expectedReactExports.sort());
assert.equal(Object.keys(icons).length, 81);
const packageRoot = path.join(__dirname, "node_modules") + path.sep;
for (const specifier of [
  "@progressiveui/react/package.json",
  "@progressiveui/icons-react/package.json",
  "@progressiveui/icons-core/package.json",
  "@progressiveui/styles/package.json",
  "@progressiveui/themes-core/package.json",
]) {
  assert.ok(require.resolve(specifier).startsWith(packageRoot));
}
const umdContext = {
  React: require("react"),
  ReactDOM: require("react-dom"),
  console,
  setTimeout,
  clearTimeout,
};
umdContext.globalThis = umdContext;
umdContext.window = umdContext;
vm.runInNewContext(
  readFileSync(require.resolve("@progressiveui/react/dist/index.umd.js"), "utf8"),
  umdContext,
);
assert.deepEqual(Object.keys(umdContext.MyViteLibrary).sort(), expectedReactExports.sort());
assert.ok(require.resolve("@progressiveui/styles/styles.css"));
assert.ok(require.resolve("@progressiveui/styles/index"));
console.log(JSON.stringify({ react: Object.keys(react).length, icons: Object.keys(icons).length }));
`,
  );

  writeFileSync(
    path.join(consumerDirectory, "smoke.mjs"),
    `import assert from "node:assert/strict";
import * as react from "@progressiveui/react";
import * as reactLegacy from "@progressiveui/react/dist/index.es.js";
import * as icons from "@progressiveui/icons-react";
import * as iconTools from "@progressiveui/icons-core";
import { config as configFromRoot } from "@progressiveui/themes-core";
import { config as configFromPath } from "@progressiveui/themes-core/config.js";
assert.ok(react.Button);
assert.ok(icons.Add);
assert.equal(typeof iconTools.convertFolder, "function");
assert.equal(typeof configFromRoot, "function");
assert.equal(configFromPath, configFromRoot);
assert.deepEqual(Object.keys(reactLegacy).sort(), Object.keys(react).sort());
`,
  );

  copyFileSync(
    path.join(root, "scripts/fixtures/declaration-consumer/index.tsx"),
    path.join(consumerDirectory, "index.tsx"),
  );
  copyFileSync(
    path.join(root, "scripts/fixtures/declaration-consumer/tsconfig.json"),
    path.join(consumerDirectory, "tsconfig.json"),
  );
  copyFileSync(
    path.join(root, "scripts/fixtures/react-public-exports.json"),
    path.join(consumerDirectory, "react-public-exports.json"),
  );

  writeFileSync(
    path.join(consumerDirectory, "smoke.scss"),
    `@use "pkg:@progressiveui/styles";
@use "pkg:@progressiveui/themes-core/dist/scss/default-css-theme" as theme;
:root {
  @include theme.theme-default();
}
`,
  );

  const commonJsResult = JSON.parse(
    run(process.execPath, ["smoke.cjs"], { cwd: consumerDirectory }),
  );
  run(process.execPath, ["smoke.mjs"], { cwd: consumerDirectory });
  run(
    process.execPath,
    ["node_modules/typescript/bin/tsc", "--project", "tsconfig.json"],
    { cwd: consumerDirectory },
  );
  run(
    process.execPath,
    [
      "node_modules/sass/sass.js",
      "--pkg-importer=node",
      `--load-path=${path.join(consumerDirectory, "node_modules")}`,
      "smoke.scss",
      "smoke.css",
    ],
    { cwd: consumerDirectory },
  );
  const compiledStyles = readFileSync(
    path.join(consumerDirectory, "smoke.css"),
    "utf8",
  );
  assert.ok(
    compiledStyles.includes(".wfp--btn"),
    "Compiled Sass omitted the public wfp--btn class",
  );
  assert.ok(
    compiledStyles.includes("--background-"),
    "Compiled Sass omitted generated background tokens",
  );

  console.log(
    `Packed-package smoke tests passed in an isolated consumer: React ${commonJsResult.react} exports, icons ${commonJsResult.icons} exports, ESM, CommonJS, UMD, compiled Sass and strict TypeScript.`,
  );
  console.log(
    packedPackages
      .map(
        ({ name, files, unpackedSize }) =>
          `${name}: ${files.length} files, ${unpackedSize} bytes unpacked`,
      )
      .join("\n"),
  );
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
