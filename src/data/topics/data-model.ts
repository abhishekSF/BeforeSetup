import type { Topic } from "../types";

export const dataModelTopics: Topic[] = [
  {
    slug: "data-loading",
    title: "Data Loading & Imports",
    category: "data-model",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Getting data in and out at volume — Import Wizard, Data Loader, and the order-of-operations discipline that makes loads succeed.",
    mentalModel: [
      "Loading data into Salesforce is less about the tool and more about sequencing. Records reference each other by ID, so parents load before children: Accounts before Contacts, both before Opportunities. The tools ladder up: the Data Import Wizard (in Setup, up to 50k records, common objects, dedupe built in), Data Loader (a desktop client for millions of rows, any object, scheduled and command-line capable), and the Bulk API underneath for integration-scale jobs.",
      "The concept that saves hours: external IDs. Mark a field (like ERP_Number__c) as an external ID and you can upsert — update-or-insert in one operation — and set lookups by the external value instead of hunting for Salesforce IDs. A load spec that maps every column, states the order, and names the external IDs is the difference between a clean migration and a week of cleanup.",
    ],
    whenToUse: [
      "Migrations, one-time backfills, and recurring loads from systems that can't integrate directly yet.",
      "Upserts keyed on external IDs whenever the source system owns the data — rerunnable and idempotent beats insert-and-pray.",
      "Sandbox seeding: loading realistic test data after a refresh.",
    ],
    whenToAvoid: [
      "Ongoing high-frequency sync — that's an integration (API, events, middleware), not a nightly CSV ritual.",
      "Loading before automation is reviewed: triggers, flows, and validation rules fire on loaded records unless you deliberately plan for (or bypass) them.",
    ],
    pitfalls: [
      "Automation storms: a 100k-record load fires every trigger and flow 500 batches in a row. Know what will run, and use bypass patterns deliberately, not by disabling things ad hoc in production.",
      "Record ownership defaulting to the person running the load — suddenly the admin owns 80,000 accounts and sharing is wrong everywhere.",
      "Date, time zone, and picklist mismatches: CSV dates parse in the load user's time zone, and values not in the picklist either fail or silently pollute.",
      "No backup before a mass update or delete — export first, every time; some mistakes have no undo beyond the Recycle Bin's limits.",
    ],
    related: ["objects-and-fields", "relationships", "validation-rules", "sandboxes"],
    resources: [
      {
        title: "Data Management (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_data_management",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Data Loader Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.dataLoader.meta/dataLoader/data_loader.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Data import tools compared",
        url: "https://www.salesforceben.com/salesforce-data-loader/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "reports-dashboards",
    title: "Reports & Dashboards",
    category: "data-model",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The analytics layer users actually touch — report types define what's possible, filters define what's true.",
    mentalModel: [
      "A Salesforce report is a query built with clicks: pick a report type, filter, group, summarize. The concept people miss is that the report type — not the report — decides which objects and fields are even available, and whether you see 'Accounts with Opportunities' (only accounts having opportunities) or 'Accounts with or without Opportunities'. Half of all 'the report is wrong' tickets are really 'the report type silently excluded records'.",
      "Dashboards are collections of report-backed components with one more twist: they display data as a specific running user, which means viewers may see more (or less) than their own access would allow — a feature for executive rollups and a security consideration in the same breath. Dynamic dashboards (view as the logged-in viewer) close that gap. For analytics beyond native reports — cross-object math at scale, external data — the ladder continues into CRM Analytics and Tableau, now tied together by Tableau Semantics from the Data 360 side.",
    ],
    whenToUse: [
      "Operational questions on live CRM data: pipeline by stage, cases by priority, activities by rep — native reports are fastest and free.",
      "Dashboards as the team's shared scoreboard, with scheduled refreshes and subscriptions pushing snapshots to inboxes or Slack.",
      "Report charts embedded on record pages via App Builder — analytics where the work happens.",
    ],
    whenToAvoid: [
      "Deep multi-source analytics, statistical work, or years of history — that's Tableau/CRM Analytics or a warehouse, not a 2,000-row native report grid.",
      "Using reports as an integration ('we export this CSV nightly and load it into...') — that's an API job wearing a report costume.",
    ],
    pitfalls: [
      "The running-user trap: a dashboard built by an admin can expose aggregates to people who couldn't see the underlying records. Audit who dashboards run as.",
      "Report type sprawl: dozens of near-identical custom report types make every future field addition a maintenance chore (new fields aren't auto-added to custom report type layouts).",
      "Filters on formula fields or non-indexed fields make big reports crawl or time out.",
      "Sharing a report link doesn't share access: folder permissions decide who can see what, and 'why can't they open my report?' is always a folder question.",
    ],
    related: ["objects-and-fields", "record-types", "data-360", "sharing-and-visibility"],
    resources: [
      {
        title: "Reports & Dashboards for Lightning (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/lex_implementation_reports_dashboards",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Reports and dashboards (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.rd_reports_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Report types deep dive",
        url: "https://www.salesforceben.com/salesforce-report-types/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "objects-and-fields",
    title: "Objects & Fields",
    category: "data-model",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Objects are your database tables, fields are the columns — everything else in Salesforce is built on top of them.",
    mentalModel: [
      "If you have ever used a spreadsheet, you already understand the core idea: an object is a sheet (Accounts, Contacts, Invoices), each record is a row, and each field is a column. Salesforce ships with standard objects (Account, Contact, Opportunity, Case) and lets you create custom objects (their API names end in __c) for anything your business tracks.",
      "The important shift from spreadsheet thinking: every object automatically gets an ID, ownership, audit fields, a security model, page layouts, reporting, and an API. Creating an object isn't just making a table — it's creating a full mini-application surface. That's why data model decisions ripple into everything else: automation, security, UI, and integrations all hang off objects and fields.",
    ],
    whenToUse: [
      "You need to track a new kind of business record (invoices, assets, projects, applications).",
      "You're deciding between a custom object or repurposing a standard one — prefer standard objects when the semantics match, because ecosystem tools and AppExchange apps expect them.",
      "You need a new attribute on records — add a field rather than encoding data in text fields or naming conventions.",
    ],
    whenToAvoid: [
      "Don't create an object for data that is really just a picklist or a lookup value list.",
      "Don't model transactional, high-volume machine data (millions of rows/day) as regular custom objects — look at Big Objects, Platform Events, or keeping it off-platform.",
      "Avoid duplicating a standard object (a custom 'Company__c' next to Account) — you lose all the standard functionality wired to the original.",
    ],
    pitfalls: [
      "Field sprawl: orgs commonly end up with 300+ fields on Account where 40 are used. Every field costs page layout space, report confusion, and admin overhead. Delete or deprecate aggressively.",
      "Renaming labels doesn't rename API names. Reports and code reference API names, so a field labeled 'Region' may really be 'District__c' underneath — confusing forever.",
      "Storing structured data in free-text fields. If you ever want to filter, report, or automate on it, it needs to be a real typed field.",
      "Ignoring record ownership early. Every record has an owner, and ownership drives sharing — decide who should own what before you have a million rows.",
    ],
    related: ["relationships", "record-types", "sharing-and-visibility", "soql"],
    resources: [
      {
        title: "Data Modeling (Trailhead module)",
        url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Object Reference for the Salesforce Platform",
        url: "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_concepts.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Salesforce Object Manager guide",
        url: "https://www.salesforceben.com/salesforce-object-manager/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Data model design on architect.salesforce.com",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
  {
    slug: "relationships",
    title: "Relationships (Lookup & Master-Detail)",
    category: "data-model",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "How records point at each other — and the one choice (lookup vs master-detail) that decides deletion, security, and rollups.",
    mentalModel: [
      "A relationship is a field on one object that holds the ID of a record on another object — a foreign key with a UI. Salesforce gives you two main flavors. A lookup is a loose reference: the child can exist without the parent, and each record keeps its own owner and sharing. A master-detail is a tight bond: the child's lifecycle, ownership, and security are controlled by the parent, deleting the parent deletes the children, and you unlock roll-up summary fields (sum/count/min/max of children on the parent).",
      "The practical question to ask: 'Can this record exist meaningfully on its own?' An Invoice Line without an Invoice is meaningless — master-detail. A Contact's preferred Hotel is just a reference — lookup. For many-to-many (Students ↔ Courses), you create a junction object: a small object with two master-detail fields, one to each side.",
    ],
    whenToUse: [
      "Master-detail when children are owned parts of the parent and you want roll-up summaries and inherited security.",
      "Lookup when the reference is optional, the objects have independent lifecycles, or you need the child to have its own sharing model.",
      "Junction object whenever the real-world relationship is many-to-many.",
    ],
    whenToAvoid: [
      "Don't use master-detail just to get roll-ups if the lifecycle coupling is wrong — DLRS (a free tool) or a Flow can roll up across lookups.",
      "Avoid deep master-detail chains; Salesforce caps them and they make data loads order-dependent and fragile.",
    ],
    pitfalls: [
      "You can't easily convert lookup → master-detail once children exist with empty parent fields, and converting master-detail → lookup drops your roll-up fields. Choose deliberately.",
      "Cascade delete on master-detail surprises people: deleting one Account can silently delete thousands of child records.",
      "Junction objects inherit sharing from both masters — access requires access to both parents, which can create confusing 'why can't I see this?' tickets.",
      "Self-relationships (Account parent Account) are fine, but hierarchy roll-ups across them need code or tooling — there's no native multi-level roll-up.",
    ],
    related: ["objects-and-fields", "sharing-and-visibility", "soql", "record-types"],
    resources: [
      {
        title: "Object Relationships Overview",
        url: "https://help.salesforce.com/s/articleView?id=platform.overview_of_custom_object_relationships.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Data Modeling — Object Relationships unit",
        url: "https://trailhead.salesforce.com/content/learn/modules/data_modeling/object_relationships",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Lookup vs Master-Detail explained",
        url: "https://www.salesforceben.com/salesforce-relationships/",
        source: "Salesforce Ben",
        level: "practical",
      },
      {
        title: "DLRS — declarative rollups across lookups",
        url: "https://github.com/SFDO-Community/declarative-lookup-rollup-summaries",
        source: "Open Source",
        level: "practical",
      },
    ],
  },
  {
    slug: "record-types",
    title: "Record Types & Page Layouts",
    category: "data-model",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "One object, multiple flavors: record types let the same object behave differently for different business processes.",
    mentalModel: [
      "Sometimes one object needs to serve two processes: a Case might be a support ticket or an internal IT request; an Opportunity might follow a new-business or a renewal process. Record types are Salesforce's answer — a field on the record that switches which picklist values, page layouts, and (for some objects) business processes apply.",
      "Think of a record type as a costume, not a different body. The underlying object, fields, automation, and reporting stay shared. That's both the power (one data model, unified reporting) and the trap (all automation must now ask 'which record type is this?').",
    ],
    whenToUse: [
      "The same object genuinely follows different processes with different stages, picklist values, or layouts.",
      "Different teams need meaningfully different screens for the same data.",
      "You need to control which users can create which flavor of a record.",
    ],
    whenToAvoid: [
      "Don't use record types purely to show/hide a few fields — Dynamic Forms with field visibility rules is lighter.",
      "If the two 'flavors' share almost no fields or automation, they may deserve separate objects.",
      "Don't create a record type per team or region reflexively — sharing rules and roles usually handle audience segmentation better.",
    ],
    pitfalls: [
      "Every record type multiplies admin surface: layouts, picklist value assignments, profiles/permission sets that grant it. Three record types × four profiles is twelve combinations to maintain.",
      "Automation that forgets to filter by record type fires for flavors it was never meant for — a classic source of 'why did this email go out?'",
      "Users switching a record's type mid-lifecycle can leave picklist values that are no longer valid for the new type.",
      "Reports that don't filter by record type quietly mix apples and oranges.",
    ],
    related: ["objects-and-fields", "lightning-app-builder", "profiles-permission-sets", "flow"],
    resources: [
      {
        title: "Record Types (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.customize_recordtype.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Guide to record types",
        url: "https://www.salesforceben.com/salesforce-record-types/",
        source: "Salesforce Ben",
        level: "practical",
      },
      {
        title: "Dynamic Forms — the modern alternative for layouts",
        url: "https://help.salesforce.com/s/articleView?id=platform.dynamic_forms_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
    ],
  },
];
