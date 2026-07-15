import { spawnSync } from "node:child_process";

const status = spawnSync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all"],
  { encoding: "utf8" },
);

if (status.status !== 0) {
  process.stderr.write(status.stderr);
  process.exit(status.status ?? 1);
}

if (status.stdout.trim()) {
  process.stderr.write(
    "Validation changed tracked or publishable files:\n" + status.stdout,
  );
  process.exit(1);
}

console.log("Generation cleanliness check passed.");
