import type { Topic } from "../types";

export const uiTopics: Topic[] = [
  {
    slug: "experience-cloud",
    title: "Experience Cloud",
    category: "ui",
    tagline:
      "Salesforce for people outside your company — portals and sites where customers and partners work with your data under a stricter security model.",
    mentalModel: [
      "Experience Cloud (formerly Communities) builds websites and portals on top of your org: a customer support portal where users file and track their own cases, a partner portal where resellers manage their deals, a public knowledge site. The pitch is that external users work directly against the same objects your internal teams use — no sync layer — while templates and the Experience Builder handle the site-building.",
      "The mental model that prevents incidents: external users are a different species in the security model. They get portal-specific licenses, they sit below the role hierarchy, org-wide defaults have a separate 'external' column, and guest (unauthenticated) users are locked down harder still — with sharing that must be opened deliberately per object. Internal assumptions ('everyone can see accounts they're on the team for') do not transfer. Every Experience Cloud project is two projects: the site, and the external sharing design.",
    ],
    whenToUse: [
      "Customer self-service: case deflection with knowledge articles plus authenticated case tracking — the classic, high-ROI first site.",
      "Partner selling: lead pass, deal registration, and shared pipeline with resellers via partner licenses.",
      "Any 'can we give them a login?' requirement that would otherwise mean building and hosting a separate app against the API.",
    ],
    whenToAvoid: [
      "A pure marketing website with no data interaction — a CMS is cheaper and faster than bending Experience Cloud into a brochure.",
      "Fully bespoke product UIs where the template model fights you — sometimes a custom app on the APIs (or LWR sites, or now the Headless Experience Layer) is the honest answer.",
    ],
    pitfalls: [
      "Guest user access is the classic breach headline: misconfigured guest sharing has exposed real customer data at real companies. Audit guest profiles and sharing rules like production security, because they are.",
      "License economics decide architecture: per-member vs per-login pricing, customer vs partner license capabilities — model this before designing, not after.",
      "Sharing sets and share groups (the external sharing tools) work differently from internal sharing rules — budget learning time.",
      "Performance on data-heavy pages: external users triggering expensive queries on every page view adds up fast.",
    ],
    related: ["sharing-and-visibility", "profiles-permission-sets", "lightning-web-components", "lightning-app-builder"],
    resources: [
      {
        title: "Experience Cloud (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=experience.networks_overview.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Experience Cloud overview and use cases",
        url: "https://www.salesforceben.com/salesforce-experience-cloud/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Guest user security (must-read)",
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
      "The drag-and-drop page editor — how most Salesforce screens get built, no code required.",
    mentalModel: [
      "Lightning App Builder is how you compose the pages users actually see: drag components (record details, related lists, charts, custom components) into regions on a canvas, set their properties, and activate the page for apps, record types, and profiles. Record pages, home pages, and app pages are all built here.",
      "Dynamic Forms takes it further by breaking the old monolithic 'page layout' into individual field sections you place directly on the canvas, with visibility rules per field or section ('show Discount Reason only when Discount > 20%'). The direction of travel is clear: page layouts are the legacy system, App Builder plus Dynamic Forms is the present. Component visibility rules — show/hide anything based on record values, device, or user — replace a surprising amount of what used to require record types or code.",
    ],
    whenToUse: [
      "Any record page users work in daily — tune it: put key fields and actions first, cut noise with visibility rules.",
      "Different experiences per app, record type, or profile without duplicating data model.",
      "Surfacing custom LWCs, screen flows, or reports directly on record pages.",
    ],
    whenToAvoid: [
      "Highly interactive custom experiences (drag-and-drop boards, complex wizards) — that's LWC territory; App Builder just hosts it.",
      "Pixel-perfect branded external sites — that's Experience Cloud with custom themes, not internal app pages.",
    ],
    pitfalls: [
      "Page assignment complexity: pages can be assigned by app + record type + profile. Orgs accumulate near-duplicate pages nobody dares delete — name and document assignments.",
      "Too many components per page slows load times; every related list and report chart is a query.",
      "Dynamic Forms migration is per-object opt-in; half-migrated objects confuse admins editing 'the layout' in two places.",
      "Visibility rules that hide required fields can strand users mid-save.",
    ],
    related: ["lightning-web-components", "record-types", "profiles-permission-sets", "flow"],
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
        title: "Dynamic Forms deep dive and tips",
        url: "https://www.salesforceben.com/salesforce-dynamic-forms/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "lightning-web-components",
    title: "Lightning Web Components (LWC)",
    category: "ui",
    tagline:
      "Custom UI built with modern web standards — JavaScript, HTML templates, and a thin Salesforce layer on top.",
    mentalModel: [
      "LWC is Salesforce's framework for custom interface components, built on web standards: real JavaScript modules, custom elements, templates, and reactive properties. If you know modern frontend development, most of your knowledge transfers — the Salesforce-specific parts are decorators (@api for public properties, @wire to declaratively pull data), the Lightning Data Service (cached record access without Apex), and the base component library (lightning-datatable, lightning-record-form, and friends).",
      "The data story has layers, cheapest first: use a base component that handles the record for you; use @wire with an adapter for cached, reactive reads; call an @AuraEnabled Apex method when you need queries or logic; and only then reach for imperative Apex calls. Components are deployed as metadata and dropped onto pages via App Builder, so admins compose what developers build.",
    ],
    whenToUse: [
      "Interactive experiences beyond standard components: custom tables with inline logic, wizards, dashboards, drag-and-drop.",
      "Reusable widgets admins can configure — expose properties via targetConfigs and let App Builder do the rest.",
      "Replacing aging Aura components — LWC is faster and the strategic direction; new work should not start in Aura.",
    ],
    whenToAvoid: [
      "Anything a standard component or Dynamic Forms already does — custom UI is a maintenance commitment.",
      "Multi-step guided data entry an admin could own — screen flows are often the better tool, and flows can host LWCs for the custom parts.",
    ],
    pitfalls: [
      "Skipping Lightning Data Service and writing Apex for every read — you lose caching and reactivity and write more code than needed.",
      "Forgetting that @wire is reactive and fires again when parameters change — side effects in wired functions cause loops.",
      "Apex called from LWC still runs in system mode by default — enforce sharing and field security in the Apex, not just the UI.",
      "Testing gaps: Jest tests exist for LWC and orgs that skip them regret it at refactor time.",
    ],
    related: ["apex", "lightning-app-builder", "flow", "rest-apis"],
    resources: [
      {
        title: "Lightning Web Components Dev Guide",
        url: "https://developer.salesforce.com/docs/platform/lwc/guide",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "LWC.dev — the framework site",
        url: "https://lwc.dev/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Component Library & base components",
        url: "https://developer.salesforce.com/docs/component-library/overview/components",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "LWC Recipes — official sample patterns",
        url: "https://github.com/trailheadapps/lwc-recipes",
        source: "Open Source",
        level: "deep",
      },
    ],
  },
];
