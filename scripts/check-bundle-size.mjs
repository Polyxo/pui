import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const baseline = JSON.parse(
  await readFile(
    new URL("./fixtures/bundle-size-baseline.json", import.meta.url),
    "utf8",
  ),
);
for (const [relativePath, expected] of Object.entries(baseline)) {
  const contents = await readFile(path.join(root, relativePath));
  const current = { raw: contents.byteLength, gzip: gzipSync(contents).byteLength };
  const rawDelta = current.raw - expected.raw;
  const gzipDelta = current.gzip - expected.gzip;

  assert.ok(
    current.raw <= expected.raw * (expected.tolerance ?? 1.05),
    `${relativePath} raw size regressed from ${expected.raw} to ${current.raw}`,
  );
  assert.ok(
    current.gzip <= expected.gzip * (expected.tolerance ?? 1.05),
    `${relativePath} gzip size regressed from ${expected.gzip} to ${current.gzip}`,
  );

  console.log(
    `${relativePath}: ${current.raw} bytes (${rawDelta >= 0 ? "+" : ""}${rawDelta}), gzip ${current.gzip} (${gzipDelta >= 0 ? "+" : ""}${gzipDelta})`,
  );
}
