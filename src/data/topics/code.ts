import type { Topic } from "../types";

export const codeTopics: Topic[] = [
  {
    slug: "apex",
    title: "Apex",
    category: "code",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Salesforce's server-side language. It is Java-flavored, database-aware, and always running inside the platform's rules.",
    mentalModel: [
      "Apex looks like Java: classes, interfaces, strong typing, familiar syntax. What makes it different is that it runs inside Salesforce's multitenant runtime with the database built into the language. You write SOQL queries inline, DML statements (insert/update/delete) are keywords, and every record is an sObject you manipulate directly.",
      "Because thousands of orgs share the same servers, Apex runs under governor limits. Those are hard caps on queries, DML, CPU time, and memory per transaction. This is the single biggest adjustment for developers from other platforms. You don't write Apex to work. You write it to work at 200 records at a time. Bulkification, operating on collections, never row-by-row, is not an optimization. It is table stakes.",
    ],
    whenToUse: [
      "Business logic beyond Flow's comfort zone: complex branching, reusable services, sophisticated queries and transformations.",
      "Web services: expose REST endpoints from your org or call external APIs with full control.",
      "Backend for Lightning Web Components (@AuraEnabled methods).",
      "Anywhere rigor matters: Apex has real unit testing, code review, and version control workflows.",
    ],
    whenToAvoid: [
      "Anything an admin could maintain in Flow. Code concentrates maintenance on developers forever.",
      "Long-running or compute-heavy workloads such as ML scoring or media processing. The platform will stop you. Run those off-platform and integrate.",
    ],
    pitfalls: [
      "Queries or DML inside loops. That is the number one Apex sin. Collect, then operate once.",
      "Ignoring that Apex runs in system mode by default: your code can see and modify records the running user can't. Enforce security intentionally (WITH USER_MODE, Security.stripInaccessible).",
      "Hardcoded IDs that differ between sandbox and production.",
      "Skipping null and empty-list handling. A query returning no rows gives an empty list, but single-record shortcuts throw.",
    ],
    related: ["soql", "governor-limits", "apex-testing", "apex-triggers", "async-apex", "lightning-web-components"],
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
        title: "Apex Hours, free community deep dives",
        url: "https://www.apexhours.com/",
        source: "Apex Hours",
        level: "practical",
      },
      {
        title: "Enterprise patterns: service, domain, selector layers",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_patterns_sl",
        source: "Trailhead",
        level: "deep",
      },
    ],
  },
  {
    slug: "soql",
    title: "SOQL & SOSL",
    category: "code",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The query languages of Salesforce: SOQL for precise record retrieval, SOSL for fuzzy text search across objects.",
    mentalModel: [
      "SOQL reads like SQL's SELECT but queries objects, not tables, and it knows your relationships. You can traverse up (SELECT Account.Owner.Name FROM Contact) and down (SELECT Name, (SELECT LastName FROM Contacts) FROM Account) without writing joins. There is no SELECT *; you always name your fields. There are no arbitrary joins either. You can only traverse defined relationships, which is why data model design matters so much.",
      "SOSL is the other tool: a text search engine query (FIND 'acme' IN ALL FIELDS RETURNING Account, Contact) that hits the search index across multiple objects at once. Rule of thumb: SOQL when you know where the data lives and what conditions define it; SOSL when a human typed a search box string and you don't know which object it's on.",
    ],
    whenToUse: [
      "Retrieving records in Apex, Flow, reports-adjacent tooling, or via the API. SOQL is everywhere.",
      "Parent and child traversal in one query instead of multiple round trips.",
      "Aggregates: COUNT, SUM, GROUP BY for on-the-fly summaries.",
    ],
    whenToAvoid: [
      "Search-box features across many objects. That is SOSL's job, and it is much faster for text.",
      "Analytics over very large volumes. SOQL with non-selective filters on millions of rows will time out. Consider indexed filters, skinny setups, or moving analytics off-platform, such as CRM Analytics or a warehouse.",
    ],
    pitfalls: [
      "Non-selective queries on large objects: filters on non-indexed fields (or negative filters like !=) force full scans and throw errors past ~100k rows.",
      "Governor math: 100 SOQL queries per synchronous transaction. Queries in loops burn this instantly.",
      "Relationship name confusion: custom relationships use __r in queries (Invoice__r.Name), not __c.",
      "Querying more rows than you can hold. The limit is 50k rows per transaction. Use Batch Apex or query more selectively.",
    ],
    related: ["apex", "governor-limits", "relationships", "objects-and-fields"],
    resources: [
      {
        title: "SOQL and SOSL Reference",
        url: "https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_sosl_intro.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "SOQL for Admins and beginners",
        url: "https://www.salesforceben.com/soql-in-salesforce/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Query optimization and selectivity",
        url: "https://developer.salesforce.com/blogs/engineering/2015/06/query-optimizer-a-deeper-look-at-force-com",
        source: "Salesforce Engineering",
        level: "deep",
      },
    ],
  },
  {
    slug: "governor-limits",
    title: "Governor Limits",
    category: "code",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The hard caps on every transaction. They are the design constraints that shape all good Salesforce code.",
    mentalModel: [
      "Salesforce is multitenant. Your code shares servers with thousands of other orgs. Governor limits are the platform's fairness rules. They are hard per-transaction caps like 100 SOQL queries, 150 DML statements, 10,000 rows of DML, 10 seconds of CPU for synchronous work, and 6MB heap. Exceed one and your transaction dies with an uncatchable limit exception, rolling everything back.",
      "Limits are per transaction. A transaction includes everything in the cascade. Your trigger, the flows it causes, their triggers, and so on all share one budget. That's why bulkification and lean automation aren't style preferences. Async contexts (Batch, Queueable) get fresh, higher limits per execution, which is the standard escape hatch for volume.",
    ],
    whenToUse: [
      "Every design conversation. 'What happens when 200 records hit this at once?' is the question that separates working orgs from fragile ones.",
      "Choosing sync vs async: if the math doesn't fit in one transaction's budget, the work belongs in Batch or Queueable.",
      "Reviewing AppExchange packages and inherited code. Limit consumption is shared, so their sins are your ceiling.",
    ],
    whenToAvoid: [
      "Don't memorize every number. Know the categories: queries, DML, CPU, heap, callouts. Know where to look them up.",
      "Don't design to 99% of a limit; cascades you don't control (new flows, packages) will consume headroom later.",
    ],
    pitfalls: [
      "Testing with 1 record and shipping. Limits bite at volume. Always test with 200+.",
      "Forgetting the cascade: your code may be fine alone, but the flow an admin added last month shares the same transaction budget.",
      "CPU timeouts from inefficient loops or heavy string/JSON work. These are often the hardest limit to debug because nothing 'looks' wrong.",
      "Catching generic exceptions and assuming you caught limit exceptions. You can't catch them. You can only design to avoid them.",
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
        title: "Governor limits explained simply",
        url: "https://www.salesforceben.com/salesforce-governor-limits/",
        source: "Salesforce Ben",
        level: "intro",
      },
      {
        title: "Working with limits at scale",
        url: "https://architect.salesforce.com/",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
  {
    slug: "apex-testing",
    title: "Apex Testing",
    category: "code",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Salesforce won't let untested code into production: 75% coverage is the gate, but good tests are the actual goal.",
    mentalModel: [
      "Every production deployment runs your Apex tests, and at least 75% of your code lines must be exercised. That is a platform rule, not a team convention. Tests are Apex methods marked @isTest that create data, run your code, and assert outcomes. Tests see no org data by default, and they shouldn't. @isTest(SeeAllData=true) is a legacy trap, so each test builds the world it needs.",
      "The mindset that separates useful suites from coverage theater is that coverage is a side effect and assertions are the product. A test that calls your method and asserts nothing passes the gate and catches nothing. Test the behavior. Given these inputs, these records end up in this state. Cover bulk tests of 200 records, negative paths, and different user permissions via System.runAs.",
    ],
    whenToUse: [
      "Always. It is mandatory for deployment. The real choice is between minimum-viable coverage and tests that protect you during refactors.",
      "Test.startTest()/stopTest() to reset limits mid-test and force async jobs to execute.",
      "A TestDataFactory class so record creation is consistent and schema changes only break one place.",
    ],
    whenToAvoid: [
      "SeeAllData=true. Tests that depend on org data break unpredictably and can't run in fresh orgs.",
      "Testing the platform itself, such as asserting that a standard field update works. Spend assertions on your logic.",
    ],
    pitfalls: [
      "Coverage without assertions: green checkmarks, zero protection. Code review should reject assertion-free tests.",
      "Tests that pass in sandbox but fail in production due to validation rules, required fields, or duplicate rules that differ. Keep environments aligned.",
      "Forgetting bulk tests: single-record tests won't catch the query-in-loop that dies at 200.",
      "Not testing as a restricted user. Code that works as admin may crash for real profiles on field-level security.",
    ],
    related: ["apex", "governor-limits", "deployments", "apex-triggers"],
    resources: [
      {
        title: "Apex Testing (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_testing",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Testing Apex, Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Test data factories and patterns",
        url: "https://www.apexhours.com/apex-test-class-best-practices/",
        source: "Apex Hours",
        level: "practical",
      },
    ],
  },
];
