import type { Topic } from "../types";

export const strategyTopics: Topic[] = [
  {
    slug: "org-strategy",
    title: "Org Strategy & Well-Architected",
    category: "strategy",
    tagline:
      "One org or many? Who decides what gets built? The decisions above the build that determine whether the platform stays healthy.",
    mentalModel: [
      "An 'org' is one Salesforce instance — one database, one config, one set of limits. Org strategy asks: should the enterprise run one org (one customer view, shared automation, but every team shares limits and release trains) or multiple orgs (autonomy and isolation, but integration projects to see across them)? There's no universally right answer; there are trade-offs you choose deliberately or inherit accidentally through acquisitions.",
      "Salesforce's Well-Architected framework is the closest thing to an official rubric: Trusted (security, compliance, reliability), Easy (intentional, maintainable design over cleverness), Adaptable (resilient to change, scalable). The practical companion is governance: a body that decides what gets built where, naming and documentation standards, and a technical-debt register someone actually reads. Most 'Salesforce is a mess' stories are governance failures wearing a technology costume.",
    ],
    whenToUse: [
      "At genuine inflection points: mergers, new business units, international expansion, or replatforming decisions.",
      "When symptoms of org sprawl appear: colliding automation, teams afraid to deploy, nobody able to answer 'what does this flow do?'",
      "Setting up a Center of Excellence or governance cadence before scale makes retrofitting painful.",
    ],
    whenToAvoid: [
      "Don't split orgs to dodge fixable governance problems — two messy orgs are worse than one governed org.",
      "Don't cargo-cult enterprise governance onto a 20-user org — right-size the ceremony to the stakes.",
    ],
    pitfalls: [
      "Accidental multi-org: each acquisition keeps its org 'temporarily', and five years later the 360-degree customer view is an integration program.",
      "Limits are org-wide: one team's data-hungry integration consumes API calls and storage for everyone — shared orgs need shared budgeting.",
      "No decision log: without recorded 'why', every architecture debate restarts from zero when people rotate.",
      "Well-Architected as a poster instead of a practice — the framework only helps if reviews actually reference it.",
    ],
    related: ["large-data-volumes", "licenses-editions", "deployments", "integration-patterns"],
    resources: [
      {
        title: "Salesforce Well-Architected",
        url: "https://architect.salesforce.com/well-architected/overview",
        source: "Salesforce Architects",
        level: "practical",
      },
      {
        title: "Multi-org vs single-org strategy",
        url: "https://architect.salesforce.com/decision-guides/org-strategy",
        source: "Salesforce Architects",
        level: "deep",
      },
      {
        title: "Architect journey — org strategy resources",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "intro",
      },
    ],
  },
  {
    slug: "large-data-volumes",
    title: "Large Data Volumes & Performance",
    category: "strategy",
    tagline:
      "What changes when objects hit millions of rows — skew, selectivity, and the archiving conversation nobody schedules.",
    mentalModel: [
      "Most Salesforce advice assumes tables of thousands of rows. Past a few million, physics asserts itself: queries need selective, indexed filters or they time out; sharing recalculation on OWD changes takes hours; reports that scanned everything stop returning. 'LDV' (large data volumes) is the umbrella term for designing around this.",
      "The two named villains: data skew (one parent — or one owner — with tens of thousands of children causes lock contention and sharing math explosions; the classic is 300,000 contacts on one 'Unknown' account) and non-selective queries (filters on unindexed fields force full scans). The toolkit: indexed/external-ID fields in every hot filter, skinny data models for hot paths, Big Objects or off-platform archives for cold history, and deliberate ownership distribution to avoid ownership skew.",
    ],
    whenToUse: [
      "Designing objects you expect to grow into the millions — retrofitting selectivity is far costlier than planning it.",
      "Diagnosing timeouts, slow reports, and 'UNABLE_TO_LOCK_ROW' errors in orgs with big tables.",
      "Data retention planning: deciding what stays hot, what archives, and what deletes — before storage bills force the question.",
    ],
    whenToAvoid: [
      "Don't optimize prematurely: a 50,000-row object doesn't need Big Objects and skinny tables — standard patterns are fine.",
      "Don't archive into a void: 'we deleted old records' without an access story becomes a compliance or support crisis later.",
    ],
    pitfalls: [
      "The default-account trap: bulk loads dumping orphan records onto one parent create account skew that surfaces months later as lock timeouts.",
      "Storage economics ignored: Salesforce storage is expensive per GB — attachments and history tables quietly dominate bills.",
      "OWD/role changes on big objects scheduled at 2pm Tuesday: sharing recalc locks the org during business hours.",
      "Testing performance in a sandbox with 1% of production data — everything is fast in an empty database.",
    ],
    related: ["org-strategy", "soql", "data-loading", "sharing-and-visibility", "data-360"],
    resources: [
      {
        title: "Best Practices for LDV (whitepaper)",
        url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_introduction.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Large Data Volumes (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/large-data-volumes",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Big Objects overview",
        url: "https://developer.salesforce.com/docs/atlas.en-us.bigobjects.meta/bigobjects/big_object.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
  {
    slug: "licenses-editions",
    title: "Licenses & Editions",
    category: "strategy",
    tagline:
      "What you're actually buying — editions set org capabilities, licenses set per-user access, and both shape what you can build.",
    mentalModel: [
      "Salesforce pricing has two axes. The edition (Starter, Professional, Enterprise, Unlimited/Agentforce 1) sets org-level capabilities and limits: API access, sandboxes, custom objects, advanced features. The license (per user) sets what each person can touch: full Sales/Service Cloud licenses, cheaper Platform licenses (custom apps but not standard CRM objects like Opportunities), and Experience Cloud licenses for external users.",
      "The architectural insight most people miss: licensing is a design constraint, not just procurement's problem. A team on Platform licenses can't use Opportunities — so 'just track it on the Opportunity' isn't available to them. Feature gates differ by edition — designs that assume Enterprise features die in Professional orgs. And the consumption layer (Data 360 credits, Agentforce usage) now sits on top of everything, priced by usage rather than by seat.",
    ],
    whenToUse: [
      "Before any solution design: know the org's edition and the audience's license types — they bound the solution space.",
      "Cost optimization: users who only touch custom apps may fit Platform licenses at a fraction of full-license cost.",
      "Contract planning: understanding what's edition-gated versus add-on prevents mid-project purchase surprises.",
    ],
    whenToAvoid: [
      "Don't design against features you haven't verified in this org — 'it worked in my last org' often means 'my last org had a different edition'.",
      "Don't over-license 'to be safe' — audit what users actually touch; license downgrades at renewal fund real projects.",
    ],
    pitfalls: [
      "API access surprises: lower editions historically gated API access — integration plans must check before committing.",
      "License-type sprawl in Experience Cloud: member-based vs login-based external licenses have wildly different economics at scale.",
      "Consumption-pricing blindness: agent actions and Data 360 usage are metered — pilots that ignore burn rates produce renewal shocks.",
      "Feature-license mismatch: buying add-ons (CPQ, Marketing Cloud) without checking integration and skill prerequisites.",
    ],
    related: ["org-strategy", "appexchange", "experience-cloud", "agentforce"],
    resources: [
      {
        title: "Salesforce Pricing & Editions",
        url: "https://www.salesforce.com/pricing/",
        source: "Salesforce",
        level: "intro",
      },
      {
        title: "User license types (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.users_license_types_available.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Editions comparison guide",
        url: "https://www.salesforceben.com/salesforce-editions/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "appexchange",
    title: "AppExchange & Buy vs Build",
    category: "strategy",
    tagline:
      "Salesforce's app marketplace — and the discipline of deciding when to install, when to build, and what installing really costs.",
    mentalModel: [
      "AppExchange is the enterprise app store: thousands of managed packages — from document generation to CPQ to dedupe tools — that install into your org. A managed package is a vendor-controlled black box: its internals are protected, it upgrades on the vendor's cadence, and its objects and code live alongside yours (its Apex usually runs in its own limits namespace, which helps).",
      "The buy-vs-build question is really total-cost accounting. Build: you own every future enhancement, bug, and admin's learning curve. Buy: license fees, vendor dependency, and integration seams — but features (and their maintenance) arrive from a team whose whole job is that feature. The rule of thumb that survives contact with reality: buy for commodity problems (e-signature, document generation, dedupe), build for whatever differentiates your business.",
    ],
    whenToUse: [
      "Commodity capabilities with mature vendors — the build-it-ourselves version will be worse and cost more than the license.",
      "Speed-to-value pressure: a package deploys in weeks; the bespoke build lands next year.",
      "Solution research: browsing AppExchange first is due diligence — someone has probably solved this.",
    ],
    whenToAvoid: [
      "Core differentiators: outsourcing your competitive advantage to a vendor's roadmap is strategic risk.",
      "When a package solves 20% of the need and you'd customize around the other 80% — you inherit both maintenance burdens.",
      "Marginal vendors: check the security review status, release cadence, support responsiveness, and what happens to data at uninstall.",
    ],
    pitfalls: [
      "Package sprawl: each install adds objects, automation, and permission surface — audit installed packages annually or accrete forever.",
      "Uninstall is never clean: data in package objects, integrations against package fields, and user habits all outlive the license.",
      "Limits interplay: packages share org-wide resources (storage, API calls) even when their Apex has its own namespace limits.",
      "Skipping the trial in a full-copy sandbox: install behavior with your data volumes and automation is the real test.",
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
        title: "AppExchange Basics (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/appexchange_basics",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "ISVforce Guide — how packages work under the hood",
        url: "https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/packaging_intro.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
    ],
  },
  {
    slug: "implementation-lifecycle",
    title: "Implementation Lifecycle",
    category: "strategy",
    tagline:
      "How Salesforce projects actually run — discovery to design to build to UAT to go-live, and why adoption is the real finish line.",
    mentalModel: [
      "A Salesforce implementation follows a recognizable arc: discovery (what does the business actually do — not what the RFP said), solution design (map requirements to platform capabilities, decide build-vs-buy-vs-config), build in sandboxes, user acceptance testing (real users, real scenarios, real data samples), data migration, cutover, and hypercare (the weeks after go-live when trust is won or lost). Iterative delivery beats big-bang: shippable increments every few weeks surface wrong assumptions while they're still cheap.",
      "The uncomfortable truth of the trade: most failed implementations fail on people, not technology. Requirements gathered from managers instead of daily users, UAT compressed to a checkbox week, no champion inside the business, training as an afterthought — the go-live works and the adoption doesn't. 'Working software' and 'successful project' are different finish lines; the second one pays for the first.",
    ],
    whenToUse: [
      "Any net-new implementation or major module rollout — the arc applies whether the builder is a partner or an internal team.",
      "Rescuing a troubled project: locating which phase was skipped (usually discovery or UAT) tells you where the pain comes from.",
      "Scoping engagements: phase boundaries are natural checkpoints for budget and go/no-go decisions.",
    ],
    whenToAvoid: [
      "Don't waterfall a two-week enhancement through seven ceremonial phases — right-size process to risk.",
      "Don't let 'agile' mean 'no design': data model and security decisions are expensive to reverse — some things deserve upfront thought.",
    ],
    pitfalls: [
      "Requirements theater: stakeholders describe the process as documented, not as practiced — shadow real users during discovery.",
      "UAT with clean data: everything passes with tidy test records, then production's messy legacy data breaks assumptions on day one.",
      "Migration as an afterthought: data cleanup takes longer than the build more often than anyone budgets for.",
      "No hypercare plan: the first two weeks post-launch decide adoption — unanswered questions calcify into workarounds.",
      "Success measured at go-live: measure usage, data quality, and cycle-time impact at 90 days — that's the real report card.",
    ],
    related: ["org-strategy", "sandboxes", "data-loading", "appexchange", "licenses-editions"],
    resources: [
      {
        title: "Salesforce implementation guide (community)",
        url: "https://www.salesforceben.com/salesforce-implementation/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Consultant skills trailmix",
        url: "https://trailhead.salesforce.com/content/learn/trails/build-your-consulting-practice",
        source: "Trailhead",
        level: "practical",
      },
      {
        title: "Change management on architect.salesforce.com",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
];
