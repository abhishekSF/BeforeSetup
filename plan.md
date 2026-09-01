# Plan — from prototype to field guide

**Repo:** `abhishekSF/orgatlas` (rename to `beforesetup` pending on GitHub — a two-click owner action in Settings; content rename is done)
**Name: DECIDED — BeforeSetup** (2026-09-01). Verified clean: the string exists only as a generic lifecycle-hook name in Video.js/werf/NestJS docs — no product, no company, no trademark, nothing Salesforce-adjacent. The tagline comes free: "the five minutes before you touch Setup."
**Baseline verified:** 2026-08-31 · 36 topics / 9 categories / 5 paths · builds clean from the GitHub clone
**Status of this doc:** my synthesis of the external critique-derived plan, corrected against the actual codebase, with schemas fixed and open decisions isolated.

---

## 1. What I agree with, unreservedly

The critique gets the product definition right, and it is sharper than the framing I built under:

- **The unit of value is a decision, not a description.** Topic pages answer "what is X." The question practitioners actually have is "Flow vs trigger vs scheduled path?" Versus pages are the page people bookmark, and they map to the highest-intent searches in the ecosystem. This is the spine of the plan; everything else is negotiable.
- **The map is a bet, not the product.** If instrumentation shows near-zero map click-through, the field guide loses nothing by demoting the SVG to `/map`. Content survives the graph.
- **Every edge needs a nameable predicate.** "If you cannot name the predicate, delete the edge" is the best forcing function in the document. Unlabeled curves are decoration.
- **Live URL before GitHub evangelism.** A stranger on a phone is the test.
- **The non-goals list.** No org connection (that is oAtlas/Elements territory — and staying out is also our trademark defense in prose form), no AI chat over the topics until the pages are good, no CMS, no breadth-chasing into Industries/Marketing/Field Service.

## 2. The rename is mandatory — verified, not just asserted

I checked. There are at least three live products named OrgAtlas:

1. An AI lead-intelligence company (flagship "White Rabbit").
2. A Perth-based organizational-knowledge company whose product is literally "a dynamic, searchable network called the 'Atlas'."
3. **Deloitte's OrgAtlas® — a registered trademark** on a workforce-analytics platform.

Item 3 alone ends the debate. Rename before anything public.

On the shortlist: **Switchback** has no Salesforce-adjacent collision, but the dev-tools namespace is crowded — a Rust AI gateway, a PyPI scraping package (owns `pip install switchback`), an AI model router, and switchback.tech (calendar app). The bare GitHub and PyPI slugs are taken. Verdict: ownable in this niche **only with a qualified slug** (`switchbacksf`, `switchback-guide`) and a confirmed domain. **Waymark** stays warm as fallback. Verify domain availability before locking; do not workshop past these two.

- **Decision needed (user):** lock Switchback vs Waymark + buy the domain. Everything in Phase 1 queues behind this.

## 3. Corrections to the draft plan (where it drifted from reality)

The critique was written against a stale snapshot. Corrections, so we don't build what already exists:

| Draft plan claim | Reality |
|---|---|
| "Governor limits should be a first-class node, not a footnote under Apex" | Already a first-class topic in the Apex & Queries cluster |
| "Add Experience Cloud" | Already a topic (UI cluster) |
| "Add permission set groups" | Covered inside the profiles/permission-sets dive; standalone node not obviously earned |
| "Repo has no `public/` folder" (blocking favicon/OG) | Not blocking: favicon ships as `src/app/icon.svg`; OG image goes to `src/app/opengraph-image.png` (App Router convention). No `public/` needed |
| "~50 topics" (my own earlier claim) | 36 exist. The ~50 was an unbuilt expansion roadmap (CRM Processes cluster + Layer-2/3 topics). **Parked** behind the first six versus pages, per this plan's own rule |

Real gaps that survive the audit: **package types** (unmanaged/unlocked/managed/2GP), **Slack + Salesforce**, and flexipage-vs-LWC-vs-screen-flow — which is a *versus page*, not a topic, proving the thesis.

Two deploy blockers the draft missed:

- The GitHub mirror has **no `package-lock.json`** (omitted during the API-based push). Commit one from a local clone before pointing Vercel at the repo.
- **No LICENSE** (draft covers this — MIT, default yes).

## 4. Schema changes (corrected versions)

The draft's `Versus` schema fails against its own first six pages: `options: string[]` as topic slugs cannot represent "scheduled path" (a Flow flavor), Data Import Wizard, Bulk API, unlocked packages, or prompt templates — none are topics. And the `Availability` enum conflates packaging with lifecycle (Data 360 is *both* add-on *and* GA).

```ts
// src/data/types.ts — additions

export type Lifecycle = "ga" | "beta" | "pilot" | "renamed" | "retired";
export type Packaging = "core" | "edition-gated" | "add-on" | "consumption";

export interface VersusOption {
  label: string;        // "Scheduled path", "Data Import Wizard"
  topic?: string;       // slug, when a dive exists
}

export interface Versus {
  slug: string;
  title: string;                 // "Flow vs Apex trigger vs scheduled path"
  question: string;              // the Slack-message form of the decision
  options: VersusOption[];
  matrix: {
    criterion: string;           // "Record-change, same transaction"
    pick: string | string[] | null;  // option label(s); null = "it depends" — where honest judgment lives
    note: string;
  }[];
  ruleOfThumb: string[];         // 3–5 bullets
  relatedTopics: string[];       // topic slugs
  updatedOn: string;
}

export interface Topic {
  // …existing fields…
  updatedOn: string;             // ISO date — backfill all 36
  lifecycle: Lifecycle;
  packaging: Packaging;
  editionNote?: string;          // "Add-on SKU. Do not assume it is in EE."
}
```

