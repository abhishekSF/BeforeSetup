# BeforeSetup — the five minutes before you touch Setup

A free, independent field guide to the Salesforce platform.

It is deliberately **not** a Trailhead competitor. Trailhead teaches step by step
with badges; BeforeSetup answers the questions that come first: *what is this
thing, how does it connect to everything else, do I even need it — and when
there are three ways to do it, which one do I pick?*

## What's inside

- **Decision pages** — six recurring "X vs Y" questions of the platform,
  answered with a situation-by-situation matrix and a committed rule of thumb.
  "It depends" appears only where it genuinely does — and then says on *what*.
- **Five-minute quick-dives** — 36 platform topics across 9 areas (data model,
  automation, Apex & queries, UI, security, integration, DevOps, AI & agents,
  and architecture & strategy). Every dive follows the same shape: a
  plain-English mental model, when to reach for it, when to think twice, and
  the pitfalls that generate real support tickets.
- **The latest wave covered** — Agentforce and the 360 rebrand, Data 360
  (formerly Data Cloud), Headless 360 and Hosted MCP Servers, and the
  Claudeforce / AIforce partnership (August 2026). Each topic carries
  `lifecycle` (GA / beta / pilot) and `packaging` (core / edition-gated /
  add-on / consumption) metadata so SKU reality is never a footnote.
- **Interactive topic map** — the connections between topics drawn as edges.
  Hover to see relationships, click to dive in.
- **Curated onward links** — each dive ends with official docs, Trailhead
  modules, and community resources labeled *intro*, *practical*, or *deep*.
- **Start-here paths** — opinionated reading orders for admins/declarative
  builders, developers, architects, consultants, and builders tracking the AI
  & Agentforce wave.
- **Search** — filter every topic by title, mental model, or pitfall text.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · lucide icons.
All content lives as typed data in [`src/data/`](src/data/) — adding a topic or
a decision page is adding one object to a file, no CMS required.

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
   `whenToAvoid` / `pitfalls` bullets, `related` slugs, `resources`, and the
   metadata trio: `updatedOn`, `lifecycle`, `packaging` (plus `editionNote`
   when the SKU story needs a warning).
3. Add a short display label for the map in `src/components/topic-map.tsx`.

The map layout, search index, topic page, and related-topic links all derive
from the data automatically.

## Adding a decision page

Add a `Versus` object to [`src/data/versus.ts`](src/data/versus.ts): the
question as someone would type it in Slack, the options (with topic slugs where
a dive exists), a matrix of situations with a committed pick per row, and 3–5
rule-of-thumb bullets. The route, index card, and topic cross-links derive from
the data.

## License

[MIT](LICENSE).

## Trademark note

BeforeSetup is an independent community resource, not affiliated with,
sponsored by, or endorsed by Salesforce. Salesforce, Trailhead, Apex,
Lightning, and Agentforce are trademarks of Salesforce, Inc. All content is
original; every topic links to the official documentation as the source of
truth.
