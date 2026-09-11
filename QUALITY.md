# Quality gates

CI runs `npm run quality` on every pull request. CI fails the job when any gate fails.

## The bar

| Gate | Limit | Enforced by |
| --- | --- | --- |
| Cyclomatic complexity | under 22 | ESLint `complexity`, `scripts/check-metrics.mjs` |
| Cognitive complexity | below 22 | `eslint-plugin-sonarjs` |
| Halstead difficulty | less than 80 | `scripts/check-metrics.mjs` |
| File length | fewer than 500 lines | ESLint `max-lines`, `scripts/check-metrics.mjs` |
| Test coverage | 100% | Vitest v8 coverage thresholds |
| CRAP score | below 25 | `scripts/check-metrics.mjs`. At 100% coverage, CRAP equals complexity. |
| Mutation score | no surviving mutants | Stryker on `src/lib/**` |
| Dead code | zero | knip, ESLint unused, and sonar dead-store |
| Redundant code | zero | jscpd and sonar no-duplicated-branches, no-identical-functions, and no-redundant-* |
| `any` and `unknown` | none | `@typescript-eslint/no-explicit-any` and `no-restricted-syntax` on `TSAnyKeyword` and `TSUnknownKeyword` |

## Commands

```bash
npm run typecheck
npm run lint
npm run coverage
npm run deadcode
npm run dupes
npm run metrics
npm run mutate
npm run quality
npm run build:pages
```

`npm run quality` runs the gates above, in that order. `npm run build:pages` is a separate static export for GitHub Pages. That export uses `basePath` `/BeforeSetup`, or `GITHUB_PAGES_BASE_PATH` when CI is publishing a per-PR preview.

## GitHub Pages

The live site is the `gh-pages` branch. CI sets `GITHUB_PAGES=true`. Then `next.config.ts` uses static export, trailing slashes, and `basePath` `/BeforeSetup`. Pull requests verify that production export. They also publish an isolated preview at `/BeforeSetup/previews/pr-<number>/` and a comparison dashboard at `/BeforeSetup/previews/`. Pushes to `main` publish production after `npm run quality` passes, and they leave the `previews/` folder intact. Closing a PR removes its preview. The workflow writes `out/.nojekyll` and uploads it with hidden files included, so GitHub's Jekyll step does not ignore `_next`.

## Scope notes

**Mutation testing.** Stryker mutates `src/lib`. Files under `src/data` are typed catalogs of prose, not control flow. Mutating their string literals is noise. Tests cover UI chrome. UI chrome stays under the complexity, line-count, and type gates.

**jscpd.** Ignores `src/data` and test files. Repeated topic and versus shapes are the catalog schema.

**CRAP.** `complexity² × (1 − coverage)³ + complexity`. At 100% coverage this equals cyclomatic complexity. The complexity cap of 21 already keeps CRAP under 25.

## Application code

Branching logic lives in `src/lib` as small typed functions with direct unit tests. Pages and components call those functions instead of growing new conditionals. The type gates reject `any` and `unknown`. Missing values are `T | undefined` or `T | null`.
