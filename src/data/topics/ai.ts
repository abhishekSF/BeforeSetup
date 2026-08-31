import type { Topic } from "../types";

export const aiTopics: Topic[] = [
  {
    slug: "agentforce",
    title: "Agentforce & the 360 Rebrand",
    category: "ai",
    tagline:
      "Salesforce's platform for autonomous AI agents — and the umbrella brand that renamed half the product line around it.",
    mentalModel: [
      "Agentforce is Salesforce's system for building AI agents that work on your CRM data: you define an agent with topics (what it's allowed to handle) and actions (what it can actually do — flows, Apex, prompt templates), and the Atlas Reasoning Engine runs the plan-and-act loop, deciding which action fits the request. The critical design fact: agents run under Salesforce's existing security model. Sharing rules, field-level security, and permissions constrain an agent exactly like a human user — the governance you already built is the guardrail.",
      "You also need the naming decoder ring, because at Dreamforce 2025 Salesforce put nearly everything under an 'Agentforce 360' umbrella: Sales Cloud became Agentforce Sales, Service Cloud became Agentforce Service, Data Cloud became Data 360, and Einstein 1 Platform positioning became Agentforce 360 (comprising the Agentforce 360 platform, Data 360, the Customer 360 apps, and Slack). In most cases only the label changed — same product, same data, same pricing. When a tutorial says 'Sales Cloud' and a sales deck says 'Agentforce Sales', they mean the same thing.",
    ],
    whenToUse: [
      "Deflecting well-bounded, high-volume work: service Q&A grounded in your knowledge base, order status, appointment scheduling.",
      "When the task needs your org's data and business rules — an agent grounded in CRM beats a generic chatbot precisely because of the grounding.",
      "Internal copilot use cases (Agentforce Coworker) where employees ask questions that span records, docs, and Slack.",
    ],
    whenToAvoid: [
      "Deterministic processes with compliance stakes — if the answer must be identical every time, that's Flow or Apex, not a reasoning loop.",
      "Before your data and permissions are ready: an agent amplifies whatever it can reach. Messy data and over-provisioned profiles become agent behavior.",
      "Don't adopt because of the rebrand pressure — the same discount approval that didn't need AI last year still doesn't.",
    ],
    pitfalls: [
      "Skipping the permission audit. Agents run with real permissions; a profile that was harmlessly over-provisioned behind a slow UI becomes genuinely risky behind an autonomous agent.",
      "Vague topic and instruction design — the agent equivalent of a bad prompt. Tight topic scoping and testable instructions separate demos from production.",
      "Consumption pricing surprises: agent usage is metered, and costs scale with conversations and actions, not seats. Instrument a pilot before org-wide rollout.",
      "Treating agent actions as separate from your automation: an agent action that writes records fires validation rules, flows, and triggers like any other DML.",
    ],
    related: ["data-360", "claudeforce", "headless-360", "flow", "profiles-permission-sets"],
    resources: [
      {
        title: "Agentforce (official product page)",
        url: "https://www.salesforce.com/agentforce/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Product name changes: old vs new, explained",
        url: "https://cloudmasonry.com/salesforce-product-name-changes-agentforce-360/",
        source: "CloudMasonry",
        level: "intro",
      },
      {
        title: "Apex Hours Agentforce archive",
        url: "https://www.apexhours.com/category/agentforce/",
        source: "Apex Hours",
        level: "practical",
      },
      {
        title: "What's actually shipping post-Dreamforce (Q1 2026 reality check)",
        url: "https://digitalmass.com/insights/the-post-dreamforce-reality-check-whats-actually-shipping-in-q1-2026/",
        source: "DigitalMass",
        level: "practical",
      },
    ],
  },
  {
    slug: "data-360",
    title: "Data 360 (formerly Data Cloud)",
    category: "ai",
    tagline:
      "Salesforce's unified data layer — on its sixth name, and now positioned as the non-optional foundation under every AI feature.",
    mentalModel: [
      "Data 360 ingests data from everywhere (CRM, marketing, commerce, warehouses, external systems), harmonizes it into a standard model, resolves identities ('these five records are the same person'), and produces unified profiles that every cloud and every agent can use. Zero-copy connections to Snowflake and Databricks mean it can reference warehouse data without duplicating it. If you've heard of Customer 360 Audiences, Salesforce CDP, Marketing Cloud CDP, Genie, or Data Cloud — same product line; Data 360 is the sixth name, applied at Dreamforce 2025.",
      "The strategic shift to understand: Data 360 stopped being a marketing-adjacent CDP and became the grounding layer for Agentforce. Intelligent Context grounds agents in unstructured data (documents, transcripts), and Tableau Semantics lets you define metrics once and reuse them across analytics and agents. Salesforce's own positioning is blunt — agents without unified, governed data produce unreliable output — which is why 'implement Data 360 first' is now the standard Agentforce prerequisite. The pending Informatica acquisition (announced late 2025) is pushing governance and data quality deeper into the platform.",
    ],
    whenToUse: [
      "Before scaling Agentforce — agents grounded in fragmented data fail in ways that are hard to debug; the data layer is the prerequisite, not the add-on.",
      "Unifying customer identity across systems: the classic 'is this the same person in CRM, commerce, and support?' problem.",
      "When warehouse data should inform CRM experiences without a copy-everything ETL pipeline — zero-copy is the differentiator.",
    ],
    whenToAvoid: [
      "If your CRM data alone answers your use cases, you may not need a unified-data project yet — Data 360 is an implementation effort, not a toggle.",
      "Don't treat it as 'just another cloud' to switch on: identity resolution and harmonization need real data-quality work, and skipping the cleanup produces confidently wrong unified profiles.",
    ],
    pitfalls: [
      "Consumption-based pricing: costs follow rows processed, queries, and activations. Untuned ingestion pipelines produce surprising bills — model the consumption before contracts, not after.",
      "Identity resolution rules that are too loose merge different people; too strict, and the same customer stays fragmented. Test with real messy data.",
      "Assuming Data 360 records behave like CRM records — the data model, query patterns, and limits are different from core platform objects.",
      "The name churn itself: docs, blogs, and consultants mix six names for the same thing. Check dates on any resource you read.",
    ],
    related: ["agentforce", "claudeforce", "objects-and-fields", "integration-patterns", "reports-dashboards"],
    resources: [
      {
        title: "Data 360 rename, explained",
        url: "https://www.salesforceben.com/salesforce-data-cloud-renamed-to-data-360-as-part-of-agentforce-360/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Data 360 (official product page)",
        url: "https://www.salesforce.com/data/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Why Data 360 is the foundation for AI strategy",
        url: "https://sfpractice.telusdigital.com/posts/10-reasons-salesforce-data-360-is-the-foundation-your-ai-strategy-needs",
        source: "TELUS Digital",
        level: "practical",
      },
    ],
  },
  {
    slug: "headless-360",
    title: "Headless 360 & Hosted MCP Servers",
    category: "ai",
    tagline:
      "The platform without the browser: every Salesforce capability exposed as APIs, MCP tools, and CLI commands that AI agents call directly.",
    mentalModel: [
      "Headless 360, announced April 2026, is the architectural move underneath everything agentic Salesforce ships now: expose data, workflows, business logic, and governance as capabilities an AI can call directly — over 60 MCP tools, 30+ coding skills, plus a Headless Experience Layer for building an agent UI once and rendering it in Slack, Teams, WhatsApp, or a web app. The browser interface becomes optional; the platform becomes a system that powers any interface.",
      "The clever part is the Hosted MCP Server design (Beta since July 2026, requires API v67+). Instead of registering hundreds of tools and drowning the model's context window, the platform/headless-360 server exposes just four: discover (semantic search for the right operation), describe (read its spec), dispatch (invoke it), and dispatch_readonly (GET only). The model searches, reads, then calls — three steps that scale to the whole platform. Auth is per-user OAuth (PKCE) through an External Client App with the mcp_api scope, so every call runs as the person making it, under their real permissions.",
    ],
    whenToUse: [
      "Connecting AI clients — Claude, Cursor, ChatGPT, Postman — to your org for governed data access and actions without custom integration code.",
      "Building agent experiences that must render across surfaces (Slack, Teams, web) from one implementation — the Headless Experience Layer's job.",
      "Anywhere you were about to hand-roll a 'let the LLM call our REST API' bridge — the MCP server is that bridge, with permissions built in.",
    ],
    whenToAvoid: [
      "Production-critical revenue processes today — the MCP server is Beta; pilot on non-critical workflows first.",
      "As a replacement for integration architecture: MCP is a great AI-to-platform channel, but system-to-system sync at volume is still Bulk API, events, and middleware territory.",
    ],
    pitfalls: [
      "Writes through dispatch are normal Salesforce DML: validation rules, flows, triggers, and governor limits all fire. An agent bulk-updating 200 records trips the same limits a Data Loader job would.",
      "Start read-only: dispatch_readonly plus a tightly scoped permission set exists precisely so you can enable analysis before enabling writes. Add write access per use case, deliberately.",
      "Shadow MCP: if every team stands up its own connections, you've reinvented shadow IT with better branding. Govern the connector list from day one.",
      "Note the two different auth postures in the ecosystem: Hosted MCP Servers run per-user OAuth, but Slack's Claude Tag route uses a client-credentials integration user — one identity for everyone in scope. Know which one you're enabling.",
    ],
    related: ["claudeforce", "agentforce", "rest-apis", "profiles-permission-sets", "governor-limits"],
    resources: [
      {
        title: "Headless 360 (official page)",
        url: "https://www.salesforce.com/headless/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Hosted MCP Servers — connecting clients",
        url: "https://developer.salesforce.com/docs/platform/hosted-mcp-servers/guide/client-connection-overview.html",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Model Context Protocol (the open standard)",
        url: "https://modelcontextprotocol.io/",
        source: "MCP",
        level: "deep",
      },
    ],
  },
  {
    slug: "claudeforce",
    title: "Claudeforce & AIforce",
    category: "ai",
    tagline:
      "The Salesforce–Anthropic partnership (Aug 2026): Claude inside Salesforce, Salesforce inside Claude, and the AIforce harness underneath.",
    mentalModel: [
      "Claudeforce, announced August 26, 2026, is really three workstreams under one name. Claude in Salesforce: Claude serves as a reasoning model in the Atlas Reasoning Engine and is the default in Agentforce Vibes and Coworker — served through Amazon Bedrock inside the Salesforce Trust Boundary, which is the sentence your security review cares about. Salesforce in Claude: a plugin with 37 prebuilt sales skills (meeting prep, deal health, pipeline review) that lets sellers work their CRM from inside Claude — one admin connects the org once, and everyone gets access scoped to their own permissions. Claude in Slack: Claude becomes the default model behind Slackbot and Slack AI.",
      "AIforce is the layer that makes this possible: Salesforce's 'enterprise harness' that brings business data, workflows, logic, actions, and governance to any agent through MCP servers, APIs, and CLI tools — built on Headless 360's plumbing. Benioff's framing is 'the UI is the AI': Claude generates dashboards and interfaces on the fly from live Salesforce data instead of you configuring screens in advance. The strategic read: Salesforce is betting that agentic interfaces increase the value of the platform even as they bypass its traditional UI.",
    ],
    whenToUse: [
      "Sales teams already living in Claude or Slack who need governed CRM access without tab-switching — that's the launch persona, with more functions promised late 2026.",
      "As the managed alternative to wiring up your own MCP connection: single-admin setup and co-engineered skills replace per-user plumbing you'd otherwise build.",
      "Piloting now if you want influence: Salesforce in Claude is pilot-only with open beta expected September 2026 — early feedback shapes the skills.",
    ],
    whenToAvoid: [
      "Any Q4-critical revenue process — the plugin is pilot, the MCP server underneath is Beta, and 'beta means beta.'",
      "Before a permission audit: on first run the plugin sweeps the seller's context across Salesforce, Slack, and other connectors. Over-provisioned profiles become agent reach on day one.",
    ],
    pitfalls: [
      "Budget for tokens with real data: pricing is consumption-based, and you contract with Anthropic separately for inference. Instrument a pilot cohort before signing org-wide.",
      "Don't run the pilot through the same sandbox window as your Winter '27 upgrade (production waves Sept–Oct 2026) — two simultaneous changes make failures unattributable.",
      "The rename hazard: 'Claudeforce', 'AIforce', 'Agentforce', and 'Headless 360' are distinct layers that launch coverage blurs together. Partnership brand, harness, agent platform, architecture — in that order.",
      "Concentration risk for architects: Salesforce made a supplier's model its default while becoming a feature in that supplier's product. Keep the Agent Builder model picker a real escape hatch, not a theoretical one.",
    ],
    related: ["headless-360", "agentforce", "data-360", "profiles-permission-sets"],
    resources: [
      {
        title: "Claudeforce (official page)",
        url: "https://www.salesforce.com/claudeforce/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Claudeforce announcement (press release)",
        url: "https://www.salesforce.com/news/press-releases/2026/08/26/salesforce-and-anthropic-announce-claudeforce/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Claudeforce explained: what actually ships",
        url: "https://www.apexhours.com/claudeforce-explained-what-salesforce-anthropic-actually-ship/",
        source: "Apex Hours",
        level: "practical",
      },
      {
        title: "A closer look at the announcement",
        url: "https://10kview.com/claudeforce-a-closer-look-at-the-announcement/",
        source: "10K View",
        level: "deep",
      },
    ],
  },
];
