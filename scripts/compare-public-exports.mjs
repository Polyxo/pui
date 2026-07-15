import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const expected = JSON.parse(
  await readFile(
    new URL("./fixtures/react-public-exports.json", import.meta.url),
    "utf8",
  ),
);
const current = Object.keys(await import("@progressiveui/react")).sort();

const removed = expected.filter((name) => !current.includes(name));
const added = current.filter((name) => !expected.includes(name));

assert.deepEqual(removed, [], `Removed public exports: ${removed.join(", ")}`);
assert.deepEqual(added, [], `Unreviewed public exports: ${added.join(", ")}`);

console.log(`Public React export surface unchanged (${current.length} exports).`);
