# Contributing to BeforeSetup

Content lives as typed data in `src/data/`. Run `npm run quality` before you open a PR. See [QUALITY.md](QUALITY.md) for the gates.

## Run locally

```bash
npm install
npm run dev -- --port 4780
```

Open http://localhost:4780. Run `npm test` while you edit.

## Add a topic

1. Add a `Topic` object to the matching file in `src/data/topics/`. To add a new area, add a category in `src/data/categories.ts` first.
2. Fill `slug`, `title`, `tagline`, two or three `mentalModel` paragraphs, `whenToUse`, `whenToAvoid`, `pitfalls`, `related`, `resources`, `updatedOn` as `YYYY-MM-DD`, `lifecycle`, and `packaging`.
3. Point `related` at real slugs. Do not include the topic's own slug. Do not repeat a slug.
4. Give at least one resource whose host is `salesforce.com`. Community links can sit next to that official link.
5. If `packaging` is not `core`, set `editionNote`. Quote official packaging language. If you cannot verify a SKU, write a conservative note.
6. Add a short map label in `SHORT_LABEL` in `src/lib/topic-map-layout.ts`.
7. Catalog tests fail when slugs, dates, HTTPS URLs, or map labels drift.

## Add a decision page

Add a `Versus` object to `src/data/versus.ts`. Set `question` to the sentence someone would type in Slack. Include option labels and a matrix. Each `pick` must be one of those labels, or `null` when the answer depends on the note. Write three to five `ruleOfThumb` bullets.

## Add a start-here path

Edit `src/data/paths.ts`. Every `steps[].topic` must be a real slug. Do not repeat a topic in the same path.

## Salesforce facts

Do not invent platform behavior, API names, edition SKUs, lifecycle, or documentation URLs. Lifecycle values are GA, beta, or pilot. Prefer official docs. If you cannot verify a claim, do not ship it.

## Open a pull request

Keep the diff small. Do not mix refactors into a content change.
Run `npm run quality`. CI also runs `npm run build:pages`.
Use the PR template.
