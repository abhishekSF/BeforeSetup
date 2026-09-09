# Contributing to BeforeSetup

BeforeSetup is a field guide, not a CMS. Content is typed data. The quality bar is `npm run quality` — see [QUALITY.md](QUALITY.md).

## Local setup

```bash
npm install
npm run dev -- --port 4780
```

Open http://localhost:4780. Run `npm test` while you edit.

## Adding a topic

1. Add a `Topic` object to the matching file in `src/data/topics/` (or a new category in `src/data/categories.ts`).
2. Required fields: `slug`, `title`, `tagline`, 2–3 `mentalModel` paragraphs, non-empty `whenToUse` / `whenToAvoid` / `pitfalls`, `related` slugs that exist and are not the topic itself, `resources`, `updatedOn` (`YYYY-MM-DD`), `lifecycle`, `packaging`.
3. At least one resource URL must be on `salesforce.com` (Help, Docs, Trailhead, Architects, or the product site). Community links are welcome beside that, not instead of it.
4. If `packaging` is not `core`, set `editionNote`. Do not invent SKUs — quote official packaging language or leave the note conservative.
5. Add a short map label in `src/lib/topic-map-layout.ts` (`SHORT_LABEL`).
6. Catalog tests will fail if related slugs, dates, HTTPS URLs, or map labels drift.

## Adding a decision page

Add a `Versus` object to `src/data/versus.ts`: Slack-shaped `question`, option labels, a matrix whose `pick` values are those labels (or `null` when it truly depends), and 3–5 `ruleOfThumb` bullets. Do not add a row that is not a committed answer unless the note says what it depends on.

## Adding a start-here path

Edit `src/data/paths.ts`. Every `steps[].topic` must be a real slug; do not repeat a topic in the same path.

## Salesforce facts

Do not invent platform behavior, API names, edition SKUs, lifecycle (GA / beta / pilot), or documentation URLs. Prefer official docs. If you cannot verify a claim, do not ship it.

## Pull requests

- Keep the diff small. No drive-by refactors.
- `npm run quality` must pass. CI also runs a GitHub Pages static export (`npm run build:pages`).
- Use the PR template checklist.
