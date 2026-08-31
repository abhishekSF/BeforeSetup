import type { Topic } from "../types";

export const integrationTopics: Topic[] = [
  {
    slug: "rest-apis",
    title: "REST & Platform APIs",
    category: "integration",
    tagline:
      "Everything in Salesforce is reachable over an API — the same objects, queries, and metadata you see in the UI.",
    mentalModel: [
      "Salesforce was API-first before that was a slogan: essentially anything you can do in the UI, an external system can do over HTTPS. The REST API covers CRUD on any object plus SOQL queries; the Bulk API handles large volumes as asynchronous jobs; the Metadata/Tooling APIs manipulate configuration rather than data; and Apex REST lets you publish your own custom endpoints from the org.",
      "Auth is OAuth 2.0 through a Connected App (or the newer External Client App). The flow you pick matters: JWT bearer for server-to-server, web server flow for user-facing apps, client credentials for simple integrations. Going the other direction — Salesforce calling out — Apex HTTP callouts go through Named Credentials, which store endpoint auth so tokens never live in code.",
    ],
    whenToUse: [
      "External systems reading or writing Salesforce data — ERP sync, data pipelines, mobile apps.",
      "Bulk API for large loads (hundreds of thousands of rows) instead of hammering the REST endpoints row by row.",
      "Apex REST when the external caller should get a purpose-built contract rather than raw object access.",
      "Named Credentials for every outbound callout — no exceptions.",
    ],
    whenToAvoid: [
      "Real-time 'tell me when something changes' — polling the API is the worst pattern; use Platform Events or Change Data Capture.",
      "Massive ongoing sync of full tables both directions — consider whether the data should live in one place with virtualization (Salesforce Connect) instead.",
    ],
    pitfalls: [
      "API limits are org-wide and shared: a runaway integration can starve every other integration in the org. Monitor consumption.",
      "Hardcoding instance URLs (na139.salesforce.com) instead of using My Domain and the OAuth-returned instance URL.",
      "Skipping the Composite API and making 10 round trips where 1 composite request would do.",
      "Field-level security applies to API users too — an integration user missing FLS silently gets nulls, not errors.",
    ],
    related: ["platform-events", "integration-patterns", "apex", "profiles-permission-sets"],
    resources: [
      {
        title: "API Basics (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/api_basics",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "REST API Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_rest.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Which API do I use?",
        url: "https://help.salesforce.com/s/articleView?id=xcloud.integrate_what_is_api.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Named Credentials guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_callouts_named_credentials.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
  {
    slug: "platform-events",
    title: "Platform Events & Change Data Capture",
    category: "integration",
    tagline:
      "Salesforce's event bus — publish messages when things happen and let subscribers react, inside or outside the org.",
    mentalModel: [
      "Platform Events bring pub/sub messaging to Salesforce. You define an event like an object (Order_Shipped__e with fields), publishers fire it (from Apex, Flow, or the API), and subscribers react (Apex triggers on the event, Flows, or external systems over gRPC/CometD). Publisher and subscriber never know about each other — that decoupling is the whole point.",
      "Change Data Capture is the prebuilt sibling: turn it on for an object and Salesforce publishes an event for every create, update, delete, and undelete, with the changed fields. It's the right default for 'keep an external copy in sync' instead of polling. Both ride the same event bus, and external subscribers use the Pub/Sub API. Events are transient (72-hour replay window, no queries) — they're signals, not storage.",
    ],
    whenToUse: [
      "Decoupling on-platform automation: a trigger publishes 'something happened' and three independent subscribers handle email, audit, and sync without knowing each other.",
      "External systems that need near-real-time notification of record changes — CDC instead of scheduled polling.",
      "Breaking transaction boundaries deliberately: event subscribers run in their own transaction with fresh limits.",
    ],
    whenToAvoid: [
      "Guaranteed once-only, ordered delivery with complex routing — the platform bus is at-least-once with a replay window, not a full message broker; heavy integration architectures may still want middleware.",
      "Simple same-transaction logic — if A must happen atomically with B, events add failure modes rather than removing them.",
    ],
    pitfalls: [
      "Publish happens even if the transaction later rolls back (for 'publish immediately' events) — choose publish behavior deliberately.",
      "Event allocations: publishing and delivery have daily limits and burst caps; high-volume designs need the math done up front.",
      "Subscriber failures are easy to miss — a broken trigger subscriber just stops consuming; monitor with the event status dashboards.",
      "The 72-hour replay window means an offline subscriber that misses it needs a reconciliation path, not just replay.",
    ],
    related: ["rest-apis", "integration-patterns", "async-apex", "apex-triggers"],
    resources: [
      {
        title: "Platform Events Basics (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/platform_events_basics",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Platform Events Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Change Data Capture Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_intro.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
  {
    slug: "integration-patterns",
    title: "Integration Patterns",
    category: "integration",
    tagline:
      "The recurring shapes of Salesforce integrations — and how to pick between request-reply, fire-and-forget, batch, and virtualization.",
    mentalModel: [
      "Most Salesforce integrations are one of a handful of shapes. Request-and-reply: Salesforce calls out and waits (rate quote, address validation). Fire-and-forget: Salesforce publishes an event or async callout and moves on (order sent to fulfillment). Batch data sync: large volumes on a schedule (nightly ERP sync via Bulk API). Remote call-in: the external system calls Salesforce's APIs. Data virtualization: the data stays outside and Salesforce displays it live (Salesforce Connect external objects).",
      "The two questions that pick your pattern: who initiates, and how fresh must the data be? 'User clicks and needs an answer now' → request-reply. 'Other system needs to know within a minute' → events. 'Both systems need full datasets daily' → batch. 'Users occasionally view but never own the data' → virtualization, and skip storing it at all. Timing (synchronous vs async) drives error handling: sync failures go to the user; async failures need retry queues and monitoring you design yourself.",
    ],
    whenToUse: [
      "At design time, before writing anything — naming the pattern aligns everyone on error handling, volumes, and ownership.",
      "Choosing where data lives: the system of record question decides more architecture than any tool choice.",
      "Deciding middleware vs point-to-point: two systems can talk directly; five systems doing point-to-point becomes an unmaintainable mesh.",
    ],
    whenToAvoid: [
      "Don't copy data into Salesforce 'just in case' — every copied dataset needs sync, storage, and reconciliation forever. Virtualize what you only display.",
      "Don't build custom retry/queue infrastructure in Apex if middleware (MuleSoft, workflow engines, iPaaS) already owns that job in your stack.",
    ],
    pitfalls: [
      "Ignoring failure paths: the happy path takes a week to build, the retry/reconciliation/alerting takes a month, and skipping it costs more later.",
      "Sync callouts inside user transactions that hold the page hostage on a slow external system — timebox and prefer async where possible.",
      "One shared 'Integration User' for everything makes API-limit debugging and audit trails impossible — use one integration user (or client) per system.",
      "Not documenting direction and system of record per field — two systems both 'owning' phone number ends in silent data fights.",
    ],
    related: ["rest-apis", "platform-events", "async-apex", "deployments"],
    resources: [
      {
        title: "Integration Patterns and Practices",
        url: "https://developer.salesforce.com/docs/atlas.en-us.integration_patterns_and_practices.meta/integration_patterns_and_practices/integ_pat_intro_overview.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Integration guidance for architects",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "deep",
      },
      {
        title: "Salesforce integration basics overview",
        url: "https://www.salesforceben.com/salesforce-integration/",
        source: "Salesforce Ben",
        level: "intro",
      },
    ],
  },
];
