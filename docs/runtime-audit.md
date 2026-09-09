# Runtime audit

Date: 2026-09-09  
Source head: `c2e68158eaf2c98fa069c3c3ae5cdc82189db5f8` (`Finish accessible search naming and document validation blockers`)  
Scope: read-only inspection of `BeforeSetup` source and the existing `.next` snapshot. No server, browser, rebuild, or release decision was run. The byte figures below describe this local generated build snapshot and are not Core Web Vitals.

## SEO and generated output

- The snapshot has 52 application route HTML files: `/`, `/topics`, `/versus`, `/map`, `/start`; 36 `/topics/:slug` pages; 6 `/versus/:slug` pages; and 5 `/start/:slug` pages. The two additional HTML files are `_not-found` and `_global-error`.
- `src/app/sitemap.ts` enumerates the same 52 URLs (5 index routes + 36 topics + 6 decisions + 5 paths), with `lastModified` on topic and decision entries. The compiled route bundle contains the fallback sitemap origin `http://localhost:4780/sitemap.xml` when `NEXT_PUBLIC_SITE_URL` is absent.
- Compiled `robots.txt` route output is `User-agent: *`, `Allow: /`, and `Sitemap: http://localhost:4780/sitemap.xml` under the absent environment variable. This is a deployment requirement: production must provide `NEXT_PUBLIC_SITE_URL`; no production domain is asserted by this audit.
- Every normal HTML route has a title, description, canonical, and Open Graph title/description. The checked output uses `http://localhost:4780` for all absolute canonical and OG image URLs because the build environment did not provide `NEXT_PUBLIC_SITE_URL`. Topic pages have unique titles/descriptions and canonical paths.
- All 36 topic HTML files contain one parseable `application/ld+json` block with both `Article` and `BreadcrumbList`; no JSON parse failures were found. Article pages contain SSR text: each has an `<h1>`, “The mental model”, and substantial visible article content in the parsed body. Non-topic decision/path pages do not emit Article JSON-LD, consistent with their page types.

## Atlas runtime and performance evidence

- `AtlasDepth` uses an `IntersectionObserver` and dynamically imports `./atlas-renderer` only after the decorative host intersects. The renderer caps `devicePixelRatio` at `1.5`; it pauses animation when offscreen, when `document.hidden`, or when `prefers-reduced-motion` matches. Resize and visibility listeners are cleaned up, geometry/material/renderer are disposed, and constructor failure marks `data-renderer="unavailable"`.
- Fixed in source after this snapshot: `webglcontextlost` now latches a mount-scoped `contextLost` state. `frame`, `update`, resize, visibility, reduced-motion, and intersection callbacks remain inert after loss, leaving the semantic fallback available. A regression now exercises queued frame plus every lifecycle trigger, asserting no post-loss render, loop restart, or resize. The existing generated `.next` snapshot predates this fix and should not be used as evidence that the fixed behavior is deployed.
- Existing build static chunks: 16 files, 1,367,478 raw bytes; gzip sizes summed per file are 387,765 bytes. The largest raw chunks are `3ba7xfn80ropa.js` (524,412; gzip 128,776), `3byuobrkyz9bj.js` (229,156; gzip 71,459), and `2-rtuqsgzmno4.js` (165,743; gzip 44,924). `three`/`WebGLRenderer` references are present in `0pmtel_ew7s8l.js` and `3ba7xfn80ropa.js`; these are snapshot asset sizes, not route transfer sizes or CWV measurements.

## Semantic/accessibility review

- The map has a semantic DOM fallback: the topic links are rendered in `.atlas-topic-list` below the SVG, with 44px minimum link height and one-column mobile layout. Decision matrices use a caption, column scopes, and a keyboard-focusable overflow region.
- The SVG nodes are keyboard-focusable links with topic labels and focus styling on the circle. However, `.atlas-node:focus { outline: none; }` relies on the circle rule for the visible indicator; this needs a human/axe check at actual focus contrast and across browsers.
- `.atlas-topic-list` is a generic `<div aria-label="Atlas topics">`; the label does not give a generic div a landmark/role and may be flagged or provide little value. Verify with the owned axe run; this is recorded as a human/tool check rather than a confirmed failure.
- No `touch-action` rule exists for the map or SVG. Touch/pointer behavior, hit target separation, and whether the desktop hover explanation is understandable on touch need an actual device/browser check.
- Reduced-motion CSS disables transitions/animations globally, and the Three renderer also stops its loop. WebGL-unavailable and context-loss paths expose a marker and leave the semantic map/fallback DOM available; verify the visual fallback and console behavior manually.

## Checks still requiring the owning validation worker

Run the existing browser/axe workflow against the intended deployed origin after setting `NEXT_PUBLIC_SITE_URL`, and manually exercise: keyboard traversal/focus contrast of SVG nodes, mobile topic fallback and touch targets, WebGL-disabled startup, context loss followed by resize/visibility/motion changes, and the production robots/sitemap absolute origin. This audit does not make a release verdict.
