import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");

const reactEsm = await import("@progressiveui/react");
const reactCjs = require("@progressiveui/react");
assert.deepEqual(
  Object.keys(reactEsm).sort(),
  Object.keys(reactCjs).sort(),
  "React ESM and CommonJS exports differ",
);

const reactLegacyEsm = await import("@progressiveui/react/dist/index.es.js");
const reactLegacyCjs = require("@progressiveui/react/dist/index.cjs.js");
assert.deepEqual(
  Object.keys(reactLegacyEsm).sort(),
  Object.keys(reactEsm).sort(),
  "Legacy React ESM alias differs from the native ESM entry",
);
assert.deepEqual(
  Object.keys(reactLegacyCjs).sort(),
  Object.keys(reactCjs).sort(),
  "Legacy React CommonJS alias differs from the native CommonJS entry",
);

const iconsEsm = await import("@progressiveui/icons-react");
const iconsCjs = require("@progressiveui/icons-react");
assert.deepEqual(
  Object.keys(iconsEsm).sort(),
  Object.keys(iconsCjs).sort(),
  "Icon ESM and CommonJS exports differ",
);

const iconTools = require("@progressiveui/icons-core");
const iconToolsEsm = await import("@progressiveui/icons-core");
assert.equal(typeof iconTools.convertFolder, "function");
assert.equal(typeof iconTools.jsx, "function");
assert.equal(typeof iconToolsEsm.convertFolder, "function");
assert.equal(typeof iconToolsEsm.jsx, "function");

const themes = await import("@progressiveui/themes-core/config.js");
assert.equal(typeof themes.config, "function");
assert.ok(require.resolve("@progressiveui/styles/styles.css"));
assert.ok(require.resolve("@progressiveui/styles/index"));

const umdContext = {
  React: require("react"),
  ReactDOM: require("react-dom"),
  console,
  setTimeout,
  clearTimeout,
};
umdContext.globalThis = umdContext;
umdContext.window = umdContext;
try {
  vm.runInNewContext(
    readFileSync(path.join(root, "packages/react/dist/index.umd.js"), "utf8"),
    umdContext,
  );
} catch (error) {
  throw new Error(`React UMD initialization failed: ${error.message}`);
}
assert.deepEqual(
  Object.keys(umdContext.MyViteLibrary).sort(),
  Object.keys(reactEsm).sort(),
  "React UMD and ESM exports differ",
);

const declarationsRoot = path.join(root, "packages/react/dist");
const declarationFiles = [];
const collectDeclarations = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectDeclarations(fullPath);
    else if (entry.name.endsWith(".d.ts")) declarationFiles.push(fullPath);
  }
};
collectDeclarations(declarationsRoot);

const forbiddenDeclaration = declarationFiles.find((file) =>
  /(?:^|\/)(?:__tests__|othersrc)(?:\/|$)|(?:^|[.\/_-])(?:test|stories|legacy|old)(?:[.\/_-]|$)/i.test(
    path.relative(declarationsRoot, file).replaceAll(path.sep, "/"),
  ),
);
assert.equal(
  forbiddenDeclaration,
  undefined,
  `Non-production declaration emitted: ${forbiddenDeclaration}`,
);

const tsc = path.join(root, "node_modules/typescript/bin/tsc");
const declarationConsumer = spawnSync(
  process.execPath,
  [tsc, "--project", "scripts/fixtures/declaration-consumer/tsconfig.json"],
  { cwd: root, encoding: "utf8" },
);
if (declarationConsumer.status !== 0) {
  process.stderr.write(declarationConsumer.stdout);
  process.stderr.write(declarationConsumer.stderr);
  process.exit(declarationConsumer.status ?? 1);
}

console.log(
  `Package smoke tests passed: React ${Object.keys(reactEsm).length} exports, icons ${Object.keys(iconsEsm).length} exports, ${declarationFiles.length} declaration files.`,
);
