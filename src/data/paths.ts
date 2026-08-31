import type { LearningPath } from "./types";

export const paths: LearningPath[] = [
  {
    slug: "admin",
    title: "Admin / Declarative Builder",
    audience: "Admins, consultants, and builders who work in Setup",
    description:
      "The order that makes Salesforce click if you build with clicks: data model first, then who-sees-what, then automation, then the pages users live in. Finish with enough deployment discipline to stay out of trouble.",
    steps: [
      {
        topic: "objects-and-fields",
        note: "Everything hangs off objects and fields. Get the spreadsheet-to-database mental shift down first.",
      },
      {
        topic: "relationships",
        note: "Lookup vs master-detail is the first real design decision you'll make — and the hardest to undo.",
      },
      {
        topic: "profiles-permission-sets",
        note: "Before automating anything, understand what users are allowed to do — and why new grants go in permission sets.",
      },
      {
        topic: "sharing-and-visibility",
        note: "The other half of security: which records people can see. OWD-first thinking prevents painful retrofits.",
      },
      {
        topic: "flow",
        note: "Your automation workhorse. Learn before-save vs after-save early; it shapes every flow you build.",
      },
      {
        topic: "approvals",
        note: "The most common 'business process' request you'll get: structured sign-offs with an audit trail.",
      },
      {
        topic: "record-types",
        note: "One object, multiple processes — and the admin overhead that comes with each flavor.",
      },
      {
        topic: "lightning-app-builder",
        note: "Where your data model and automation become screens people actually use. Dynamic Forms is the modern path.",
      },
      {
        topic: "sandboxes",
        note: "Build in a sandbox, always. Even solo admins need an environment between themselves and production.",
      },
      {
        topic: "deployments",
        note: "Change sets will carry you for a while; know their limits and where DevOps Center picks up.",
      },
    ],
  },
  {
    slug: "developer",
    title: "Developer",
    audience: "Engineers writing Apex, LWC, and integrations",
    description:
      "The platform rewards developers who learn its rules before its syntax. Start with the data model and governor limits — they shape everything — then layer on Apex, queries, UI, and the async and integration patterns real orgs run on.",
    steps: [
      {
        topic: "objects-and-fields",
        note: "The schema is your API. Standard objects, custom objects, and the metadata around them come before any code.",
      },
      {
        topic: "relationships",
        note: "Relationship types decide what your queries can traverse and how security cascades.",
      },
      {
        topic: "governor-limits",
        note: "Read this before writing Apex, not after your first limit exception. Limits are the platform's design language.",
      },
      {
        topic: "apex",
        note: "Java-flavored, database-aware, and always bulkified. The system-mode default is the security fact to internalize.",
      },
      {
        topic: "soql",
        note: "No SELECT *, no arbitrary joins — relationship traversal and selectivity are the skills.",
      },
      {
        topic: "apex-triggers",
        note: "Where most Apex actually runs. One trigger per object, logic in handlers, bulk always.",
      },
      {
        topic: "apex-testing",
        note: "75% coverage is the gate; assertions are the point. Learn the patterns before the suite grows.",
      },
      {
        topic: "async-apex",
        note: "Queueable, Batch, Scheduled — how work escapes the synchronous transaction and its limits.",
      },
      {
        topic: "flow",
        note: "Yes, developers need Flow: it's often the right tool, and your triggers share a transaction with it.",
      },
      {
        topic: "lightning-web-components",
        note: "Modern web standards plus a thin platform layer. Learn the data-access ladder before writing Apex for every read.",
      },
      {
        topic: "rest-apis",
        note: "In and out of the org over HTTPS: REST, Bulk, and Apex REST, with OAuth and Named Credentials.",
      },
      {
        topic: "platform-events",
        note: "The event bus — decoupled automation on-platform and near-real-time sync off it.",
      },
      {
        topic: "sfdx-cli",
        note: "Orgs as codebases: retrieve, commit, deploy. The foundation for any serious team workflow.",
      },
      {
        topic: "deployments",
        note: "How changes reach production: validation deploys, CI/CD, and the discipline around them.",
      },
    ],
  },
  {
    slug: "ai",
    title: "AI & Agentforce",
    audience: "Builders tracking the 2025–26 agentic wave",
    description:
      "Salesforce reorganized its entire platform around AI agents between Dreamforce 2025 and August 2026 — new names, new architecture, new products. This path takes you through the layers in dependency order: what agents are, the data they stand on, the automation and permissions they run through, and the headless plumbing that ends with Claudeforce.",
    steps: [
      {
        topic: "agentforce",
        note: "Start with what an agent actually is — topics, actions, the Atlas Reasoning Engine — plus the decoder ring for the 360 rebrand.",
      },
      {
        topic: "data-360",
        note: "The unified data layer agents stand on. Salesforce's own positioning: do this before scaling agents, not after.",
      },
      {
        topic: "flow",
        note: "Agent actions are mostly flows and Apex underneath — the automation layer is what agents actually invoke.",
      },
      {
        topic: "profiles-permission-sets",
        note: "Agents run under real user permissions. The permission audit is the single highest-value prep step before any AI pilot.",
      },
      {
        topic: "rest-apis",
        note: "OAuth, Connected/External Client Apps, and API mechanics — the foundation the MCP layer builds on.",
      },
      {
        topic: "headless-360",
        note: "The April 2026 architecture: the platform as MCP tools, APIs, and CLI commands, with the four-tool Hosted MCP Server design.",
      },
      {
        topic: "claudeforce",
        note: "The newest layer (August 2026): Claude in Salesforce, Salesforce in Claude, and the AIforce harness — plus the pilot cautions.",
      },
    ],
  },
  {
    slug: "architect",
    title: "Architect",
    audience: "Technical leads designing for scale, security, and change",
    description:
      "Architecture on this platform is mostly about constraints: limits, sharing math, data volume physics, and integration boundaries. This path assumes you know the builder basics and walks the decisions that are expensive to reverse.",
    steps: [
      {
        topic: "org-strategy",
        note: "Start above the org: one instance or many, who governs change, and what Well-Architected means in practice.",
      },
      {
        topic: "relationships",
        note: "Relationship choices cascade into security, queries, and load order — the schema is the first architecture document.",
      },
      {
        topic: "sharing-and-visibility",
        note: "The sharing model is the hardest thing to retrofit. OWD-first design, and know the implicit-sharing edges.",
      },
      {
        topic: "identity-sso",
        note: "Who verifies the humans and how apps get tokens: SSO, MFA, and Connected App hygiene.",
      },
      {
        topic: "governor-limits",
        note: "Limits are the platform's design language — every pattern below either respects or escapes them.",
      },
      {
        topic: "large-data-volumes",
        note: "What breaks at millions of rows: selectivity, skew, sharing recalc, and archiving strategy.",
      },
      {
        topic: "integration-patterns",
        note: "Name the pattern before writing anything: initiator, freshness, failure paths, and system of record.",
      },
      {
        topic: "platform-events",
        note: "The event bus underpins decoupled automation on-platform and near-real-time sync off it.",
      },
      {
        topic: "data-360",
        note: "The unified data layer every AI feature now assumes — and an implementation project, not a toggle.",
      },
      {
        topic: "headless-360",
        note: "The agentic architecture shift: the platform as MCP tools, with per-user auth and governance built in.",
      },
      {
        topic: "appexchange",
        note: "Buy-vs-build is an architecture decision: packages share your limits and never uninstall cleanly.",
      },
      {
        topic: "deployments",
        note: "Release architecture: environments, pipelines, and the discipline that keeps ten teams shipping one org.",
      },
    ],
  },
  {
    slug: "consultant",
    title: "Consultant",
    audience: "Functional consultants and solution designers running client projects",
    description:
      "Consultants translate between business problems and platform capabilities — which means knowing what exists, what it costs, and how projects actually succeed. This path leads with the craft, then the platform knowledge clients expect you to have cold.",
    steps: [
      {
        topic: "implementation-lifecycle",
        note: "The job itself: discovery, design, UAT, cutover, and the adoption work that decides whether any of it mattered.",
      },
      {
        topic: "licenses-editions",
        note: "Editions and licenses shape what's even possible — a design input, not a procurement afterthought.",
      },
      {
        topic: "objects-and-fields",
        note: "Every requirement lands on the data model first. Standard objects before custom, always.",
      },
      {
        topic: "record-types",
        note: "The 'same object, two processes' request appears in every project — and multiplies admin overhead each time.",
      },
      {
        topic: "flow",
        note: "Your automation default, and the maintainability conversation you'll have with every client admin.",
      },
      {
        topic: "sharing-and-visibility",
        note: "'Who can see what' requirements hide in every discovery — surface them before the data model hardens.",
      },
      {
        topic: "reports-dashboards",
        note: "Executives judge the project by the dashboard. Report types and running-user rules are your craft here.",
      },
      {
        topic: "data-loading",
        note: "Migration is regularly the critical path, and legacy data is always worse than claimed.",
      },
      {
        topic: "appexchange",
        note: "Buy vs build is a judgment call clients pay you for — commodity problems buy, differentiators build.",
      },
      {
        topic: "sandboxes",
        note: "Environment strategy and UAT discipline keep your go-live boring — the highest compliment.",
      },
      {
        topic: "agentforce",
        note: "Clients will ask about AI in every 2026 discovery. Know what agents do, what they cost, and what they need first.",
      },
    ],
  },
];

export const pathBySlug = new Map(paths.map((p) => [p.slug, p]));
