import type { Topic } from "../types";

export const aiTopics: Topic[] = [
  {
    slug: "agentforce",
    title: "Agentforce & the 360 Rebrand",
    category: "ai",
    tagline:
      "Salesforce's AI agent platform — and the 2025–26 renaming wave that reorganized the whole product line around it.",
    mentalModel: [
      "Agentforce is Salesforce's platform for AI agents: software that doesn't just answer questions but takes actions — looking up records, updating data, kicking off flows — within guardrails you define. An agent has a job description (topics), a set of allowed actions (flows, Apex, prompts), and data it can ground on. The Atlas Reasoning Engine plans multi-step work; your permissions model still decides what it can actually touch.",
      "Around Dreamforce 2025, Salesforce reorganized branding around the agent story: the platform became Agentforce 360, and familiar products picked up 360 names — Data Cloud became Data 360, plus Sales/Service-style 360 groupings across the portfolio. Under the hood these are largely the same products — but docs, pricing pages, and community posts now mix old and new names freely, so knowing the mapping is genuinely useful.",
      "The architectural insight: agents are a UI-and-reasoning layer on top of everything else in this map. An agent is only as good as the data model, automation, and permissions underneath it — which is why 'AI readiness' mostly means 'is your org well-built?'",
    ],
    whenToUse: [
      "High-volume, well-bounded service interactions: order status, returns, appointment booking — where actions and guardrails are clear.",
      "Internal copilots that retrieve and summarize org data for reps, grounded in real records.",
      "When you already have clean flows/Apex actions an agent can safely invoke — agents amplify existing automation.",
    ],
    whenToAvoid: [
      "Processes you can't describe precisely — if a human can't write the runbook, an agent can't follow it.",
      "High-stakes irreversible actions (payments, deletions) without human-in-the-loop approval steps.",
      "As a substitute for fixing bad data or broken processes — agents inherit your org's problems at machine speed.",
    ],
    pitfalls: [
      "Permissions surprise: agents act with real access — an over-permissioned agent user is a data leak with a chat interface. Least-privilege applies double.",
      "Consumption pricing: agent conversations/actions are metered (Flex credits) — pilot economics can look very different at scale.",
      "Skipping the naming decoder: teams read 'Data 360' and 'Data Cloud' docs as different products and design against a phantom.",
      "No evaluation loop: without logged transcripts, feedback review, and topic tuning, agent quality plateaus at 'demo-grade'.",
    ],
    related: ["data-360", "claudeforce", "headless-360", "flow", "profiles-permission-sets"],
    resources: [
      {
        title: "Agentforce (product overview)",
        url: "https://www.salesforce.com/agentforce/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Get Started with Agentforce (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/trails/get-started-with-agentforce",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Agentforce Developer Guide",
        url: "https://developer.salesforce.com/docs/einstein/genai/guide/agentforce.html",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Agentforce 360 announcement",
        url: "https://www.salesforce.com/news/press-releases/2025/10/13/agentforce-360-announcement/",
        source: "Salesforce Newsroom",
        level: "intro",
      },
    ],
  },
  {
    slug: "data-360",
    title: "Data 360 (formerly Data Cloud)",
    category: "ai",
    tagline:
      "Salesforce's unified data layer — ingesting, resolving, and activating customer data across systems, and the foundation the AI story stands on.",
    mentalModel: [
      "Data 360 (renamed from Data Cloud in late 2025) is a different kind of database than your CRM org: a lakehouse-style platform that ingests data from everywhere (CRM, web, warehouses, files), harmonizes it to a standard model, resolves identities ('these three records are the same person'), and activates the result — segments, calculated insights, real-time profiles — back into Salesforce and beyond.",
      "The key architectural feature is zero copy: instead of importing your Snowflake/BigQuery/Databricks data, Data 360 can query it in place, and vice versa — your warehouse can read Data 360 objects. This is why architects care: it changes the 'copy everything into one place' pattern that has defined CRM data work for decades.",
      "Its role in the AI story is load-bearing: agents and prompts ground on Data 360 for context beyond CRM records — the pitch is that AI quality is downstream of data unification.",
    ],
    whenToUse: [
      "Customer data scattered across systems where identity resolution ('one view of the customer') has real business value.",
      "Real-time personalization and segmentation feeding Marketing, Service, or agent experiences.",
      "Grounding Agentforce on data that lives outside the CRM without building custom integration for each source.",
    ],
    whenToAvoid: [
      "If your CRM data alone answers your questions — Data 360 is priced on consumption (credits) and adds real cost and complexity.",
      "As a data warehouse replacement for analytics teams — it complements (and connects to) warehouses; it doesn't replace them.",
      "Before basic data hygiene exists — identity resolution on garbage produces confident garbage.",
    ],
    pitfalls: [
      "Credit-burn surprises: ingestion, processing, and queries consume credits — monitor consumption from day one, not at renewal.",
      "Treating it as 'just another org': Data 360 objects (DLOs/DMOs) are not sObjects; the query language and limits differ.",
      "Identity resolution rules that over-merge (one 'John Smith' to rule them all) or under-merge — test with your real data patterns.",
      "Skipping the naming history: docs and community content mix 'Data Cloud', 'CDP', 'Genie', and 'Data 360' — all the same lineage.",
    ],
    related: ["agentforce", "integration-patterns", "headless-360", "rest-apis"],
    resources: [
      {
        title: "Data 360 (product page)",
        url: "https://www.salesforce.com/data/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "Data Cloud / Data 360 documentation",
        url: "https://help.salesforce.com/s/articleView?id=data.c360_a_data_cloud.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Zero Copy integration explained",
        url: "https://www.salesforce.com/data/what-is-zero-copy/",
        source: "Salesforce",
        level: "deep",
      },
    ],
  },
  {
    slug: "headless-360",
    title: "Headless 360 & Hosted MCP Servers",
    category: "ai",
    tagline:
      "Salesforce without the UI — the April 2026 shift that exposes the platform as MCP tools, APIs, and CLI for agents to drive.",
    mentalModel: [
      "Headless 360 (announced April 2026, rolling out through the year) reframes Salesforce as a platform agents can operate without clicking through the UI: capabilities exposed as tools over the Model Context Protocol (MCP), a hardened CLI, and APIs designed for machine callers. The flagship piece is the Hosted MCP Server — Salesforce runs the MCP endpoint for your org; you don't deploy or patch anything.",
      "The interesting design choice: instead of hundreds of micro-tools (one per API call), the hosted server exposes a small set of powerful primitives — on the order of four: query data, modify data, execute code, and discover/act on metadata. Fewer, broader tools turn out to be easier for LLMs to use correctly than sprawling tool catalogs — a lesson that generalizes to any agent integration you build.",
      "Governance is the other half: per-user OAuth (the agent acts as you, with your permissions), plus admin controls over which tools are enabled for whom. 'Headless' doesn't mean 'ungoverned' — it means the permission model does the governing instead of the UI.",
    ],
    whenToUse: [
      "Connecting external AI assistants (Claude, IDE agents, internal copilots) to org data and actions without building custom middleware.",
      "Automation workflows where an agent needs to query, create, and update records across objects conversationally.",
      "Developer tooling: letting coding agents inspect org metadata, run queries, and scaffold changes from the terminal.",
    ],
    whenToAvoid: [
      "High-volume programmatic integration — MCP is for agent reasoning loops, not bulk ETL; use Bulk API/events for scale.",
      "Orgs without permission hygiene: an agent with a user's full (over-broad) access is that user's mess at machine speed.",
      "Hard-real-time or deterministic flows — agent tool use is probabilistic; critical paths still want explicit integration code.",
    ],
    pitfalls: [
      "Treating MCP access as a service account: per-user auth means audit trails point at real users — good — but also means users' permission gaps become agent failures.",
      "Ignoring tool-use limits and metering — agentic loops can make many calls per task; watch consumption like API limits.",
      "Building custom MCP servers for what the hosted one already does — check the built-in tool surface first.",
      "Assuming every AI feature needs MCP: prompt templates and native Agentforce actions cover many cases with less moving machinery.",
    ],
    related: ["agentforce", "claudeforce", "rest-apis", "sfdx-cli", "data-360"],
    resources: [
      {
        title: "MCP support in Salesforce (developer docs)",
        url: "https://developer.salesforce.com/docs/platform/mcp/overview",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Model Context Protocol (open standard)",
        url: "https://modelcontextprotocol.io/",
        source: "MCP Project",
        level: "deep",
      },
      {
        title: "Salesforce developer blog — agentic platform posts",
        url: "https://developer.salesforce.com/blogs",
        source: "Salesforce Developers",
        level: "practical",
      },
    ],
  },
  {
    slug: "claudeforce",
    title: "Claudeforce & AIforce (Anthropic Partnership)",
    category: "ai",
    tagline:
      "The August 2026 Salesforce–Anthropic expansion: Claude embedded across the platform, Salesforce tools inside Claude, and an agent harness connecting them.",
    mentalModel: [
      "Claudeforce is the shorthand for the expanded Salesforce–Anthropic partnership announced in August 2026, building on Claude becoming a preferred Agentforce model in late 2025. It has three visible layers: Claude models powering reasoning inside Salesforce products (with traffic staying within Salesforce's trust boundary), Salesforce surfaces inside Claude (org data and actions available in Claude conversations via connectors/MCP), and AIforce — the harness/tooling layer for building and orchestrating agents across both.",
      "The mental model that keeps you oriented: model partnerships change which brain answers, not what it's allowed to touch. Permissions, sharing, and data governance still come from your org. The strategic read is also worth knowing: Salesforce is betting on being the governed action-layer for whichever frontier models win — regulated-industry pilots (finance first) got the early rollout precisely because the trust story is the product.",
    ],
    whenToUse: [
      "Teams already using Claude for knowledge work who want org data (pipeline, cases, metrics) in those conversations without copy-paste.",
      "Agentforce use cases needing long-context reasoning or coding-adjacent skills where Claude models benchmark well.",
      "Regulated-industry deployments where the in-boundary model hosting story matters to security review.",
    ],
    whenToAvoid: [
      "Don't re-platform working automation to chase the announcement cycle — flows and Apex remain the right tool for deterministic logic.",
      "Avoid enabling org-wide access before permission hygiene and data classification are done — the AI layer inherits every gap.",
      "If your org blocks external AI tools by policy, the Claude-side surfaces need governance sign-off first — pilot narrow.",
    ],
    pitfalls: [
      "Name soup: 'Claudeforce' and 'AIforce' are partnership/community shorthand, not SKUs you'll find on a pricing page — map announcements to actual products (Agentforce 360, Claude connectors) before budgeting.",
      "Assuming all Claude usage is in-boundary: the trust-layer hosting applies to specific integrations — verify the data path for each surface you enable.",
      "Piloting on the messiest process first — partnerships don't fix undocumented processes; start where actions and guardrails are crisp.",
      "Ignoring consumption economics across two vendors — model calls, agent actions, and connector usage each meter somewhere.",
    ],
    related: ["agentforce", "headless-360", "data-360", "profiles-permission-sets"],
    resources: [
      {
        title: "Salesforce–Anthropic partnership announcement",
        url: "https://www.salesforce.com/news/press-releases/2025/10/14/salesforce-anthropic-partnership-expansion/",
        source: "Salesforce Newsroom",
        level: "intro",
      },
      {
        title: "Anthropic — Salesforce partnership page",
        url: "https://www.anthropic.com/news/salesforce-anthropic-expanded-partnership",
        source: "Anthropic",
        level: "intro",
      },
      {
        title: "Claude for Enterprise",
        url: "https://www.anthropic.com/enterprise",
        source: "Anthropic",
        level: "practical",
      },
    ],
  },
];
