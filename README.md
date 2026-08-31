# OrgAtlas — the Salesforce topic map

A free, independent orientation layer for the Salesforce platform, inspired by the
"mapped learning" approach of sites like [fanout.sh](https://fanout.sh).

It is deliberately **not** a Trailhead competitor. Trailhead teaches step by step
with badges; OrgAtlas answers the question that comes first: *what is this thing,
how does it connect to everything else, and do I even need it?*

## What's inside

- **Interactive topic map** — 36 platform topics across 9 areas (data model,
  automation, Apex & queries, UI, security, integration, DevOps, AI & agents,
  and architecture & strategy), with the connections between them drawn as
  edges. Hover to see relationships, click to dive in.
- **The latest wave covered** — Agentforce and the 360 rebrand, Data 360
  (formerly Data Cloud), Headless 360 and Hosted MCP Servers, and the
  Claudeforce / AIforce partnership (August 2026).
- **Five-minute quick-dives** — every topic follows the same shape: a plain-English
  mental model, when to reach for it, when to think twice, and the pitfalls that
  generate real support tickets.
- **Curated onward links** — each dive ends with official docs, Trailhead modules,
  and community resources labeled *intro*, *practical*, or *deep*.
- **Start-here paths** — opinionated reading orders for admins/declarative builders,
  developers, architects, consultants, and builders tracking the AI & Agentforce wave.
- **Search** — filter every topic by title, mental model, or pitfall text.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · lucide icons.
All content lives as typed data in [`src/data/topics/`](src/data/topics/) — adding
a topic is adding one object to a file, no CMS required.

## Run it locally

```bash
npm install
npm run dev -- --port 4780
```

Then open http://localhost:4780.

## Adding a topic

1. Add a `Topic` object to the right category file in `src/data/topics/`
   (or create a new category in `src/data/categories.ts`).
2. Give it a `slug`, `tagline`, 2–3 `mentalModel` paragraphs, `whenToUse` /
   `whenToAvoid` / `pitfalls` bullets, `related` slugs, and `resources`.
3. Add a short display label for the map in `src/components/topic-map.tsx`.

The map layout, search index, topic page, and related-topic links all derive
from the data automatically.

## Trademark note

OrgAtlas is an independent community resource, not affiliated with, sponsored by,
or endorsed by Salesforce. Salesforce, Trailhead, Apex, and Lightning are
trademarks of Salesforce, Inc. All content is original; every topic links to the
official documentation as the source of truth.
