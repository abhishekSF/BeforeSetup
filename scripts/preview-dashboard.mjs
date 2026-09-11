#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2];
if (!root) {
  console.error("usage: preview-dashboard.mjs <previews-dir>");
  process.exit(1);
}

const amp = String.fromCharCode(38);
const ENTITY = {
  "&": `${amp}amp;`,
  "<": `${amp}lt;`,
  ">": `${amp}gt;`,
  '"': `${amp}quot;`,
  "'": `${amp}#39;`,
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ENTITY[ch] ?? ch);
}

function writeMeta() {
  const number = process.env.PR_NUMBER;
  if (!number) return;
  const target = path.join(root, `pr-${number}`);
  if (!fs.existsSync(target)) return;
  const meta = {
    number: Number(number),
    title: process.env.PR_TITLE || `PR #${number}`,
    ref: process.env.PR_REF || process.env.PR_SHA,
    sha: process.env.PR_SHA,
    url: process.env.PR_URL,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(target, "meta.json"), JSON.stringify(meta, null, 2));
}

function loadEntries() {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^pr-\d+$/.test(entry.name))
    .map((entry) => {
      const file = path.join(root, entry.name, "meta.json");
      if (!fs.existsSync(file)) return null;
      try {
        return { dir: entry.name, ...JSON.parse(fs.readFileSync(file, "utf8")) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.number - a.number);
}

function renderCards(entries) {
  if (entries.length === 0) {
    return `<p class="empty">No PR previews are currently published.</p>`;
  }
  return entries
    .map(
      (entry) => `
              <article class="card">
                <div class="kicker">PR #${escapeHtml(entry.number)}</div>
                <h2>${escapeHtml(entry.title)}</h2>
                <p>${escapeHtml(entry.ref || entry.sha || "")}</p>
                <div class="actions">
                  <a class="primary" href="./${encodeURIComponent(entry.dir)}/">Open preview</a>
                  <a href="${escapeHtml(entry.url)}">GitHub PR</a>
                </div>
              </article>`
    )
    .join("");
}

const css = [
  ":root{font-family:ui-sans-serif,system-ui,sans-serif;color:#edece7;background:#0b0e12;color-scheme:dark}",
  "*{box-sizing:border-box}body{margin:0}",
  "main{max-width:980px;margin:auto;padding:56px 22px 80px}",
  ".eyebrow{font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase;color:#9babbc}",
  "h1{font-size:clamp(34px,6vw,62px);letter-spacing:-.055em;line-height:1;margin:12px 0 14px;font-weight:550}",
  ".intro{max-width:650px;color:#a3acb8;line-height:1.65}",
  ".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:36px}",
  ".card{background:#11161c;border:1px solid #2a323d;border-radius:12px;padding:22px}",
  ".kicker{font-size:12px;color:#9babbc;text-transform:uppercase;letter-spacing:.08em}",
  ".card h2{font-size:20px;line-height:1.25;margin:10px 0;font-weight:550}",
  ".card p{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:#a3acb8;overflow-wrap:anywhere}",
  ".actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}",
  "a{display:inline-flex;text-decoration:none;color:#8ac2ff;border:1px solid #2a323d;padding:9px 12px;border-radius:8px;font-weight:600;font-size:14px}",
  ".primary{background:#8ac2ff;color:#0a192b;border-color:#8ac2ff}",
  ".production{margin-top:28px}.empty{margin-top:28px;color:#a3acb8}",
].join("");

writeMeta();
const cards = renderCards(loadEntries());
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BeforeSetup previews</title><style>${css}</style></head>
<body><main><div class="eyebrow">BeforeSetup / design review</div><h1>PR previews</h1><p class="intro">Compare live website iterations without touching production. Each card is built from that pull request and published under its own GitHub Pages path.</p><p class="production"><a href="/BeforeSetup/">Open production</a></p><section class="grid">${cards}</section></main></body></html>`;
fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(path.join(root, "index.html"), html);
