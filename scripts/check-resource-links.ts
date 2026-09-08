import { mkdir, writeFile } from "node:fs/promises";
import { topics } from "../src/data/topics/index";
import { checkLink } from "./resource-http.mjs";

async function main() {
const urls = [...new Set(topics.flatMap((topic) => topic.resources.map((resource) => resource.url)))];
const results: Awaited<ReturnType<typeof checkLink>>[] = [];
// One request at a time per host, two hosts at a time. No automatic retries.
const hosts = Map.groupBy(urls, (url) => new URL(url).hostname);
const groups = [...hosts.values()];
async function worker() {
  for (let group = groups.shift(); group; group = groups.shift()) {
    for (const url of group) {
      results.push(await checkLink(url));
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
}
await Promise.all([worker(), worker()]);
await mkdir("reports", { recursive: true });
await writeFile("reports/resource-links.json", JSON.stringify({ checkedOn: new Date().toISOString(), results }, null, 2));
for (const result of results) console.log(`${result.status}: ${result.url} (${result.code}) → ${result.canonical}`);
console.log(`Checked ${results.length} unique URLs. HTTP checks do not verify editorial accuracy.`);
if (results.some((result) => result.status === "broken")) process.exitCode = 1;

}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
