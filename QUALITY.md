# Quality gates

BeforeSetup keeps a hard quality bar on application code. CI runs
`npm run quality` on every pull request; a failure is a failed build.

## The bar

| Gate | Limit | Enforced by |
| --- | --- | --- |
| Cyclomatic complexity | under 22 | ESLint `complexity`, `scripts/check-metrics.mjs` |
| Cognitive complexity | below 22 | `eslint-plugin-sonarjs` |
| Halstead difficulty | less than 80 | `scripts/check-metrics.mjs` |
| File length | fewer than 500 lines | ESLint `max-lines`, `scripts/check-metrics.mjs` |
| Test coverage | 100% | Vitest v8 coverage thresholds |
| CRAP score | below 25 | `scripts/check-metrics.mjs` (at 100% coverage, CRAP = complexity) |
| Mutation score | no surviving mutants | Stryker on `src/lib/**` |
| Dead code | zero | knip + ESLint unused + sonar dead-store |
| Redundant code | zero | jscpd + sonar no-duplicated-branches / no-identical-functions / no-redundant-* |
| `any` / `unknown` | none | `@typescript-eslint/no-explicit-any` + `no-restricted-syntax` on `TSAnyKeyword` / `TSUnknownKeyword` |

## Commands

```bash
npm run typecheck
npm run lint
npm run coverage
npm run deadcode
npm run dupes
npm run metrics
npm run mutate
npm run quality          # all of the above, in order
```

## Scope notes

- **Mutation testing** targets `src/lib` — the extracted, branching logic.
  Content files under `src/data` are typed catalogs of prose, not control flow;
  mutating their string literals is noise. UI chrome is covered by tests and
  coverage, and kept below the complexity / LOC / type gates.
- **jscpd** ignores `src/data` (repeated topic/versus shapes are the catalog
  schema, not copy-paste) and test files.
- **CRAP** is `complexity² × (1 − coverage)³ + complexity`. At 100% coverage
  this equals cyclomatic complexity, so the complexity cap of 21 already keeps
  CRAP under 25.

## Adding code

Put branching logic in `src/lib` as small typed functions with direct unit
tests. Pages and components should call those functions, not grow new
conditionals. Do not introduce `any` or `unknown`; model missing values as
`T | undefined` or `T | null`.
