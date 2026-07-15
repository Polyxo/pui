import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const temporaryHome = mkdtempSync(path.join(tmpdir(), "pui-storybook-"));

try {
  rmSync("docs", { force: true, recursive: true });

  const result = spawnSync(
    "storybook",
    ["build", "--disable-telemetry", "--output-dir", "docs"],
    {
      env: {
        ...process.env,
        HOME: temporaryHome,
        USERPROFILE: temporaryHome,
      },
      stdio: "inherit",
    },
  );

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(temporaryHome, { force: true, recursive: true });
}
