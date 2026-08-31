import type { Topic } from "../types";

export const automationTopics: Topic[] = [
  {
    slug: "validation-rules",
    title: "Validation Rules",
    category: "automation",
    tagline:
      "Formulas that block bad data at save time — the cheapest data quality tool on the platform, and the easiest to overdo.",
    mentalModel: [
      "A validation rule is a formula that evaluates on save: if it returns true, the save is blocked and the user sees your error message. That's the whole mechanism — 'Close Date can't be in the past', 'Amount is required once Stage is Negotiation', 'Discount above 30% needs a reason'. They run on every save from every source: UI, API, data loads, flows, and Apex all hit the same wall, which is exactly what makes them trustworthy as a data-quality floor.",
      "The design skill is deciding what belongs in a validation rule versus elsewhere. Rules can only block and message — they can't fix, default, or transform (that's Flow or triggers). And because they fire on every save path, a rule written with only the UI in mind ('the user should just fill this in!') becomes a landmine for integrations and migrations that legitimately save records in intermediate states.",
    ],
    whenToUse: [
      "Guarding fields that drive process: stage-gating requirements, conditional required fields, format checks on critical identifiers.",
      "Enforcing rules that must hold no matter who or what saves the record — human, flow, or integration.",
      "Cheap wins first: a one-line formula beats a flow with a fault path for simple 'don't allow this' cases.",
    ],
    whenToAvoid: [
      "When the fix is knowable — if you can compute the right value, default it with a before-save flow instead of bouncing the user.",
      "Cross-record validation at scale (checking siblings or children) — formula rules can't query; that's trigger territory, with limits in mind.",
    ],
    pitfalls: [
      "Breaking data loads and integrations: every migration plan needs a validation-rule review, and every rule needs a considered bypass strategy (a permission-based bypass check beats deactivating rules in production).",
      "Vague error messages ('Invalid data!') that generate tickets instead of preventing them — say what's wrong and how to fix it, and place the error on the field.",
      "Rule pileups: twenty rules added over five years, each one someone's urgent fix, now blocking saves in combinations nobody understands. Audit and document.",
      "Forgetting ISCHANGED/ISNEW guards, so rules re-block edits to old records that predate the rule.",
    ],
    related: ["objects-and-fields", "flow", "data-loading", "apex-triggers"],
    resources: [
      {
        title: "Formulas & Validations (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/point_click_business_logic",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Validation rules (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.fields_about_field_validation.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Validation rule examples and patterns",
        url: "https://www.salesforceben.com/salesforce-validation-rules/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "flow",
    title: "Flow",
    category: "automation",
    tagline:
      "Salesforce's declarative automation engine — the default answer to 'make something happen automatically' without code.",
    mentalModel: [
      "Flow is a visual programming language. You drag elements onto a canvas — get records, update records, decisions (if/else), loops, screens for user input — and Salesforce runs them. A record-triggered flow fires when a record is created, updated, or deleted; a screen flow walks a user through a guided form; a scheduled flow runs on a timer; an autolaunched flow is a subroutine other automation can call.",
      "Since Workflow Rules and Process Builder were retired, Flow is the declarative automation tool. The most important design concept is before-save vs after-save record-triggered flows: before-save flows can update the triggering record with no extra database work (fast, use for same-record field updates), while after-save flows can touch other records, send emails, and call external systems (heavier, use for everything else).",
    ],
    whenToUse: [
      "Field updates, record creation, notifications, and approvals driven by record changes — the bread and butter of org automation.",
      "Guided user experiences (screen flows) like intake wizards, call scripts, or multi-step data entry.",
      "Scheduled batch-like jobs at moderate scale (nightly status rollovers, reminder emails).",
    ],
    whenToAvoid: [
      "Complex logic with heavy branching, recursion, or intricate data structures — Apex is easier to test, review, and debug past a certain complexity.",
      "Very high-volume operations (hundreds of thousands of records in one transaction window) — Batch Apex handles volume and retries better.",
      "Logic that must be unit tested with rigor (revenue calculations, compliance rules) — Flow tests exist but Apex testing is far more mature.",
    ],
    pitfalls: [
      "One object, many flows: multiple record-triggered flows on the same object with no agreed order become unpredictable. Pick an architecture (one flow per object per timing, or trigger orchestration) early.",
      "Loops that do DML or queries inside the loop body hit governor limits at scale — collect records in the loop, then do one update after.",
      "Flows run in the automation cascade: your flow updates a record, which fires another flow, which fires a trigger. Recursion and cascades are the top source of 'mystery' behavior.",
      "Faults are silent by default for users — always add fault paths on DML and callout elements, or failures vanish into admin emails.",
    ],
    related: ["apex-triggers", "async-apex", "apex", "record-types", "approvals"],
    resources: [
      {
        title: "Flow Builder Basics (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/flow-basics",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Record-Triggered Automation Decision Guide",
        url: "https://architect.salesforce.com/decision-guides/trigger-automation",
        source: "Salesforce Architects",
        level: "practical",
      },
      {
        title: "UnofficialSF — the Flow community hub",
        url: "https://unofficialsf.com/",
        source: "UnofficialSF",
        level: "practical",
      },
      {
        title: "Flow best practices (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.flow_prep_bestpractices.htm&type=5",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "apex-triggers",
    title: "Apex Triggers",
    category: "automation",
    tagline:
      "Code that runs automatically when records change — maximum power, and maximum responsibility for order and bulk safety.",
    mentalModel: [
      "A trigger is Apex code attached to an object that runs when records are inserted, updated, deleted, or undeleted — before or after the database write. Before triggers can modify the incoming records for free; after triggers see final values (including IDs on insert) and handle side effects on other records.",
      "The golden rule: triggers receive records in batches, up to 200 at a time. Trigger.new is always a list. Every trigger must be written 'bulkified' — no queries or DML inside loops — because a data load will hand it 200 records at once. The standard architecture is one trigger per object that delegates to a handler class, keeping logic testable and ordering explicit.",
    ],
    whenToUse: [
      "Logic too complex, too performance-sensitive, or too test-critical for Flow.",
      "Operations needing before-save modification of many fields with computed values, or cross-object logic with sophisticated queries.",
      "When you need deterministic ordering of many automation steps on one object — a handler class gives you an explicit sequence.",
    ],
    whenToAvoid: [
      "Simple field defaults, notifications, or record creation an admin could own in Flow — code you write is code your team maintains forever.",
      "Callouts to external systems — triggers can't make synchronous callouts; you'd need async (Queueable) anyway, so consider Platform Events or Flow.",
    ],
    pitfalls: [
      "SOQL or DML inside a for-loop is the classic governor-limit bomb. It works in testing with 1 record and dies on the first data load of 200.",
      "Recursion: your trigger updates a record, which fires the trigger again. Guard with static variables or clean architecture, not luck.",
      "Multiple triggers on one object have no guaranteed order — consolidate to one trigger per object.",
      "Logic in the trigger body itself (instead of a handler class) can't be reused or unit tested cleanly.",
    ],
    related: ["apex", "flow", "governor-limits", "async-apex", "apex-testing"],
    resources: [
      {
        title: "Apex Triggers (Trailhead)",
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
        title: "Trigger frameworks and handler patterns",
        url: "https://www.apexhours.com/trigger-framework-in-salesforce/",
        source: "Apex Hours",
        level: "deep",
      },
      {
        title: "Record-Triggered Automation Decision Guide",
        url: "https://architect.salesforce.com/decision-guides/trigger-automation",
        source: "Salesforce Architects",
        level: "practical",
      },
    ],
  },
  {
    slug: "approvals",
    title: "Approval Processes",
    category: "automation",
    tagline:
      "Structured sign-off chains — who must approve a record, in what order, and what happens at each step.",
    mentalModel: [
      "An approval process is a state machine for sign-offs. A record is submitted (manually or by automation), Salesforce locks it, routes it to one or more approvers in sequence or parallel, and runs actions at each stage — on submit, approve, reject, or recall. Think discount approvals, PTO requests, contract sign-offs.",
      "The key mental shift: approval is a process attached to the record, not a field. The record lock during approval is real — users (and most automation) can't edit a locked record, which protects integrity mid-review but surprises teams that expect to keep working on it. Flow has increasingly absorbed approval use cases via Approval Orchestration, but classic approval processes remain the workhorse.",
    ],
    whenToUse: [
      "Any 'manager must sign off' requirement with an audit trail — discounts, refunds, expense reports, content publishing.",
      "Multi-step chains where the path depends on record values (bigger discount, more approvers).",
      "When you need the built-in approval history related list for compliance.",
    ],
    whenToAvoid: [
      "A single yes/no confirmation with no audit requirement — a checkbox plus validation rule or simple Flow is lighter.",
      "Complex dynamic routing (approver matrices from external data) — classic approvals get awkward; consider Flow Orchestration or an AppExchange tool.",
    ],
    pitfalls: [
      "Record locking blocks integrations and automation that try to update records mid-approval — plan for it.",
      "Approver by role or queue needs care: an empty queue or vacant role silently stalls approvals.",
      "Recall and reject paths are afterthoughts in most builds — decide what should reset (stage, fields, locks) when someone rejects.",
      "Delegated approvers and out-of-office coverage need explicit setup, or approvals pile up in one person's absence.",
    ],
    related: ["flow", "record-types", "sharing-and-visibility"],
    resources: [
      {
        title: "Approval processes (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.what_are_approvals.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Build an Approval Process (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/business_process_automation",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Approval process deep dive",
        url: "https://www.salesforceben.com/salesforce-approval-process/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "async-apex",
    title: "Asynchronous Apex",
    category: "automation",
    tagline:
      "Work that runs later, in its own transaction, with bigger limits — Queueable, Batch, Scheduled, and Future.",
    mentalModel: [
      "Synchronous Apex must finish inside one user transaction with strict limits. Asynchronous Apex says: 'queue this work, run it soon, in a fresh transaction with higher limits.' Four flavors: Queueable (the modern default — one job, can chain to another), Batch Apex (process millions of records in chunks of up to 200), Scheduled Apex (run at a time, like cron), and @future (legacy fire-and-forget; prefer Queueable now).",
      "The mental model is a job queue at the platform level. You don't control exactly when jobs run — the platform schedules them. That buys you scale and isolation, but costs you immediacy and ordering guarantees. Anything that must happen 'right now, before the user sees the page' cannot be async.",
    ],
    whenToUse: [
      "Callouts to external systems triggered by record changes (triggers can't call out synchronously).",
      "Heavy processing on large data volumes — Batch Apex chunks the work under fresh limits per batch.",
      "Nightly/weekly jobs: cleanup, recalculation, sync — Scheduled Apex kicking off a Batch or Queueable.",
      "Decoupling slow work from a user action so the save stays fast.",
    ],
    whenToAvoid: [
      "When the user needs the result immediately in the same interaction.",
      "When simple Flow scheduling covers it — a scheduled flow may beat maintaining code for modest volumes.",
      "Chaining dozens of jobs for orchestration — beyond a few links, consider Platform Events or redesigning.",
    ],
    pitfalls: [
      "Async means eventually: jobs can be delayed under org load. Never assume 'runs within seconds.'",
      "Flex queue and concurrency limits: only so many batch jobs run at once; enqueue storms from triggers can hit the 'too many queueable jobs' limit — guard trigger-enqueued jobs.",
      "Error handling is on you. A failed Queueable without try/catch and logging just disappears. Build a logging object or use Platform Events for failures.",
      "Testing async requires Test.startTest()/stopTest() to force jobs to run inside your test.",
    ],
    related: ["apex", "governor-limits", "apex-triggers", "platform-events", "apex-testing"],
    resources: [
      {
        title: "Asynchronous Apex (Trailhead)",
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
        title: "Queueable vs Batch vs Future explained",
        url: "https://www.apexhours.com/asynchronous-apex/",
        source: "Apex Hours",
        level: "practical",
      },
    ],
  },
];
