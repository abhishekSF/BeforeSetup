import type { Topic } from "../types";

export const strategyTopics: Topic[] = [
  {
    slug: "org-strategy",
    title: "Org Strategy & Well-Architected",
    category: "strategy",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The decisions above any single feature: one org or many, who governs change, and what 'healthy' looks like at platform scale.",
    mentalModel: [
      "An 'org' is one Salesforce instance — one data model, one security model, one set of limits shared by everyone in it. The foundational architecture question is how many you run. A single org maximizes shared data and unified reporting but forces every business unit to coexist in one schema, one release calendar, and one governor-limit budget. Multiple orgs isolate risk and let units move independently, at the price of integration work, duplicated config, and 'which org owns this customer?' battles. Neither is wrong; unmanaged drift between them is.",
      "Salesforce's Well-Architected framework is the closest thing to an official rubric: trusted (security, compliance, reliability), easy (intentional, automated where it counts), adaptable (resilient to change, composable). In practice, org strategy is mostly governance: a decision body (call it a CoE or not) that owns the data dictionary, naming standards, automation architecture, and release calendar. Orgs don't rot because people are careless — they rot because five teams made locally sensible decisions with no shared map.",
    ],
    whenToUse: [
      "At M&A moments, new-business-unit launches, or 'should Europe get its own org?' conversations — the single-vs-multi decision is 10x cheaper made deliberately than reversed later.",
      "When technical debt conversations need structure: Well-Architected gives you shared vocabulary for why the org feels fragile.",
      "Before any major program (AI rollout, new cloud, re-platform) — architecture review first, contracts second.",
    ],
    whenToAvoid: [
      "Don't spin up a second org to escape a messy first one — the mess follows unless governance changes, and now you also own integration.",
      "Don't let governance become a committee that says no to everything; the goal is fast, safe change, not no change.",
    ],
    pitfalls: [
      "Org sprawl by acquisition: three inherited orgs, each 'temporary', still running five years later with triple licensing and nightly sync jobs nobody trusts.",
      "Ignoring limits as an architecture input: API allocations, data storage, and automation budgets are org-wide — one team's integration storm is everyone's outage.",
      "No decision log: the org's 'why' lives in the heads of people who left. Write down why the big choices were made.",
      "Skipping the operating model: who approves new fields, who owns integration users, who reviews AppExchange installs — undefined means everyone and no one.",
    ],
    related: ["governor-limits", "integration-patterns", "deployments", "licenses-editions", "large-data-volumes"],
    resources: [
      {
        title: "Salesforce Well-Architected",
        url: "https://architect.salesforce.com/well-architected/overview",
        source: "Salesforce Architects",
        level: "practical",
      },
      {
        title: "Architect resources hub",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "intro",
      },
      {
        title: "Multi-org vs single-org strategy",
        url: "https://www.salesforceben.com/salesforce-multi-org-vs-single-org/",
        source: "Salesforce Ben",
        level: "deep",
      },
    ],
  },
  {
    slug: "large-data-volumes",
    title: "Large Data Volumes & Performance",
    category: "strategy",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "What changes when objects hit millions of rows: skew, selectivity, archiving — the physics of the platform at scale.",
    mentalModel: [
      "Salesforce performs beautifully until certain thresholds, then degrades in specific, predictable ways. The big four LDV problems: non-selective queries (filters on non-indexed fields force full scans that time out past a few hundred thousand rows), data skew (one parent with 10,000+ children, or one owner with millions of records, turns every update into a lock contention fight), sharing recalculation (OWD or role changes on huge objects can lock things for hours), and storage costs (per-GB pricing that makes keeping everything forever an expensive default).",
      "The toolkit maps to the problems: custom indexes and external IDs for selectivity, skinny tables for hot reporting queries (via Support), distributing ownership and parenting to avoid skew, Big Objects or off-platform archives for cold data, and PK chunking for extracting huge tables. The strategic mindset: design for volume before you have it — retrofitting selectivity onto a 50-million-row object is a project; designing it in was a meeting.",
    ],
    whenToUse: [
      "Any object projected past ~1–2 million rows: decide indexes, ownership distribution, and archive policy up front.",
      "Before big migrations or integrations — load order, batch sizes, and deferred sharing calculation are the difference between a weekend and a month.",
      "Diagnosing timeouts: 'report suddenly stopped loading' on a grown object is almost always selectivity.",
    ],
    whenToAvoid: [
      "Don't reach for exotic tools (skinny tables, custom big-data patterns) before basics: indexed filters, date-bounded reports, and archiving solve most cases.",
      "Don't keep transactional history on-platform forever out of inertia — cold data belongs in cheaper storage with a retrieval path.",
    ],
    pitfalls: [
      "Ownership skew from integration users: one API user owning millions of records creates lock contention every time their role or records change. Distribute or use queues deliberately.",
      "Parent skew: an 'Unassigned' bucket account with 300k contacts turns routine updates into row-lock roulette.",
      "Testing performance in a sandbox with 1% of production data — selectivity problems only appear at volume; test in Full Copy or with generated volume.",
      "Forgetting deletes are expensive too: mass-deleting millions of rows churns indexes and recycle bin; plan hard deletes and Bulk API delete jobs.",
    ],
    related: ["soql", "governor-limits", "sharing-and-visibility", "data-loading", "org-strategy"],
    resources: [
      {
        title: "Best Practices for Deployments with Large Data Volumes",
        url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_introduction.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Query optimization and selectivity",
        url: "https://developer.salesforce.com/blogs/engineering/2015/06/query-optimizer-a-deeper-look-at-force-com",
        source: "Salesforce Engineering",
        level: "deep",
      },
      {
        title: "Data skew explained",
        url: "https://www.salesforceben.com/salesforce-data-skew/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "licenses-editions",
    title: "Licenses & Editions",
    category: "strategy",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "What you're actually buying: editions set org capabilities, licenses set what each user can touch — and both quietly shape architecture.",
    mentalModel: [
      "Two axes decide what's possible before any design conversation. The edition (Starter, Professional, Enterprise, Unlimited — Enterprise is the de facto business standard) sets org-level capabilities: API access, number of sandboxes, automation limits, advanced features. The user license (Salesforce, Salesforce Platform, Experience Cloud licenses, and a zoo of add-ons) sets what each human can access: full CRM objects versus platform-only (custom objects plus a subset of standard ones).",
      "The architectural insight consultants internalize: licensing is a design input, not a procurement afterthought. Platform licenses cost a fraction of full licenses — so an internal app for 500 warehouse staff might be designed around custom objects specifically so it works on Platform licenses. Experience Cloud login-based versus member-based pricing decides portal architecture. And the newest wrinkle: AI features are consumption-priced (credits/usage), which means budgeting shifts from 'per seat per month' to 'per unit of work' — a different conversation with finance entirely.",
    ],
    whenToUse: [
      "At solution design time: 'which license does this persona need?' belongs in the same breath as 'which objects do they touch?'",
      "Before AppExchange or add-on purchases — many features people assume are core (CPQ, advanced analytics, shield encryption) are separately licensed.",
      "At renewal: usage audits routinely find paid-for licenses unassigned and assigned users inactive.",
    ],
    whenToAvoid: [
      "Don't design around license workarounds that violate terms (shared logins, one integration user 'representing' many humans) — audits happen, and true-ups are priced accordingly.",
      "Don't optimize licensing so aggressively that the org becomes unbuildable — saving on Platform licenses and then needing Opportunities anyway is a redesign, not a discount.",
    ],
    pitfalls: [
      "Assuming a feature exists in the customer's edition: Professional lacks things Enterprise developers take for granted. Check edition first, always.",
      "The standard-object trap with Platform licenses: they include Accounts and Contacts but not Opportunities, Cases (limited), or Leads — designs drift into needing full licenses one object at a time.",
      "Sandbox entitlements vary by edition — a deployment strategy assuming a Full Copy sandbox the customer doesn't have.",
      "Consumption-based AI pricing without instrumentation: pilot first, meter usage, then contract — not the reverse.",
    ],
    related: ["org-strategy", "profiles-permission-sets", "experience-cloud", "appexchange"],
    resources: [
      {
        title: "Salesforce editions compared",
        url: "https://help.salesforce.com/s/articleView?id=sales.overview_edition.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "User licenses overview",
        url: "https://help.salesforce.com/s/articleView?id=platform.users_understanding_license_types.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Salesforce licensing explained",
        url: "https://www.salesforceben.com/salesforce-licenses/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "appexchange",
    title: "AppExchange & Buy vs Build",
    category: "strategy",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Salesforce's app store — and the recurring judgment call between installing someone's package and building it yourself.",
    mentalModel: [
      "AppExchange is the marketplace of packages that install into your org: managed packages (vendor-controlled, upgradeable, code hidden, their objects carry a namespace prefix) and unmanaged ones (a one-time copy you own and maintain). The ecosystem is genuinely one of Salesforce's superpowers — document generation, CPQ, dedupe, integration connectors, and whole industry solutions exist so you don't build them.",
      "The buy-vs-build calculus is about total cost of ownership, not sticker price. Buying gets you years of edge cases already handled, support, and upgrades — at the cost of subscription fees, another vendor relationship, and fitting their model. Building gets exact fit and no per-user fees — at the cost of you owning every bug, enhancement, and the bus factor forever. The consultant's rule of thumb: buy for commodity problems (e-signature, dedupe, doc gen), build for the thing that is actually your client's competitive differentiation, and be suspicious of anyone whose answer never varies.",
    ],
    whenToUse: [
      "Commodity capabilities with mature vendors — the boring, load-bearing stuff dozens of vendors have hardened for a decade.",
      "When time-to-value dominates: a package live in two weeks beats a build live in two quarters, even at higher run cost.",
      "Security review as a gate: check the package's security review status, install counts, release cadence, and support reputation before piloting.",
    ],
    whenToAvoid: [
      "Core differentiators: if the process is why the client wins deals, owning the logic usually beats renting an approximation.",
      "Thin wrappers: a package that saves two weeks of Flow building but adds a permanent per-user fee and an upgrade dependency is a bad trade.",
      "Abandoned-ware: low install counts, stale release notes, and no roadmap are exit signs regardless of the demo.",
    ],
    pitfalls: [
      "Packages consume shared org resources: their queries, automation, and API calls count against your limits, and their objects count against storage.",
      "Uninstalling is never clean — data in package objects, dependencies from your customizations into their namespace, and reports built on their objects all need migration planning.",
      "Unmanaged packages are a fork, not a product: no upgrades, and the code becomes yours the moment you install it.",
      "License sprawl inside packages: many are per-user-per-month on top of Salesforce licensing — model the three-year cost, not the pilot price.",
    ],
    related: ["licenses-editions", "org-strategy", "deployments", "governor-limits"],
    resources: [
      {
        title: "AppExchange",
        url: "https://appexchange.salesforce.com/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "ISVforce Guide (how packages work)",
        url: "https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/packaging_intro.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Evaluating AppExchange apps",
        url: "https://www.salesforceben.com/appexchange-apps/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "implementation-lifecycle",
    title: "Running an Implementation",
    category: "strategy",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The consultant's actual job: discovery to design to build to UAT to go-live — and the adoption work that decides whether any of it mattered.",
    mentalModel: [
      "Salesforce projects rarely fail on technology; they fail on requirements and adoption. The lifecycle that works: discovery (understand the process as it actually runs, not as the org chart claims — shadow the users), design (data model and security model first, screens later; write decisions down), build (in a sandbox, in vertical slices users can react to, not horizontal layers), UAT (real users, real scenarios, real data shapes — not the consultant clicking through happy paths), go-live (with a cutover runbook and a rollback plan), and hypercare (the two weeks after launch when trust is won or lost).",
      "The two consultant instincts worth developing early: requirements are hypotheses, not specs — 'the client asked for it' is not a reason to build something that won't get used; and every customization has a maintenance tail — the elegant thing you build today is the thing an admin must understand in three years. Bias toward standard features, document the deltas, and leave the org more understandable than you found it.",
    ],
    whenToUse: [
      "Any project bigger than a single feature: even a lightweight version of this arc (one-page discovery, one-page design doc, real UAT) pays for itself.",
      "Rescue engagements: when you inherit a failing project, re-running discovery is almost always the fix — the build was answering the wrong question.",
      "Change management from day one: champions, training, and 'what's in it for the rep' messaging start at kickoff, not at go-live.",
    ],
    whenToAvoid: [
      "Don't waterfall a discovery for six months either — time-boxed discovery with working prototypes beats documents nobody reads.",
      "Don't let UAT become a demo: if users haven't tried to break it with their real messy cases, it hasn't been tested.",
    ],
    pitfalls: [
      "Building the old process in new software: 'lift and shift' of a broken workflow just makes the dysfunction faster. Discovery should challenge, not transcribe.",
      "Skipping data migration planning until late — legacy data quality is always worse than claimed, and migration is regularly the critical path.",
      "No named product owner on the client side: decisions by committee stall builds and produce Frankenstein requirements.",
      "Go-live as the finish line: adoption metrics (login rates, field fill rates, pipeline hygiene) for the first 90 days are the actual deliverable.",
    ],
    related: ["org-strategy", "data-loading", "sandboxes", "licenses-editions", "reports-dashboards"],
    resources: [
      {
        title: "Salesforce implementation guide",
        url: "https://www.salesforceben.com/salesforce-implementation/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Well-Architected: process and governance",
        url: "https://architect.salesforce.com/well-architected/overview",
        source: "Salesforce Architects",
        level: "practical",
      },
      {
        title: "Consultant career and craft resources",
        url: "https://www.apexhours.com/",
        source: "Apex Hours",
        level: "practical",
      },
    ],
  },
];
