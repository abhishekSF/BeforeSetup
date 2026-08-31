import type { Topic } from "../types";

export const automationTopics: Topic[] = [
  {
    slug: "validation-rules",
    title: "Validation Rules",
    category: "automation",
    tagline:
      "Formulas that block bad data at save time — the guardrails everything else (loads, integrations, agents) must pass through.",
    mentalModel: [
      "A validation rule is a formula evaluated at save: if it returns true, the save is rejected with your error message. The counterintuitive part is the direction — you write the condition for bad data, not good. 'Block saves where Close Date is in the past' means the formula is CloseDate < TODAY(), returning true when the data is wrong.",
      "Their power comes from where they sit: the record layer, beneath every entry path. UI edits, Data Loader jobs, API integrations, flows, and Agentforce actions all pass through the same rules. That's the appeal (one rule guards every door) and the operational reality (a rule added for the UI will bounce tonight's integration batch too).",
    ],
    whenToUse: [
      "Data integrity that must hold everywhere: conditionally required fields, format checks, cross-field logic like 'discount over 30% requires a reason'.",
      "Stage-gating: fields that become required or locked as a record advances through its process.",
      "As executable documentation of business policy — a well-named rule with a clear error message is the policy.",
    ],
    whenToAvoid: [
      "Warnings and nudges — validation is binary block-or-allow; soft guidance belongs in screen flows or prompts.",
      "Complex multi-record checks ('no overlapping bookings') — formulas can't query siblings; that's a trigger or flow with a query.",
      "Restating what field-level requiredness or the schema already enforces.",
    ],
    pitfalls: [
      "Integration lockout: new rules bounce records from existing loads and integrations that never had to satisfy them. Every rule needs a bypass strategy (a permission-based check like NOT($Permission.Bypass_Validation)) from day one.",
      "Vague error messages ('Invalid data') on rules with no description — six months later nobody knows what it enforces or why.",
      "Formula false-positives around blank handling: ISBLANK, picklist ISPICKVAL, and cross-object references behave differently than you'd guess, and a rule that errors on records the user didn't even touch breeds workarounds.",
      "Rule pileup: dozens of overlapping rules accumulated over years, some contradictory, none owned — audit and prune like any other code.",
    ],
    related: ["objects-and-fields", "flow", "data-loading", "profiles-permission-sets"],
    resources: [
      {
        title: "Validation Rules (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.fields_about_field_validation.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Formulas & Validations (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Validation rule examples library",
        url: "https://help.salesforce.com/s/articleView?id=platform.fields_useful_field_validation_formulas.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
    ],
  },
  {
    slug: "flow",
    title: "Flow Builder",
    category: "automation",
    tagline:
      "Salesforce's declarative automation engine — the default answer for 'when X happens, do Y' without code.",
    mentalModel: [
      "Flow is a visual programming environment: you drag elements (Get Records, Update Records, Decisions, Loops) onto a canvas and Salesforce executes them. Since Workflow Rules and Process Builder were retired, Flow is the declarative automation tool.",
      "The key taxonomy: record-triggered flows run when records are created/updated/deleted (your bread and butter), screen flows are guided wizards for users, scheduled flows run on a timer, and autolaunched flows are callable subroutines. Within record-triggered flows, the before-save/after-save split matters most: before-save flows can update the triggering record fast with no extra save; after-save flows can touch other records and call external systems.",
      "Think of each flow as a small program with a real execution cost. It shares the same transaction, limits, and order-of-execution as Apex — 'declarative' doesn't mean 'free'.",
    ],
    whenToUse: [
      "Field updates on the same record → before-save record-triggered flow (fastest option).",
      "Cross-object updates, notifications, follow-up records → after-save flow.",
      "Guided user experiences (intake forms, call scripts, wizards) → screen flows.",
      "Nightly/weekly batch-style logic on modest volumes → scheduled flows.",
    ],
    whenToAvoid: [
      "Complex logic with many branches, loops over large collections, or sophisticated error handling — Apex is more testable and often faster.",
      "Very high-volume operations (mass updates of 100k+ records) — use Batch Apex.",
      "Logic that needs guaranteed ordering across many flows on the same object — consolidate; execution order between flows is manageable but fragile.",
    ],
    pitfalls: [
      "Flow proliferation: ten record-triggered flows on one object with no naming convention becomes unmaintainable fast. Convention: few flows per object, clear entry criteria, subflows for shared logic.",
      "DML or Get Records inside loops — the classic limit-killer. Collect in the loop, act after it.",
      "No fault paths: an unhandled flow error emails an admin and rolls back the user's save. Add fault connectors on callouts and risky DML.",
      "Forgetting flows fire during data loads — a 200k-record load can trigger 200k flow runs; know your entry criteria and bypass strategies.",
      "Testing only the happy path in production mindsets — use debug runs and sandbox tests with bulk data.",
    ],
    related: ["apex-triggers", "approvals", "async-apex", "governor-limits"],
    resources: [
      {
        title: "Build Flows with Flow Builder (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/trails/build-flows-with-flow-builder",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Flow Builder documentation",
        url: "https://help.salesforce.com/s/articleView?id=platform.flow.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Record-Triggered Flows guide",
        url: "https://architect.salesforce.com/decision-guides/trigger-automation",
        source: "Salesforce Architects",
        level: "deep",
      },
      {
        title: "UnofficialSF — advanced Flow components & patterns",
        url: "https://unofficialsf.com/",
        source: "Community",
        level: "deep",
      },
    ],
  },
  {
    slug: "apex-triggers",
    title: "Apex Triggers",
    category: "automation",
    tagline:
      "Code that runs automatically when records change — maximum power, maximum responsibility.",
    mentalModel: [
      "A trigger is Apex code attached to an object's save events (before insert, after update, etc.). When any process — UI, API, data load, flow — saves records, the trigger fires. Triggers always receive records in bulk (up to 200 at a time), so trigger code is inherently batch code: you write logic for a list, never a single record.",
      "The community-standard architecture is 'one trigger per object, logic in a handler class'. The trigger itself is a thin router; the handler class holds testable methods. This exists because trigger order within an object is not guaranteed and scattered logic becomes undebuggable.",
      "Before-triggers can modify the triggering records without extra DML (fast, cheap). After-triggers see final field values (including IDs on insert) and are where you touch other records or enqueue async work.",
    ],
    whenToUse: [
      "Logic too complex, too performance-sensitive, or too algorithmic for Flow.",
      "You need guaranteed, testable, code-reviewed behavior on data changes.",
      "Integrations that must react to data changes with sophisticated payloads or error handling.",
    ],
    whenToAvoid: [
      "Simple field defaulting or validation — use before-save flows or validation rules.",
      "When the team has no Apex capacity to maintain it — an unowned trigger is a liability.",
      "Calling external services synchronously — you can't do callouts in triggers directly; enqueue async work instead.",
    ],
    pitfalls: [
      "Non-bulkified code: a SOQL query or DML statement inside a loop works in testing with 1 record and explodes at 200. This is the number-one Apex bug.",
      "Recursion: trigger updates a record, which fires the trigger again. Use static guards or a framework with recursion control.",
      "Mixing declarative and code automation on the same object without a map — order of execution surprises (flow overwrites trigger's value) generate mystery bugs.",
      "Doing everything in triggers when the platform offers better homes: rollups (roll-up fields), notifications (flows), heavy work (async).",
    ],
    related: ["apex", "flow", "governor-limits", "async-apex", "apex-testing"],
    resources: [
      {
        title: "Apex Triggers (Trailhead module)",
        url: "https://trailhead.salesforce.com/content/learn/modules/apex_triggers",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Triggers — Apex Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Trigger frameworks and why you need one",
        url: "https://architect.salesforce.com/decision-guides/trigger-automation",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
  {
    slug: "approvals",
    title: "Approval Processes",
    category: "automation",
    tagline:
      "Structured sign-off chains — who must approve what, in which order, and what happens at each step.",
    mentalModel: [
      "An approval process is a state machine for sign-offs: a record enters (manually or via automation), moves through one or more approval steps (each with an assigned approver — a user, queue, or manager-hierarchy lookup), and ends approved or rejected. At each transition you can lock the record, update fields, send emails, and fire follow-up actions.",
      "The mental model that helps: approvals are about accountability, not just automation. The audit trail — who approved, when, with what comment — is often the whole point for finance and compliance teams. If nobody needs the trail, you may not need the machinery.",
    ],
    whenToUse: [
      "Discounts, contracts, expenses, time off — anything with a real 'requires manager/legal/finance sign-off' rule.",
      "Multi-step chains with different approvers by amount, region, or record type.",
      "You need records locked while under review.",
    ],
    whenToAvoid: [
      "A simple 'notify someone when X happens' — that's a flow with an email or notification, not an approval.",
      "Approvals of things that aren't records (documents living outside Salesforce) — integrate or use the right tool.",
      "Highly dynamic routing logic that changes weekly — consider Flow-driven approvals (Flow Orchestration) for complex cases.",
    ],
    pitfalls: [
      "Hard-coded approvers: processes assigned to named users break when people leave. Use queues, manager fields, or role-based lookups.",
      "No recall/reassign story: approvals stuck with someone on vacation need delegated approvers or admin intervention paths planned upfront.",
      "Record locking surprises: locked records block integrations and other automation mid-approval; plan which fields (if any) stay editable.",
      "Entry criteria drift: automation submits records that no longer match any step's criteria, leaving them stuck in limbo.",
    ],
    related: ["flow", "record-types", "profiles-permission-sets"],
    resources: [
      {
        title: "Approve Records with Approval Processes (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/business_process_automation/approvals",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Approval process setup (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.what_are_approvals.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Flow Orchestration — modern multi-user processes",
        url: "https://help.salesforce.com/s/articleView?id=platform.orchestrator_overview.htm&type=5",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "async-apex",
    title: "Asynchronous Apex",
    category: "automation",
    tagline:
      "Queueable, Batch, Scheduled, and Future — how work escapes the current transaction and its limits.",
    mentalModel: [
      "Synchronous Apex runs inside the user's save and shares its strict limits. Asynchronous Apex says 'do this later, in its own transaction, with bigger limits'. Four flavors: Queueable (the modern default — chainable jobs with state), Batch (process millions of records in chunks of up to 200), Scheduled (run at a time, like cron), and @future (legacy fire-and-forget; prefer Queueable).",
      "The essential insight: async is not just about performance, it's about transaction boundaries. Callouts to external systems aren't allowed mid-trigger — you enqueue a Queueable that does the callout afterward. A batch job failing on chunk 30 doesn't roll back chunks 1–29. Async means eventual, not immediate — design the UX and error handling for that.",
    ],
    whenToUse: [
      "Callouts triggered by record changes → Queueable from the trigger.",
      "Processing large data volumes (recalculations, cleanups, nightly syncs) → Batch Apex.",
      "Recurring jobs → Scheduled Apex kicking off Queueables or Batches.",
      "Anything that would blow synchronous limits or slow the user's save.",
    ],
    whenToAvoid: [
      "When the user needs the result immediately in the same interaction — async has no guaranteed start time.",
      "Tiny operations that fit comfortably in the transaction — async adds latency, complexity, and monitoring burden.",
      "Uncontrolled chaining/fan-out — a trigger enqueuing jobs that enqueue more jobs can melt the queue.",
    ],
    pitfalls: [
      "Assuming order and timing: two Queueables enqueued together may run in any order, minutes apart. Design for idempotency.",
      "Flex queue exhaustion: only 100 batch jobs can be queued; noisy schedulers starve important jobs.",
      "Error invisibility: failed async jobs don't interrupt any user. Monitor AsyncApexJob and build alerting, or failures rot silently.",
      "Batch scope-size myths: bigger scope isn't always faster — tune per limits profile of the work.",
      "@future's flat parameters (no sObjects) push people into brittle ID-list reloading patterns; Queueable fixes this — use it.",
    ],
    related: ["apex", "governor-limits", "apex-triggers", "platform-events", "rest-apis"],
    resources: [
      {
        title: "Asynchronous Apex (Trailhead module)",
        url: "https://trailhead.salesforce.com/content/learn/modules/asynchronous_apex",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Asynchronous Apex — Developer Guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_async_overview.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Batchable vs Queueable deep dive",
        url: "https://www.apexhours.com/asynchronous-apex/",
        source: "Apex Hours",
        level: "deep",
      },
    ],
  },
];
