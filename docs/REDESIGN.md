# System Atlas redesign

This is an incremental change from `0887aa7`, retaining Next.js, all 36 topics,
nine categories, six decisions, five paths, typed catalogs, semantic comparison
tables, and the existing graph layout/edge functions. Existing quality thresholds
and mutation scope are unchanged.

## Design

Graphite surfaces, warm off-white Geist typography, technical Geist Mono
annotations, restrained blue accents, and the existing category colors. Editorial
rows replace generic cards for decisions and paths. A quiet original Three.js
star field sits behind the real SVG graph; no ThreeUI component source was copied.
ThreeUI's browse page returned no inspectable component content in this session,
so the named visual concepts in the brief informed the original treatment.

The desktop header includes a Radix Dialog search palette (Ctrl/Cmd+K). Mobile
uses a native disclosure menu. Topics retain a reading column and contextual
contents rail. Resource rows distinguish source ownership, resource kind, and
editorial review from transport health. No review date is inferred from HTTP 200.

## Accessibility and performance

Category filters are buttons with aria-pressed, atlas nodes are real SVG links,
and focus and hover share relationship highlighting. A complete DOM topic list
remains available; small screens use it for readable touch navigation. Semantic
tables remain tables, with captions, scoped headings, and a focusable scroll
region. Skip navigation, focus indicators, 44px controls, and reduced-motion
styles are included.

The Three.js module is imported only when its host intersects the viewport.
The renderer caps DPR at 1.5, pauses offscreen or in a hidden tab, renders once
for reduced motion, handles unavailable WebGL/context loss, and disposes resources.
Articles remain statically server rendered. Browser runtime and Core Web Vitals
still need production-device measurement; no Lighthouse score is claimed.

## Content review

Corrected Informatica agreement/completion dates using the May 27 and November 18,
2025 Salesforce announcements. Replaced absolute Agentforce pricing assertions
using the official pricing page reviewed September 8, 2026. Qualified rename,
Data 360 prerequisite, SSO/direct-login, provisioning, muting, deployment test-level,
Quick Deploy, and fixed release-window language. Added the API 67.0 boundary in
Apex, LWC, permission guidance, and the developer path without applying class
behavior to triggers.

The current Apex release-note details, agent-type execution documentation,
next-generation DevOps Center feature/migration details, Headless 360 beta status,
and Claudeforce pilot/model claims could not be independently verified from
readable first-party documentation in this session. These are surfaced as review
notes in the affected dives, not presented as a completed factual audit.

## Resource maintenance

`resource-audit.json` records the original 112 unique URLs: 48 healthy, 2 redirects,
16 broken, 46 unable to verify. Removed the 16 confirmed 404 destinations and
canonicalized both redirects (Dynamic Forms and Well-Architected). Every topic
retains a first-party resource. Three reviewed official resources were added:
Agentforce pricing and both Informatica acquisition announcements.

Run `npm run check:links` to check the typed catalog. Weekly/manual CI uploads the
JSON report, fails only on 404/410, and leaves rate limits, denials, timeouts and
server errors as warnings. Two host queues run concurrently; requests within a
host are serial and spaced by 400ms, with 12-second request timeouts. The checker
follows redirects and does not retry. Verify the content and relevance manually
before setting `verifiedOn`; update it only when the source was actually read.

## SEO and deployment

Sitemap, robots, per-route canonicals, per-detail OpenGraph titles/descriptions,
and Article/Breadcrumb JSON-LD are added. The existing OpenGraph image is retained.
Set `NEXT_PUBLIC_SITE_URL` to the actual production origin before deployment;
the existing local fallback is deliberately preserved instead of inventing a domain.

## Validation

The original baseline passes all quality gates. The implementation was checked
with typecheck, ESLint, 100% coverage, knip, jscpd, complexity/Halstead/CRAP/LOC,
and mutation testing (251 killed, zero survivors), plus a successful production
build. Nine HTTP checker tests cover healthy, redirected, broken, denied, limited,
server-error, and timeout outcomes. Final gate results are recorded in the PR.

Playwright + axe CI adds 44 browser cases across 320px, 375px, tablet and desktop:
decision flow, atlas/filter/topic flow without WebGL, topic search, paths, command
palette focus, reduced-motion keyboard navigation, WCAG AA checks and overflow.
A local preview rendered, but its command-palette interaction was not verified
successfully; do not treat screenshots as passing browser tests. CI browser
results must be reviewed before merging. Real midrange-mobile performance and
screen-reader review remain human verification items.
