import type { Topic } from "../types";

export const uiTopics: Topic[] = [
  {
    slug: "experience-cloud",
    title: "Experience Cloud (Portals & Sites)",
    category: "ui",
    tagline:
      "Salesforce for people outside your company — customer portals, partner sites, and the very different security math that comes with them.",
    mentalModel: [
      "Experience Cloud sites are websites built on your org's data, for external users: customers checking cases, partners registering deals, communities answering each other's questions. Same objects, same automation — but the audience holds external licenses with their own (cheaper, more limited) permissions, and the whole security model flips: external org-wide defaults start at Private, and you grant access surgically through sharing sets and share groups.",
      "Two ideas anchor the topic. First, license type is architecture: Customer Community licenses can't hold roles (so sharing works differently) while Partner Community licenses can — pick wrong and you rebuild your sharing design. Second, a site is a security boundary: guest (unauthenticated) users are their own user record with their own profile, and every 'the portal shows too much' incident traces back to guest-user or external-OWD settings someone treated as a formality.",
    ],
    whenToUse: [
      "Customer self-service: case deflection with knowledge articles, case status, community Q&A.",
      "Partner channels: deal registration, shared pipeline, co-branded portals with record-level partitioning between partners.",
      "Any 'log in and see your data' requirement where the data already lives in Salesforce.",
    ],
    whenToAvoid: [
      "Pure marketing/brochure sites with no Salesforce data behind them — a CMS is cheaper and simpler.",
      "Complex bespoke web apps where you're fighting the template system — consider a custom app on Heroku or elsewhere calling Salesforce APIs (or headless patterns).",
      "When per-login/per-member external license costs haven't been modeled — pricing shapes the design.",
    ],
    pitfalls: [
      "Guest user exposure: misconfigured guest profiles and public pages have caused real-world data leaks — audit guest access like a security review, because it is one.",
      "Forgetting external OWD: internal sharing settings don't apply; external defaults are separate and stricter, and sharing sets (not sharing rules) do the work for roleless license types.",
      "Object/feature gaps by license: the external license matrix decides which objects external users can even touch — check it before designing, not after.",
      "Treating the site as 'just another page': performance, SEO, and login UX are product concerns; an unloved portal quietly kills adoption.",
    ],
    related: ["sharing-and-visibility", "profiles-permission-sets", "lightning-web-components", "identity-sso"],
    resources: [
      {
        title: "Expand Your Reach with Experience Cloud (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/trails/communities",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Experience Cloud documentation",
        url: "https://help.salesforce.com/s/articleView?id=experience.networks_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Guest user security best practices",
        url: "https://help.salesforce.com/s/articleView?id=experience.networks_guest_policies_timeline.htm&type=5",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "lightning-app-builder",
    title: "Lightning App Builder & Dynamic Forms",
    category: "ui",
    tagline:
      "Drag-and-drop page building — how record pages, home pages, and apps get their layout without code.",
    mentalModel: [
      "Lightning App Builder is a canvas: you drag components (record details, related lists, charts, custom LWCs) into regions on a page and control who sees which page via activation rules (app, record type, profile). Component visibility rules go further — show this component only when Stage = Closed Won, or only for certain profiles.",
      "Dynamic Forms is the modern evolution for record detail: instead of one monolithic 'Details' block driven by a page layout, fields and sections become individual draggable pieces with their own visibility rules. The page — not the page layout — becomes the primary UI artifact. New builds should default to Dynamic Forms; classic page layouts still control some things (like buttons in some contexts and mobile in others), which is a transitional annoyance to know about.",
    ],
    whenToUse: [
      "Tailoring record pages per app, record type, or profile without code.",
      "Conditional field/section display (show 'Reason Lost' only when Stage = Closed Lost) via Dynamic Forms.",
      "Embedding dashboards, list views, flows, or custom components into home/record pages.",
    ],
    whenToAvoid: [
      "Pixel-perfect custom experiences or complex interactions — that's LWC territory.",
      "Twenty page variations for tiny audience differences — visibility rules on fewer pages beat page sprawl.",
    ],
    pitfalls: [
      "Page proliferation: a page per team per record type quickly becomes unmaintainable — prefer one page with visibility rules where possible.",
      "Forgetting activation: a beautifully built page does nothing until activated for the right app/record type/profile combination.",
      "Mixing paradigms confusingly: half the fields on Dynamic Forms, half still on the legacy layout makes 'where does this field come from?' a puzzle.",
      "Performance: pages stuffed with heavy components (multiple report charts, big related lists) load slowly — use tabs and lazy sections.",
    ],
    related: ["record-types", "lightning-web-components", "profiles-permission-sets", "flow"],
    resources: [
      {
        title: "Lightning App Builder (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Dynamic Forms overview",
        url: "https://help.salesforce.com/s/articleView?id=platform.dynamic_forms_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Break Up Your Record Details with Dynamic Forms",
        url: "https://admin.salesforce.com/blog/2020/break-up-your-record-details-with-dynamic-forms",
        source: "Salesforce Admins Blog",
        level: "practical",
      },
    ],
  },
  {
    slug: "lightning-web-components",
    title: "Lightning Web Components (LWC)",
    category: "ui",
    tagline:
      "Custom UI built on web standards — modern JavaScript components that live inside Salesforce pages.",
    mentalModel: [
      "LWC is Salesforce's component framework built on actual web standards: custom elements, templates, modern JavaScript (classes, modules, decorators like @api and @wire). If you know modern front-end development, most of your knowledge transfers — the platform adds a thin layer: a security sandbox (Lightning Locker/Web Security), base components (lightning-input, lightning-datatable), and data services.",
      "The data-access ladder is the key mental model: first try Lightning Data Service (lightning-record-form and friends — no code, respects security, shares cache), then @wire with UI API adapters, and only then imperative Apex calls for complex queries. Each step down the ladder costs you more caching, security handling, and code to maintain.",
      "Components compose: small LWCs nest inside bigger ones, communicate down via properties, up via events, and across via Lightning Message Service.",
    ],
    whenToUse: [
      "UI requirements App Builder can't meet: custom interactions, third-party visualizations, bespoke workflows.",
      "Reusable widgets used across record pages, apps, Experience Cloud sites, and screen flows.",
      "Replacing legacy Aura components (LWC is faster and the strategic direction).",
    ],
    whenToAvoid: [
      "Anything standard components already do — a custom form that lightning-record-form replicates is pure maintenance debt.",
      "Teams without JavaScript skills on tap — declarative alternatives degrade more gracefully.",
      "Heavy computation client-side — push it to Apex or async processes.",
    ],
    pitfalls: [
      "Skipping the data-access ladder and calling Apex for everything — you lose caching and take on security enforcement (with sharing, FLS checks) yourself.",
      "Forgetting FLS/sharing in Apex controllers: @AuraEnabled methods run in system mode by default — a classic data-leak source.",
      "Not handling loading and error states — @wire results arrive asynchronously; blank screens and console errors frustrate users.",
      "Overusing pub-sub/LMS where a simple parent-child property or event would do — architecture astronautics in miniature.",
    ],
    related: ["lightning-app-builder", "apex", "rest-apis", "flow"],
    resources: [
      {
        title: "Build Lightning Web Components (Trailhead trail)",
        url: "https://trailhead.salesforce.com/content/learn/trails/build-lightning-web-components",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "LWC Developer Guide",
        url: "https://developer.salesforce.com/docs/platform/lwc/guide",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "lwc.dev — the open-source framework",
        url: "https://lwc.dev/",
        source: "Salesforce Open Source",
        level: "deep",
      },
      {
        title: "Component reference & playground",
        url: "https://developer.salesforce.com/docs/component-library/overview/components",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
];
