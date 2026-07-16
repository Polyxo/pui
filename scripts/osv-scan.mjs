#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scannerVersion = "2.3.8";
const scannerImage =
  "ghcr.io/google/osv-scanner:v2.3.8@sha256:64e86bec6df2466feea5137fc7c78fb3b7c21ec077f014d7130f64810e50676b";
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const wrapperArgs = process.argv.slice(2);

if (wrapperArgs.length > 1 || (wrapperArgs[0] && wrapperArgs[0] !== "--json")) {
  console.error("Usage: yarn security:scan [-- --json]");
  process.exit(2);
}

const scannerArgs = ["scan", "source", "--lockfile", "yarn.lock"];
if (wrapperArgs[0] === "--json") scannerArgs.push("--format", "json");

const run = (command, args, options = {}) =>
  spawnSync(command, args, {
    cwd: repositoryRoot,
    stdio: "inherit",
    ...options,
  });

const configuredBinary = process.env.OSV_SCANNER_BIN;
let result;

if (configuredBinary) {
  const version = spawnSync(configuredBinary, ["--version"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  if (version.error || version.status !== 0) {
    console.error(
      `Unable to execute OSV_SCANNER_BIN=${configuredBinary}. Install OSV-Scanner ${scannerVersion} or unset OSV_SCANNER_BIN to use Docker.`,
    );
    process.exit(version.status ?? 127);
  }

  const versionOutput = `${version.stdout ?? ""}${version.stderr ?? ""}`;
  const reportedVersion = versionOutput.match(
    /^osv-scanner version:\s*(\S+)$/m,
  )?.[1];
  if (reportedVersion !== scannerVersion) {
    console.error(
      `OSV_SCANNER_BIN must report version ${scannerVersion}; received: ${reportedVersion ?? "unknown"}`,
    );
    process.exit(1);
  }

  result = run(configuredBinary, scannerArgs);
} else {
  const docker = spawnSync(
    "docker",
    ["version", "--format", "{{.Server.Version}}"],
    { encoding: "utf8" },
  );

  if (docker.error || docker.status !== 0) {
    console.error(
      `OSV-Scanner ${scannerVersion} is required. Start Docker or set OSV_SCANNER_BIN to a pinned local binary.`,
    );
    process.exit(docker.status ?? 127);
  }

  result = run("docker", [
    "run",
    "--rm",
    "--volume",
    `${path.join(repositoryRoot, "yarn.lock")}:/src/yarn.lock:ro`,
    "--workdir",
    "/src",
    scannerImage,
    ...scannerArgs,
  ]);
}

if (result.error) {
  console.error(result.error.message);
  process.exit(127);
}

process.exit(result.status ?? 1);
