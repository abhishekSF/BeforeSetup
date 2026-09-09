# BeforeSetup

The five minutes before you touch Setup.

A free, independent field guide to the Salesforce platform.

**Live site.** [https://abhisheksf.github.io/BeforeSetup/](https://abhisheksf.github.io/BeforeSetup/)

Trailhead teaches step by step with badges. BeforeSetup answers the questions that come first. What is this thing. How does it connect to everything else. Do you even need it. When there are three ways to do it, which one do you pick.

## What is inside

- **Decision pages.** Six recurring X versus Y questions. Each page has a situation-by-situation matrix and a committed rule of thumb. "It depends" appears only when it is true. Then the page says what it depends on.
- **Five-minute quick-dives.** 36 platform topics across 9 areas: data model, automation, Apex and queries, UI, security, integration, DevOps, AI and agents, and architecture and strategy. Every dive has a plain-English mental model, when to reach for it, when to think twice, and the pitfalls that generate real support tickets.
- **Current wave.** Agentforce and the 360 rebrand. Data 360, previously Data Cloud. Headless 360 and Hosted MCP Servers. The Claudeforce and AIforce partnership from August 2026. Each topic has `lifecycle` of GA, beta, or pilot. Each topic has `packaging` of core, edition-gated, add-on, or consumption. Those fields carry the SKU limits.
- **Interactive topic map.** Connections between topics drawn as edges. Hover to see relationships. Click to open a dive.
- **Curated onward links.** Each dive ends with official docs, Trailhead modules, and community resources labeled *intro*, *practical*, or *deep*.
- **Start-here paths.** Opinionated reading orders for admins and declarative builders, developers, architects, consultants, and builders tracking the AI and Agentforce wave.
- **Search.** Filter every topic by title, mental model, or pitfall text.

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, lucide icons.
All content lives as typed data in [`src/data/`](src/data/). Adding a topic or a decision page is adding one object to a file.

## Run locally

```bash
npm install
npm run dev -- --port 4780
```

Then open http://localhost:4780.

The production site is a static export on GitHub Pages at `/BeforeSetup/`. CI builds that export with `npm run build:pages`. On `main`, it publishes the `gh-pages` branch.

To add a topic, a decision page, or a path, follow [CONTRIBUTING.md](CONTRIBUTING.md).

## Quality gates

Every PR runs `npm run quality`. See [QUALITY.md](QUALITY.md) for the limits and how each gate is enforced.

```bash
npm run quality
```

## License

[MIT](LICENSE).

## Trademark note

BeforeSetup is a free, independent community field guide. It is not affiliated with, sponsored by, or endorsed by Salesforce. Salesforce, Trailhead, Apex, Lightning, and Agentforce are trademarks of Salesforce, Inc. All content is original. Every topic links to the official documentation as the source of truth.
