import type { Topic } from "../types";

export const integrationTopics: Topic[] = [
  {
    slug: "rest-apis",
    title: "REST & Platform APIs",
    category: "integration",
    tagline:
      "Every record, query, and metadata operation is reachable over HTTPS — the platform is an API with a UI on top.",
    mentalModel: [
      "Salesforce exposes essentially everything as APIs: the REST API for CRUD and queries, the Bulk API for high-volume loads, the Metadata/Tooling APIs for configuration, and Apex REST for custom endpoints you define. Authentication is OAuth via a Connected App (or the newer External Client Apps) — no API keys, always tokens.",
      "Directionality is the first design question. Inbound (someone calls Salesforce): REST/Bulk/Apex REST. Outbound (Salesforce calls someone): Apex callouts with Named Credentials handling auth and endpoints. Named Credentials are the grown-up answer to 'where do we store the API password?' — never in code or custom settings.",
      "API limits are a real budget: orgs have daily API call allocations, and integrations that poll wastefully burn it. Design around events and bulk operations, not tight polling loops.",
    ],
    whenToUse: [
      "External systems reading/writing Salesforce data → REST for transactional, Bulk for volume.",
      "Salesforce needs data from outside at interaction time → Apex callouts with Named Credentials.",
      "You need a custom contract (specific payload shape, orchestration) → Apex REST endpoint.",
    ],
    whenToAvoid: [
      "Don't poll every minute for changes — use Platform Events / Change Data Capture (push beats poll).",
      "Don't run analytics-scale extracts through the REST API — Bulk API or a proper data pipeline.",
      "Avoid custom Apex REST when the standard API already expresses the operation — custom endpoints are code to maintain.",
    ],
    pitfalls: [
      "Integration user with admin rights: convenient in the demo, a security finding in the audit. Use least-privilege integration users (Minimum Access profile + permission sets).",
      "Ignoring API limits until the org hits them at month-end — monitor consumption per integration.",
      "No retry/backoff strategy: transient failures are normal; naive integrations turn them into data gaps.",
      "Hardcoded credentials and endpoints in Apex — Named Credentials exist precisely so you never do this.",
      "Timezone/format mismatches on dates and numbers — the classic silent data corrupter.",
    ],
    related: ["platform-events", "integration-patterns", "apex", "async-apex"],
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
        title: "Named Credentials",
        url: "https://help.salesforce.com/s/articleView?id=platform.named_credentials_about.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Which API do I use? (decision guide)",
        url: "https://help.salesforce.com/s/articleView?id=platform.integrate_what_is_api.htm&type=5",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "platform-events",
    title: "Platform Events & Change Data Capture",
    category: "integration",
    tagline:
      "Salesforce's event bus — publish/subscribe messaging for decoupled automation and near-real-time integration.",
    mentalModel: [
      "Platform Events are Salesforce's pub/sub system: you define an event 'object' (fields on a message), publishers fire events, and subscribers — Apex triggers, flows, external systems over CometD/Pub-Sub API — react. Publishers don't know who's listening; that decoupling is the point.",
      "Change Data Capture (CDC) is the pre-built flavor: turn it on for an object and Salesforce publishes an event for every create/update/delete/undelete with the changed fields. It's the push-based alternative to 'poll for records modified since X'.",
      "Critical property: event publishes are not part of your transaction's rollback in the way DML is (publish happens on commit, or immediately for some configs), and delivery is at-least-once. Subscribers must be idempotent — design as if every event might arrive twice or late.",
    ],
    whenToUse: [
      "External systems need near-real-time notification of data changes → CDC.",
      "Decoupling on-platform processes: order placed → many independent reactions without one giant flow.",
      "Integrating systems that shouldn't know about each other's internals — events as the contract.",
    ],
    whenToAvoid: [
      "Request/response interactions ('call this and give me the answer now') — events are fire-and-forget.",
      "Guaranteed ordering or exactly-once processing requirements — build idempotency instead of fighting the bus.",
      "Low-volume simple cases where a scheduled sync is honestly fine — event infrastructure has operational cost.",
    ],
    pitfalls: [
      "Event allocation limits: publishes and deliveries have daily caps by edition — high-volume designs must do the math.",
      "Subscriber failures are quiet: a broken trigger subscriber just stops consuming; monitor subscription health.",
      "Replaying events: subscribers can resume from a replay ID within the retention window (72h) — external clients must persist their position.",
      "Treating CDC events as full records — they carry changed fields, so consumers often need an enrichment query.",
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
      {
        title: "Pub/Sub API (gRPC)",
        url: "https://developer.salesforce.com/docs/platform/pub-sub-api/overview",
        source: "Salesforce Docs",
        level: "deep",
      },
    ],
  },
  {
    slug: "integration-patterns",
    title: "Integration Patterns",
    category: "integration",
    tagline:
      "The five or six shapes every Salesforce integration takes — name the pattern before writing any code.",
    mentalModel: [
      "Almost every integration is one of a few patterns: Request & Reply (Salesforce calls out and waits), Fire & Forget (Salesforce publishes/enqueues and moves on), Batch Data Sync (scheduled bulk movement), Remote Call-In (external system calls Salesforce), and Data Virtualization (view external data without storing it — Salesforce Connect / External Objects). Naming the pattern forces the right questions: who initiates? how fresh must data be? what happens on failure?",
      "The second axis is where the integration logic lives: point-to-point (Salesforce ↔ System X directly) versus mediated (an iPaaS/ESB like MuleSoft in the middle). Point-to-point is fine for one or two connections; a mesh of ten systems each talking to each other is how orgs end up frightened of their own integrations. Middleware buys you monitoring, retries, transformation, and one throat to choke — at the cost of another platform to run.",
    ],
    whenToUse: [
      "Any new integration design: pick the pattern first, then the tech (API vs events vs batch).",
      "Data Virtualization when data must stay in the source system (compliance, volume) but users need to see it.",
      "Middleware when integration count grows, transformations multiply, or non-Salesforce teams own half the connections.",
    ],
    whenToAvoid: [
      "Don't default to real-time everything — real-time is expensive in complexity; nightly batch is often genuinely enough.",
      "Don't store copies of external data 'just in case' — sync drift becomes its own project. Virtualize or integrate on demand.",
    ],
    pitfalls: [
      "No failure design: the demo works; production has timeouts, dupes, and partial failures. Every pattern needs its error path drawn.",
      "Ignoring idempotency: retries + non-idempotent writes = duplicate records at scale.",
      "One integration user for everything — you lose the ability to trace which system did what.",
      "Synchronous callouts inside triggers (not allowed directly) pushed through hacks instead of redesigning as async.",
      "Undocumented integrations: the org has seven; the team can name four. Keep an integration inventory.",
    ],
    related: ["rest-apis", "platform-events", "async-apex", "governor-limits"],
    resources: [
      {
        title: "Integration Patterns and Practices (official guide)",
        url: "https://developer.salesforce.com/docs/atlas.en-us.integration_patterns_and_practices.meta/integration_patterns_and_practices/integ_pat_intro_overview.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Integration architecture on architect.salesforce.com",
        url: "https://architect.salesforce.com/decision-guides/integration-patterns",
        source: "Salesforce Architects",
        level: "deep",
      },
      {
        title: "Salesforce Connect / External Objects",
        url: "https://help.salesforce.com/s/articleView?id=platform.salesforce_connect.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
    ],
  },
];