**Edge predicates are a bigger lift than one bullet.** `related` is bare slugs across all 36 topic files; predicates mean typed edges (`{ to: string; predicate: "calls" | "requires" | "supersedes" | "choose-instead" | "conflicts-with" }`) touching every data file. Do it as its own PR, after the first versus pages exist — versus pages will *reveal* which predicates the map actually needs (`choose-instead` edges come straight from versus data).

## 5. Sequenced workstreams

Ordered phases, each with a done-condition. No phase starts before its blocker clears.

### Phase 1 — Exist (blocked on: name decision)
1. Rename PR: repo, `package.json`, layout metadata + OG tags, header/footer/H1, README, trademark note.
2. MIT `LICENSE`.
3. Commit `package-lock.json` to the mirror.
4. `src/app/opengraph-image.png` + metadata pass.
5. Vercel deploy from `main`, custom domain. Analytics on from day one (Vercel Analytics or Plausible) — retrofitting after launch loses the only clean baseline.
6. README: live URL on top, map + topic-page screenshots.

**Done when:** a stranger can open the URL on a phone, and pageviews are being counted.

### Phase 2 — Prove the job (can start schema work immediately, before rename)
1. Type additions from §4; backfill `updatedOn`/`lifecycle`/`packaging` on all 36 topics.
2. Versus pages, in this order (each links back to its topic dives):
   1. Flow vs Apex trigger vs scheduled/batch
   2. Lookup vs master-detail vs junction
   3. Profile vs permission set vs permission set group
   4. Import Wizard vs Data Loader vs Bulk API vs integration
   5. Change sets vs DevOps Center/scratch orgs vs unlocked packages
   6. Prompt template + Flow vs Agentforce topic/action
3. Homepage CTA becomes "Start with a decision" alongside "Open the map."

**Done when:** all six versus pages are live and a versus page is the homepage's primary CTA.

### Phase 3 — Make the map earn its slot
1. Filters above the map: role, category, lifecycle, "AI wave only," path highlight (dim off-path, label why remaining edges exist).
2. Typed-edge migration (§4) + hover predicates; `choose-instead` edges drawn in a distinct stroke, sourced from versus data.
3. Mobile: the filterable list *is* the map on a phone — same data, same filters, no SVG pretense.
4. Instrument map vs search vs path vs versus click-through.

**Done when:** a consultant can isolate "inheriting a messy org, declarative-first" in one gesture — and we have per-surface click data.

### Phase 4 — Content as a release train
1. "Changed this season" strip (renames, GA, pilot, deprecated patterns) driven by `lifecycle` + `updatedOn`.
2. `CONTRIBUTING.md` + issue template. Checklist: pitfalls must be ticket-shaped; resources labeled intro/practical/deep; no unlinked SKU claims.
3. Gap fills, in priority order: package types → Slack + Salesforce → then (and only then) reconsider the parked CRM Processes cluster from the old expansion roadmap.

**Done when:** a seasonal release can be reflected in data files in one sitting and the strip stays truthful.

### Phase 5 — Distribution
Five value-first posts, one pitfall cluster each (admins: automation storms on a 100k load; developers: the trigger that should have been a Flow; architects: org strategy before another cloud; consultants: discovery before Setup; AI builders: Agentforce vs Flow + prompt). Trailblazer Community, r/salesforce, one UG talk, one LinkedIn screenshot of a *versus* page, Stack Exchange answers only where the dive is the actual answer.

**The metric:** versus-page reads > 60s and return visits within 14 days. Stars and map screenshots are vanity. **The kill rule:** if map click-through stays near zero after ~200 sessions, the SVG moves off the homepage to `/map` and we stop polishing it.

## 6. Explicit non-goals (unchanged, endorsed)

No accounts/auth/personalization · no org/metadata-API connection · no AI chat over topics · no CMS · no Trailhead-breadth chase · no monetization · no design-system rewrite.

## 7. Decisions needed (user), with defaults

1. **Name:** ~~Switchback vs Waymark~~ **RESOLVED: BeforeSetup** (user's pick, collision-checked clean). Remaining owner action: rename the GitHub repo in Settings and buy beforesetup.dev.
2. **Domain:** `.dev` preferred; `*.vercel.app` acceptable for ≤ a week, never for launch posts.
3. **License:** MIT. Default yes.
4. **Repo visibility post-rename:** public the hour the URL works. Default yes (it is already public).
5. **Topic PRs:** named reviewers only at first; open up when CONTRIBUTING.md + checklist exist.

## 8. Definition of done, v1

- [ ] Name with zero Atlas/OrgAtlas gravity, domain live
- [ ] Public URL + analytics from day one
- [ ] MIT LICENSE + lockfile in repo
- [ ] Six versus pages shipped
- [ ] All 36 topics carry `updatedOn` + `lifecycle` + `packaging`
- [ ] Map filters by role and lifecycle — or the map is off the homepage
- [ ] README: screenshots + live link
- [ ] One week of real traffic and an honest read on whether anyone uses the graph

If all boxes tick and the graph goes unused, the field guide still succeeded — that was the design.
