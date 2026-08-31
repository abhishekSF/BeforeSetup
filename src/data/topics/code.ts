import type { Topic } from "../types";

export const codeTopics: Topic[] = [
  {
    slug: "apex",
    title: "Apex",
    category: "code",
    tagline:
      "Salesforce's server-side language — Java-flavored, database-aware, and governed by strict resource limits.",
    mentalModel: [
      "Apex looks like Java (classes, interfaces, strong typing) but is fused to the database: SOQL queries and DML statements are language keywords, and sObjects are first-class types. Your code runs on Salesforce's servers inside a multitenant environment — which is why governor limits exist and shape every design decision.",
      "Two facts orient everything else. First, Apex runs in system mode by default: it sees all data unless you deliberately enforce sharing and field security ('with sharing', 'WITH USER_MODE'). Second, everything is transactional: one save, one transaction, one set of limits shared by all triggers, flows, and code it touches.",
    ],
    whenToUse: [
      "Business logic beyond Flow's comfort zone: complex algorithms, heavy branching, reusable services.",
      "Web services: exposing custom REST endpoints or calling external APIs with real error handling.",
      "Anywhere you need unit tests, code review, and version control discipline around behavior.",
    ],
    whenToAvoid: [
      "Anything a before-save flow or validation rule does adequately — code you don't write is code you don't maintain.",
      "Teams with no ongoing Apex ownership — declarative solutions degrade more gracefully than orphaned code.",
    ],
    pitfalls: [
      "Forgetting system mode: Apex that queries and returns data to the UI can leak records users shouldn't see. Use 'with sharing' and user-mode operations deliberately.",
      "Non-bulkified patterns — queries/DML in loops — the eternal classic.",
      "Hardcoded IDs that differ between sandboxes and production; use Custom Metadata, Custom Labels, or queries.",
      "Swallowing exceptions with empty catch blocks — failures disappear until an executive asks where the data went.",
    ],
    related: ["apex-triggers", "soql", "governor-limits", "apex-testing", "async-apex"],
    resources: [
      {
        title: "Apex Basics & Database (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_database",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Apex Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dev_guide.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Apex Hours — community deep dives",
        url: "https://www.apexhours.com/",
        source: "Apex Hours",
        level: "deep",
      },
      {
        title: "Advanced Apex Programming (book site)",
        url: "https://advancedapex.com/",
        source: "Dan Appleman",
        level: "deep",
      },
    ],
  },
  {
    slug: "soql",
    title: "SOQL & SOSL",
    category: "code",
    tagline:
      "Salesforce's query languages: SOQL for precise object queries, SOSL for cross-object text search.",
    mentalModel: [
      "SOQL reads like SQL but queries objects, not tables — and it never joins arbitrarily. Instead you traverse relationships: child-to-parent ('SELECT Account.Name FROM Contact') and parent-to-children via subqueries ('SELECT Name, (SELECT LastName FROM Contacts) FROM Account'). No SELECT *, no cross-object joins outside defined relationships — the schema is the map.",
      "SOSL is different: a text search across many objects at once ('FIND {acme} IN ALL FIELDS RETURNING Account, Contact, Lead'), powered by search indexes. Rule of thumb: SOQL when you know where the data lives; SOSL when you're searching for text and don't.",
    ],
    whenToUse: [
      "All record retrieval in Apex, plus reports of record: list views, APIs, analytics extracts.",
      "Aggregates (COUNT, SUM, GROUP BY) for on-the-fly rollups within limits.",
      "SOSL for global-search-style features across multiple objects.",
    ],
    whenToAvoid: [
      "Don't emulate joins by querying in loops — restructure with relationship queries or maps.",
      "Avoid negative filters (!=, NOT LIKE) and leading wildcards on big tables — they defeat indexes.",
      "Don't use SOQL for full-text ranking — that's SOSL's job.",
    ],
    pitfalls: [
      "Non-selective queries on large objects throw runtime errors in triggers — filter on indexed fields (Id, Name, lookups, external IDs, unique fields).",
      "The 50,000-row query limit per transaction: 'query everything, filter in Apex' collapses at scale.",
      "Querying inside loops — same classic, worth repeating; use maps keyed by ID.",
      "Forgetting field-level security: SOQL in system mode returns fields the user can't see. Use WITH USER_MODE or stripInaccessible for user-facing data.",
    ],
    related: ["apex", "governor-limits", "objects-and-fields", "relationships"],
    resources: [
      {
        title: "SOQL for Admins/Developers (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_database/apex_database_soql",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "SOQL and SOSL Reference",
        url: "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Query Plan tool & selectivity explained",
        url: "https://help.salesforce.com/s/articleView?id=000386021&type=1",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "governor-limits",
    title: "Governor Limits",
    category: "code",
    tagline:
      "Hard per-transaction resource caps — the rules of physics on a multitenant platform.",
    mentalModel: [
      "Salesforce runs thousands of customers on shared infrastructure, so every transaction gets a hard budget: 100 SOQL queries, 150 DML statements, 10,000 rows written, CPU time, heap size, one set of numbers for synchronous work and a bigger set for async. Exceed any one and the transaction dies with an uncatchable exception — no negotiation.",
      "The productive mindset: limits aren't obstacles, they're design pressure. They force bulkification (operate on collections), separation of heavy work into async, and thoughtful data access. Code that respects limits is usually just… better code. The limits are also cumulative per transaction: your trigger, the flow an admin added, and a managed package all share the same budget — which is why 'it worked until we installed X' happens.",
    ],
    whenToUse: [
      "Reading this before writing any Apex or complex Flow — limits shape the idioms.",
      "Debugging LimitException errors: check Limits.getQueries(), debug logs, and what else runs in the transaction.",
      "Designing data loads and integrations: batch sizes and async choices flow from limit math.",
    ],
    whenToAvoid: [
      "Don't design to the exact edge of a limit — orgs grow, packages get installed, budgets shrink in practice.",
      "Don't reach for 'just make it async' reflexively — async has its own limits and adds eventual-consistency complexity.",
    ],
    pitfalls: [
      "Testing with 1 record, deploying to users who load 200 at a time — limits scale with bulk, your loop-based code doesn't.",
      "Blaming your code when a managed package or a colleague's flow consumed the budget — read the whole transaction's debug log.",
      "Catching generic exceptions and assuming you caught the LimitException — you can't catch it; design so you never hit it.",
      "Forgetting that email sends, callouts, and future calls have their own counters beyond the famous SOQL/DML ones.",
    ],
    related: ["apex", "soql", "async-apex", "apex-triggers", "flow"],
    resources: [
      {
        title: "Execution Governors and Limits",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_gov_limits.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Working with limits (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_database/apex_database_intro",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Order of Execution — the full transaction picture",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers_order_of_execution.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
    ],
  },
  {
    slug: "apex-testing",
    title: "Apex Testing",
    category: "code",
    tagline:
      "75% coverage is the deployment gate — but assertions, not coverage, are the point.",
    mentalModel: [
      "Salesforce won't deploy Apex to production without tests covering 75% of lines, and every trigger needs some coverage. Tests run in an isolated bubble: they see no org data by default (@isTest classes create their own), and their DML rolls back automatically. The platform-specific idioms: @TestSetup methods create shared fixture data once; Test.startTest()/stopTest() resets limits and forces async work to complete so you can assert on results; System.runAs() simulates users for security testing.",
      "The cultural trap is treating 75% as the goal. Coverage without assertions is theater — the real question is 'if someone breaks the logic, does a test fail?' Good Salesforce teams write tests for bulk (200 records), for negative cases, and for the user-permission boundaries that system-mode Apex makes easy to miss.",
    ],
    whenToUse: [
      "Always — it's mandatory for deployment. The choice is only between good tests and checkbox tests.",
      "Test data factories (a TestDataFactory class) as soon as two test classes need similar records.",
      "runAs + user-mode assertions when your code claims to respect sharing or FLS.",
    ],
    whenToAvoid: [
      "SeeAllData=true — tests that depend on org data break across sandboxes and rot. Almost never justified.",
      "Testing implementation details (exact query counts, private internals) so tightly that safe refactors break tests.",
    ],
    pitfalls: [
      "Zero-assertion tests written only to satisfy coverage — they pass while the logic silently breaks.",
      "Single-record tests for trigger logic — bulk bugs ship undetected; always test with collections.",
      "Validation rules and required fields added later break test factories org-wide — centralize test data creation.",
      "Slow suites from redundant setup — @TestSetup and lean fixtures keep the deploy pipeline fast.",
    ],
    related: ["apex", "apex-triggers", "deployments", "governor-limits"],
    resources: [
      {
        title: "Apex Testing (Trailhead module)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_testing",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Testing Apex — Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Testing best practices",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_best_practices.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
    ],
  },
];
