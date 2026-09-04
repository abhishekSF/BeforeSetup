#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const treeKill = path.join(root, "node_modules", "tree-kill", "index.js");
if (fs.existsSync(treeKill)) {
  const original = fs.readFileSync(treeKill, "utf8");
  const patched = original.replace(
    "allData.match(/\\d+/g).forEach",
    "(allData.match(/\\d+/g) || []).forEach"
  );
  if (patched !== original) {
    fs.writeFileSync(treeKill, patched);
  }
}

const env = { ...process.env };
const probe = spawnSync("ps", ["-o", "pid"], { encoding: "utf8" });
const hasPs = probe.error === undefined && probe.status === 0;
if (!hasPs) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "beforesetup-ps-"));
  const stub = path.join(dir, "ps");
  fs.writeFileSync(
    stub,
    "#!/bin/sh\n# Minimal stub so tree-kill does not crash when procps is absent.\nexit 0\n"
  );
  fs.chmodSync(stub, 0o755);
  env.PATH = `${dir}${path.delimiter}${env.PATH}`;
}

const child = spawn("npx", ["stryker", "run"], {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code === null ? 1 : code);
});
