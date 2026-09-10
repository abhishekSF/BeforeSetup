import { spawn } from "node:child_process";
// Preserve Next.js, translating only the supervised preview's Vite-style flags.
const args = process.argv.slice(2).filter((arg) => arg !== "--strictPort").map((arg) => arg === "--host" ? "--hostname" : arg);
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", ...args], { stdio: "inherit" });
child.on("exit", (code) => { process.exitCode = code ?? 1; });
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => child.kill(signal));
