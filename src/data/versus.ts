import type { Versus } from "./types";

export const versusPages: Versus[] = [
  {
    slug: "flow-vs-apex-trigger",
    title: "Flow vs Apex trigger vs scheduled & batch",
    question:
      "A record changes and something else needs to happen. Where does the automation live?",
    options: [
      { label: "Before-save flow", topic: "flow" },
      { label: "After-save flow", topic: "flow" },
      { label: "Apex trigger", topic: "apex-triggers" },
      { label: "Scheduled flow", topic: "flow" },
      { label: "Batch Apex", topic: "async-apex" },
    ],
    matrix: [
      {
        criterion: "Update fields on the record being saved",
        pick: "Before-save flow",
        note: "Runs before the write, no extra DML, roughly 10x faster than after-save. This one is not a judgment call.",
      },
      {
        criterion: "Create or update other records when something changes",
        pick: ["After-save flow", "Apex trigger"],
        note: "After-save flow if the logic is simple and admins will own it. Trigger once you need collections, complex branching, or real unit tests.",
      },
      {
        criterion: "Logic needs unit tests, code review, or version control rigor",
        pick: "Apex trigger",
        note: "Flows have no assertable unit tests worth the name. If a bug here costs real money, you want Apex and a test class.",
      },
      {
        criterion: "Guaranteed execution order across many automations on one object",
        pick: "Apex trigger",
        note: "One trigger per object delegating to a handler class is the only place order is fully explicit. Flow trigger ordering exists but is easier to get wrong silently.",
      },
      {
        criterion: "Call an external system when a record changes",
        pick: null,
        note: "Neither, directly — callouts cannot run inside the save transaction. Use an after-save flow's asynchronous path, or a trigger that enqueues a Queueable. For fan-out to multiple systems, consider a platform event instead.",
      },
      {
        criterion: "Run nightly against records matching criteria",
        pick: "Scheduled flow",
        note: "Fine up to modest volumes. Watch the per-run element limits; a scheduled flow iterating 200k records is a governor-limit incident on a timer.",
      },
      {
        criterion: "Process hundreds of thousands to millions of rows",
        pick: "Batch Apex",
        note: "Chunked transactions with restart logic exist precisely for this. Nothing declarative survives at this scale.",
      },
      {
        criterion: "No Apex capacity on the team",
        pick: ["Before-save flow", "After-save flow", "Scheduled flow"],
        note: "Legitimate constraint — but budget for the day the org outgrows it, and keep the flow inventory documented so that migration is possible.",
      },
    ],
    ruleOfThumb: [
      "Same-record field updates: before-save flow, always. This is the one answer with no caveats.",
      "Cross-object and simple: after-save flow. Cross-object and complex, ordered, or money-critical: one trigger per object with a handler class.",
      "Callouts never run in the save. Async path, Queueable, or a platform event — pick one and be consistent.",
      "Above ~100k rows per run, it is Batch Apex. Scheduled flows at that volume fail on a timer.",
      "The real killer is mixing: five flows and two triggers on one object with no documented order. Keep an automation inventory per object.",
    ],
    relatedTopics: [
      "flow",
      "apex-triggers",
      "async-apex",
      "governor-limits",
      "platform-events",
    ],
    updatedOn: "2026-09-01",
  },
  {
    slug: "lookup-vs-master-detail",
    title: "Lookup vs master-detail vs junction",
    question:
      "Two objects need to be related. Is this a loose pointer, an owned child, or a many-to-many?",
    options: [
      { label: "Lookup", topic: "relationships" },
      { label: "Master-detail", topic: "relationships" },
      { label: "Junction object", topic: "relationships" },
    ],
    matrix: [
      {
        criterion: "Child should survive if the parent is deleted",
        pick: "Lookup",
        note: "Lookups are independent records with an optional pointer. Master-detail cascade-deletes the children — that is the feature, not a setting you can later regret your way out of.",
      },
      {
        criterion: "Need a roll-up summary (count, sum, min, max) on the parent",
        pick: "Master-detail",
        note: "Roll-up summaries require master-detail. Lookup roll-ups exist as AppExchange or Flow/Apex workarounds; they are not the same feature and they will surprise you at volume.",
      },
      {
        criterion: "Child should inherit the parent's sharing",
        pick: "Master-detail",
        note: "Detail records have no owner of their own — they ride the master's sharing. If the child needs independent OWD, teams, or queues, it is a lookup.",
      },
      {
        criterion: "Relationship is optional, or the 'parent' might not exist yet",
        pick: "Lookup",
        note: "Master-detail is required. You cannot insert a detail without its master, and you cannot convert a populated lookup into master-detail without first backfilling every row.",
      },
      {
        criterion: "Many-to-many (a Contact on many Campaigns, a Product in many Bundles)",
        pick: "Junction object",
        note: "A custom object with two master-detail fields. The junction is the relationship. Do not fake this with two lookups unless you truly need independent ownership and no roll-ups.",
      },
      {
        criterion: "Reparenting children to a different parent later",
        pick: "Lookup",
        note: "Master-detail reparenting is off by default and, even when enabled, is a sharp edge. Lookups reparent freely.",
      },
      {
        criterion: "Already at two master-detail fields on the child",
        pick: "Lookup",
        note: "Hard platform limit: two master-detail relationships per object. The third 'must-have' is a lookup, or you redesign.",
      },
    ],
    ruleOfThumb: [
      "Default to lookup. Master-detail is the exception you earn: cascade delete, roll-ups, or inherited sharing.",
      "If you need roll-ups *and* independent ownership, you do not get both from the data model. Pick, or compute the roll-up in automation.",
      "Many-to-many is a junction object with two master-details, not two lookups named left and right.",
      "You can convert lookup → master-detail later only if every child already has a parent and you are under the two-MD cap. Design as if you cannot.",
      "Changing this after data exists is a migration, not a Setup checkbox. Get it right on the first object you create.",
    ],
    relatedTopics: [
      "relationships",
      "objects-and-fields",
      "sharing-and-visibility",
      "large-data-volumes",
    ],
    updatedOn: "2026-09-01",
  },
  {
    slug: "profile-vs-permission-set",
    title: "Profile vs permission set vs permission set group",
    question:
      "A user needs access to something. Where does that permission live?",
    options: [
      { label: "Profile", topic: "profiles-permission-sets" },
      { label: "Permission set", topic: "profiles-permission-sets" },
      { label: "Permission set group", topic: "profiles-permission-sets" },
    ],
    matrix: [
      {
        criterion: "Baseline login: hours, IP ranges, default app, which apps they even see",
        pick: "Profile",
        note: "Profiles still own the session-level stuff permission sets cannot. Keep a handful of profiles (Admin, Standard, Integration, maybe Partner) and stop cloning them for every job title.",
      },
      {
        criterion: "Object, field, Apex, or app access for a role or job function",
        pick: "Permission set",
        note: "Additive, many-per-user, version-controllable. This is where new access goes. Salesforce's own direction is 'permission sets first, profiles as a shell'.",
      },
      {
        criterion: "A persona that is a bundle of job functions (AE = Core CRM + CPQ + Forecasts)",
        pick: "Permission set group",
        note: "Compose existing permission sets. Muting permissions let you subtract one dangerous right from the bundle without forking the underlying sets.",
      },
      {
        criterion: "One-off exception for a single person",
        pick: "Permission set",
        note: "A named set beats a cloned profile. Put an expiry date in the name or a custom field so it does not become permanent folklore.",
      },
      {
        criterion: "You are about to clone a profile because two teams are 'almost the same'",
        pick: ["Permission set", "Permission set group"],
        note: "That clone is how orgs get 40 profiles. Shared profile, different permission sets. The almost-the-same gap is exactly what a set is for.",
      },
      {
        criterion: "Page layout assignment by record type",
        pick: "Profile",
        note: "Still a profile (and record type) concern in Lightning. Dynamic Forms and dynamic related lists reduce how much this matters, but they have not fully replaced it.",
      },
    ],
    ruleOfThumb: [
      "Profiles are a shell: login, defaults, a few of them. Everything else is a permission set.",
      "Permission set groups are how you model personas without exploding the set catalog. Muting is how you keep the catalog honest.",
      "If you are cloning a profile, you are doing it wrong. The next clone is a permission set.",
      "View All / Modify All / View All Data on a profile is how audits fail. If someone needs it, put it on a tightly held permission set with a named owner.",
      "Count your profiles. If the number is climbing, the model is already wrong.",
    ],
    relatedTopics: [
      "profiles-permission-sets",
      "sharing-and-visibility",
      "identity-sso",
      "record-types",
    ],
    updatedOn: "2026-09-01",
  },
  {
    slug: "import-wizard-vs-data-loader",
    title: "Import Wizard vs Data Loader vs Bulk API vs integration",
    question:
      "Records need to get into Salesforce. Is this a one-off, a migration, or a pipe that has to keep running?",
    options: [
      { label: "Data Import Wizard", topic: "data-loading" },
      { label: "Data Loader", topic: "data-loading" },
      { label: "Bulk API", topic: "data-loading" },
      { label: "Integration", topic: "integration-patterns" },
    ],
    matrix: [
      {
        criterion: "Under ~50,000 rows, standard objects, a business user doing it once",
        pick: "Data Import Wizard",
        note: "In-browser, duplicate matching, no client install. Stops being the answer the moment you need upsert on custom objects, export, delete, or a repeatable job.",
      },
      {
        criterion: "Tens of thousands to a few million, CSV in hand, admin at the keyboard",
        pick: "Data Loader",
        note: "Insert, update, upsert, export, delete. Works. Map the columns, keep the success/error files, and do not run it against production on a Friday afternoon without a dry run in a Full sandbox.",
      },
      {
        criterion: "Millions of rows, or a load that must not sit on a laptop",
        pick: "Bulk API",
        note: "Async, chunked, parallel or serial. Data Loader can speak Bulk API; so can a proper ETL. Serial mode exists because parallel plus row locks is how 'unable to lock row' weekends start.",
      },
      {
        criterion: "This will happen again tomorrow, from another system of record",
        pick: "Integration",
        note: "A repeating Data Loader job is an integration you have not admitted to yet. Platform events, Bulk API from middleware, or a well-named ETL — pick a pattern and monitor it.",
      },
      {
        criterion: "Need to upsert on an External ID and keep parent-child order",
        pick: ["Data Loader", "Bulk API"],
        note: "Load parents first, then children, with the External ID as the match key. Wizard duplicate rules are not a substitute for an External ID strategy.",
      },
      {
        criterion: "The file is messy, duplicates are likely, and nobody owns a matching rule",
        pick: null,
        note: "Do not load yet. Clean the file, define the match key, agree who wins on conflict. A fast load of dirty data is a slow incident.",
      },
    ],
    ruleOfThumb: [
      "One-off, small, standard objects: Wizard. Anything you might run twice: Data Loader or better.",
      "External IDs are the migration strategy. Without them you cannot upsert, you cannot relink children, and you cannot reload after a mistake.",
      "Turn off, or design for, automation before a bulk load. Before-save flows and triggers will fire. A 200k load that quietly runs 200k automations is how you discover governor limits and duplicate notifications together.",
      "If the source system will keep sending records, this is an integration pattern, not a load. Stop treating the CSV as the interface.",
      "Always keep the error file. The happy-path count is a vanity metric; the error file is the work.",
    ],
    relatedTopics: [
      "data-loading",
      "integration-patterns",
      "rest-apis",
      "governor-limits",
      "large-data-volumes",
    ],
    updatedOn: "2026-09-01",
  },
  {
    slug: "changesets-vs-devops-center",
    title: "Change sets vs DevOps Center vs scratch orgs vs unlocked packages",
    question:
      "Metadata needs to move from one org to another. What is the vehicle?",
    options: [
      { label: "Change sets", topic: "deployments" },
      { label: "DevOps Center", topic: "deployments" },
      { label: "Scratch orgs + CLI", topic: "sfdx-cli" },
      { label: "Unlocked packages", topic: "deployments" },
    ],
    matrix: [
      {
        criterion: "Tiny, one-time change between two long-lived orgs, no git in the picture",
        pick: "Change sets",
        note: "They work. They also cannot delete, cannot be reviewed as a diff, and cannot be reproduced six months later. Fine for a field on a sandbox you are about to refresh. Not a release process.",
      },
      {
        criterion: "Admins who will not live in VS Code, but the team wants git and pull requests",
        pick: "DevOps Center",
        note: "The clicky front-end on source-driven development. Work items, environments, promotions. Still git underneath — that is the point. Treat it as the on-ramp, not as a second source of truth beside change sets.",
      },
      {
        criterion: "Developers building features in isolation, CI on every commit",
        pick: "Scratch orgs + CLI",
        note: "Disposable orgs from a project shape. This is how you stop 'works in my sandbox.' Requires a real source repo, a definition file, and the discipline to throw the org away.",
      },
      {
        criterion: "A coherent set of metadata that should version, install, and upgrade as a unit",
        pick: "Unlocked packages",
        note: "Second-generation packaging without the ISV ceremony of a managed package. Unlocked means the subscriber can still see and edit — right for in-house modularization, wrong if you need IP protection.",
      },
      {
        criterion: "Need to delete metadata, or deploy a destructive change, as part of the release",
        pick: ["Scratch orgs + CLI", "Unlocked packages"],
        note: "Change sets cannot delete. Destructive changes are a manifest in source-driven land. If your process cannot remove a field, it will accumulate fields forever.",
      },
      {
        criterion: "Multiple teams shipping into the same org on different cadences",
        pick: "Unlocked packages",
        note: "This is the modularization case. One repo-monolith of all metadata is how teams block each other. Packages (or at least package directories) let you version and install independently — with the dependency graph as the tax.",
      },
      {
        criterion: "You have no version control today and a release is due this week",
        pick: "Change sets",
        note: "Ship the release. Then start the DevOps Center or CLI conversation before the next one. Do not pretend a change set history is an audit trail.",
      },
    ],
    ruleOfThumb: [
      "Change sets are a trap that looks like a process. Use them only as a stopgap, and write down the date you will stop.",
      "Source of truth is git, not an org. Every other choice (DevOps Center, CLI, packages) is a way to keep that honest.",
      "Scratch orgs are how developers stop contaminating shared sandboxes. If you cannot recreate an org from the repo, you do not have source-driven development yet.",
      "Unlocked packages are for modularizing *your* org, not for pretending you are an ISV. Managed packages (2GP) are the AppExchange / IP-protection answer — different job.",
      "If two tools are both 'the process,' you have no process. Pick one vehicle per pipeline.",
    ],
    relatedTopics: [
      "deployments",
      "sfdx-cli",
      "sandboxes",
      "custom-metadata",
      "appexchange",
    ],
    updatedOn: "2026-09-01",
  },
  {
    slug: "prompt-template-vs-agentforce",
    title: "Prompt template + Flow vs Agentforce",
    question:
      "Something in the org should use a large language model. Is this a prompt on a deterministic path, or an agent that gets to choose?",
    options: [
      { label: "Prompt template in Flow", topic: "flow" },
      { label: "Agentforce topic & action", topic: "agentforce" },
    ],
    matrix: [
      {
        criterion: "Same inputs should produce the same kind of output, every time (summarize this case, draft this email)",
        pick: "Prompt template in Flow",
        note: "A prompt template is a function: grounded context in, text out, Flow decides when it runs. No planner, no tool-picking, predictable cost. This is most of what people mean when they say they 'want AI in the org.'",
      },
      {
        criterion: "The system must choose what to do next across several possible tools (look up, update, ask, escalate)",
        pick: "Agentforce topic & action",
        note: "That is an agent: a topic to scope the job, actions it is allowed to take, grounding from Data 360 or your org. You are paying for reasoning, not for a paragraph.",
      },
      {
        criterion: "A record change should always do the same field update or create the same task",
        pick: "Prompt template in Flow",
        note: "Do not put an agent on a path a before-save flow already owns. If there is no language to generate and no decision to make, there is no LLM in this design.",
      },
      {
        criterion: "A human will read and edit the result before anything is saved",
        pick: "Prompt template in Flow",
        note: "Draft-then-review is the honest pattern for customer-facing text. Agents that write straight to the record are how you get confident nonsense in the activity timeline.",
      },
      {
        criterion: "The question spans unsynced data across clouds, and retrieval quality is the product",
        pick: "Agentforce topic & action",
        note: "This only works if Data 360 (or equivalent grounding) is actually in the org. An agent with no retrieval is a chatbot with your UI chrome. Check the SKU before you demo it.",
      },
      {
        criterion: "You cannot yet write the success criteria or the forbidden actions in a sentence",
        pick: null,
        note: "You are not ready for either. Agents amplify vague process. Write the topic, the actions, and what 'done' looks like on paper before you click Enable.",
      },
    ],
    ruleOfThumb: [
      "If you can flowchart it, it is a Flow — with a prompt template only where language is the output. If you cannot flowchart it because the next step depends on the answer, it might be an agent.",
      "Prompt templates are cheap, testable, and boring. Start there. Agents are a product decision, not a checkbox.",
      "An agent with no grounded data and no tightly scoped actions is a hallucination with a logo. Data 360 is not optional for the interesting cases, and it is not in the edition by default.",
      "Never let an agent do what a validation rule, a before-save flow, or a permission already does. Deterministic first; language second; planning last.",
      "Consumption pricing means a looping agent is a billing incident. Cap turns, log actions, and keep a human in the loop for anything that writes.",
    ],
    relatedTopics: ["agentforce", "flow", "data-360", "headless-360", "claudeforce"],
    updatedOn: "2026-09-01",
  },
];

export const versusBySlug = new Map(versusPages.map((v) => [v.slug, v]));

export function versusForTopic(slug: string): Versus[] {
  return versusPages.filter(
    (v) =>
      v.relatedTopics.includes(slug) || v.options.some((o) => o.topic === slug)
  );
}
