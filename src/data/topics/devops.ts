import type { Topic } from "../types";

export const devopsTopics: Topic[] = [
  {
    slug: "custom-metadata",
    title: "Custom Metadata Types & Custom Settings",
    category: "devops",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Configuration as deployable records — the end of hardcoded values and org-specific magic numbers.",
    mentalModel: [
      "Some 'data' is really configuration: threshold amounts, endpoint mappings, feature switches, country-to-region tables. Put those in regular custom objects and every sandbox refresh or deployment loses them. Custom Metadata Types (CMDT) solve this by making the records themselves metadata — they deploy alongside your code, survive refreshes, and can be packaged. Your Apex and flows read them like data; your pipeline treats them like code.",
      "Custom Settings are the older sibling with one still-unique trick: hierarchy settings resolve per user or profile ('this integration is off for this profile, on for everyone else'), which makes them the standard bypass switch for automation during data loads. Rule of thumb: CMDT for configuration that should travel with deployments; hierarchy custom settings for runtime toggles that vary by who's running.",
    ],
    whenToUse: [
      "Any value you'd otherwise hardcode in Apex or a flow: thresholds, mappings, retry counts, endpoint names.",
      "Trigger and validation bypass flags (hierarchy custom setting checked by your automation) so loads and hotfixes don't require deactivating things in production.",
      "App configuration in managed packages — CMDT is how AppExchange apps ship editable defaults.",
    ],
    whenToAvoid: [
      "Business data in disguise: if end users create and edit the records as part of daily work, it's data — use a custom object.",
      "Secrets: CMDT is not encrypted storage. Credentials belong in Named Credentials, never in config records.",
    ],
    pitfalls: [
      "CMDT records can't be created with regular DML in Apex (they deploy, or go through the special metadata API path) — a design surprise if you expected runtime writes.",
      "Nobody documents which switch does what: a bypass setting created for one migration, still off for one profile three years later, is a classic mystery-behavior source.",
      "List custom settings don't deploy their records (unlike CMDT) — teams still get burned recreating them per environment; prefer CMDT when portability matters.",
      "Overusing toggles until your org has a shadow feature-flag system with no owner — inventory and prune.",
    ],
    related: ["deployments", "apex", "flow", "sandboxes"],
    resources: [
      {
        title: "Custom Metadata Types (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/custom_metadata_types_dec",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Custom Metadata Types (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.custommetadatatypes_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "CMDT vs Custom Settings, compared",
        url: "https://www.apexhours.com/custom-metadata-types-in-salesforce/",
        source: "Apex Hours",
        level: "practical",
      },
    ],
  },
  {
    slug: "sandboxes",
    title: "Sandboxes & Environments",
    category: "devops",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "edition-gated",
    editionNote: "Sandbox counts and types vary by edition; Full Copy is not in every contract.",
    tagline:
      "Copies of your org for building and testing — the environment strategy that keeps production safe.",
    mentalModel: [
      "A sandbox is a copy of your production org's configuration (and sometimes data) where you build and test without risk. They come in sizes: Developer (config only, small data allowance), Developer Pro (more storage), Partial Copy (config plus a sample of data), and Full Copy (everything, refreshed rarely because it's expensive and slow). Scratch orgs are the different beast — blank, short-lived orgs created from a config file in seconds, designed for source-driven development.",
      "The standard pipeline shape: developers build in Developer sandboxes or scratch orgs, changes merge and get tested in an integration sandbox, UAT happens in a Partial or Full sandbox with realistic data, then production. The key mental model is that changes flow one direction (toward production) and refreshes flow the other (production config copied back down). An org without an environment strategy is an org where someone is editing production directly.",
    ],
    whenToUse: [
      "Always — even a solo admin should build in a sandbox and deploy, because some mistakes (deleting a field with data) have no undo.",
      "Full Copy for realistic performance/UAT testing before major releases.",
      "Scratch orgs when you're doing source-driven development with version control as the source of truth.",
    ],
    whenToAvoid: [
      "Don't test integrations against Full Copy sandboxes with live external endpoints — refreshed sandboxes contain real customer data and real endpoint configs; scrub and re-point after refresh.",
      "Don't let long-lived sandboxes drift for months without refresh — testing against stale config gives false confidence.",
    ],
    pitfalls: [
      "Sandbox refresh overwrites everything in it — in-flight work must be in version control or it dies with the refresh.",
      "Email deliverability defaults protect you (sandboxes don't send real email by default) — but automation, scheduled jobs, and integrations may still fire; deactivate on refresh.",
      "Real data in Partial/Full copies is a compliance surface: mask sensitive data, restrict sandbox access.",
      "Metadata that doesn't refresh cleanly (certain connected app secrets, named credential passwords) needs a documented post-refresh checklist.",
    ],
    related: ["deployments", "sfdx-cli", "apex-testing"],
    resources: [
      {
        title: "Sandboxes overview (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.deploy_sandboxes_parent.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Application Lifecycle Management (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/application-lifecycle-and-development-models",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Sandbox strategy guide",
        url: "https://www.salesforceben.com/salesforce-sandboxes/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "sfdx-cli",
    title: "Salesforce CLI & Source-Driven Development",
    category: "devops",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "The command line for Salesforce — pull metadata into files, put it in git, and treat your org like a codebase.",
    mentalModel: [
      "The Salesforce CLI (the sf command) turns org configuration into files on disk. Every object, field, flow, class, layout, and permission set is metadata that can be retrieved, versioned in git, and deployed. That flips the traditional model: instead of the org being the source of truth and changes living only inside it, the repository becomes the source of truth and orgs become deployment targets.",
      "The daily loop for a developer: sf project retrieve to pull changes made in a sandbox into your local project, git commit, sf project deploy to push to the next environment, sf apex run test to run tests. Scratch orgs complete the picture — spin up a blank org from a definition file, push your source, work, and throw it away. Even admins benefit without touching the terminal: when everything is in git, every change has an author, a date, and a diff.",
    ],
    whenToUse: [
      "Any org with more than one person making changes — version control is the only real answer to 'what changed and who changed it?'",
      "CI/CD: the CLI is what your pipeline runs to validate and deploy on every merge.",
      "Bulk metadata surgery: rename across dozens of files with an editor instead of clicking through Setup.",
    ],
    whenToAvoid: [
      "Don't force scratch-org-everything on a team that isn't ready — sandbox-plus-git is a perfectly good intermediate step.",
      "Don't script destructive operations casually — deleting metadata via the CLI is fast and equally fast at ruining an afternoon.",
    ],
    pitfalls: [
      "Metadata coverage gaps: a few configuration types still don't retrieve/deploy cleanly and need manual steps — keep a 'manual steps' doc per release.",
      "Profiles in source control are notoriously noisy diffs — prefer permission sets, which version much more cleanly.",
      "The old sfdx command set is deprecated in favor of sf — new tutorials mix both; standardize your team on sf.",
      "Pulling changes without a clean git state makes it impossible to tell what the retrieve actually changed.",
    ],
    related: ["deployments", "sandboxes", "apex-testing"],
    resources: [
      {
        title: "Salesforce CLI",
        url: "https://developer.salesforce.com/tools/salesforcecli",
        source: "Salesforce Docs",
        level: "intro",
      },
      {
        title: "Set up your workspace (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/projects/set-up-your-lightning-web-components-developer-tools",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Salesforce CLI Command Reference",
        url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_unified.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
  {
    slug: "deployments",
    title: "Deployments & Release Management",
    category: "devops",
    updatedOn: "2026-08-31",
    lifecycle: "ga",
    packaging: "core",
    tagline:
      "Moving changes safely to production — change sets, CLI pipelines, or DevOps Center, plus the discipline around them.",
    mentalModel: [
      "A deployment moves metadata from one org to another. The tools form a maturity ladder. Change sets: click-to-select changes in a sandbox, upload to production — simple, but manual, unversioned, and easy to under-scope. DevOps Center: Salesforce's free git-backed release tool — work items, review, and promotion between environments with version control underneath, designed so admins and developers share one pipeline. Full CI/CD: the CLI in GitHub Actions (or similar), validating every pull request against a sandbox and deploying on merge.",
      "Whatever the tool, production deployments run your Apex tests and enforce 75% coverage — that's the platform's gate. The discipline that matters more than tooling: production is read-only for humans, everything moves through the pipeline, and every release has a rollback plan (which, since Salesforce has no native rollback, means knowing how to deploy the previous state).",
    ],
    whenToUse: [
      "DevOps Center as the default for most teams — free, git-backed, and a huge upgrade from change sets without needing a DevOps engineer.",
      "Full CLI-based CI/CD when you have multiple developers, real branching, and want validation on every PR.",
      "Validation-only deploys (check without committing) before big releases — catch test failures without a deployment window.",
    ],
    whenToAvoid: [
      "Editing production directly 'just this once' — config drift between production and sandboxes is how deployments start failing mysteriously.",
      "Massive quarterly releases — the bigger the batch, the harder the debugging; smaller, more frequent releases fail smaller.",
    ],
    pitfalls: [
      "Change sets don't include everything (and forget dependencies) — the classic Friday deploy failure is a missing field or permission the change set didn't know about.",
      "Metadata that deploys but needs post-deploy steps (activating flows used to be one; scheduled jobs, named credential secrets still are) — keep a runbook.",
      "Test failures in production that passed in sandbox usually mean environment drift — fix the drift, not just the test.",
      "No rollback plan: know exactly how you'd redeploy yesterday's state before you deploy today's.",
    ],
    related: ["sandboxes", "sfdx-cli", "apex-testing", "flow"],
    resources: [
      {
        title: "DevOps Center (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.devops_center_overview.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "DevOps Center guide and setup",
        url: "https://www.salesforceben.com/salesforce-devops-center/",
        source: "Salesforce Ben",
        level: "practical",
      },
      {
        title: "CI/CD on Salesforce with GitHub Actions",
        url: "https://developer.salesforce.com/blogs/2022/01/auto-deploy-salesforce-code-with-github-actions",
        source: "Salesforce Developers Blog",
        level: "deep",
      },
    ],
  },
];
