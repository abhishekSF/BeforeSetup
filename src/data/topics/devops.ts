import type { Topic } from "../types";

export const devopsTopics: Topic[] = [
  {
    slug: "custom-metadata",
    title: "Custom Metadata Types & Custom Settings",
    category: "devops",
    tagline:
      "Configuration that deploys like code — the difference between an org you can promote cleanly and one full of hand-edited magic values.",
    mentalModel: [
      "Some 'data' isn't business data at all — it's configuration: API endpoints per environment, threshold values, feature toggles, country-to-region mappings. Custom Metadata Types (CMDT) store exactly this: they look like objects with records, but the records are metadata — they deploy through your pipeline, version in git, and survive sandbox refreshes. That single property is the whole point.",
      "Custom Settings are the older cousin with one still-unique trick: hierarchy settings can vary by user or profile ('debug mode on for this user only'), and List Custom Settings remain writable-at-runtime storage. The decision rule: config that developers/admins author and deploy → CMDT; per-user/per-profile overrides or runtime-writable state → Custom Settings. Hardcoded IDs and magic strings in Apex → always wrong; that's what these exist to replace.",
    ],
    whenToUse: [
      "Environment-specific values (endpoints, keys to Named Credential names) so code never changes between sandbox and production.",
      "Business rule tables that admins tune without deployments reading them in Apex or Flow — thresholds, mappings, toggles.",
      "Framework configuration: trigger handler on/off switches, feature flags per capability.",
    ],
    whenToAvoid: [
      "Actual business data (customer records, transactions) — that's objects; CMDT records have low volume ceilings and no sharing model.",
      "Secrets — CMDT values are visible to anyone with metadata access; credentials belong in Named/External Credentials.",
      "High-frequency runtime writes — CMDT is effectively read-only at runtime for practical purposes (writes go through the Metadata API, not DML).",
    ],
    pitfalls: [
      "Hardcoded record IDs in Apex — the anti-pattern CMDT exists to kill; IDs differ across environments and break on refresh.",
      "Choosing List Custom Settings for deployable config — their records don't deploy as metadata, so every environment gets hand-populated (and drifts).",
      "Nobody documents what each CMDT record controls; two years later the org has config archaeology instead of configuration.",
      "Overbuilding: a five-value mapping doesn't need a custom rules engine — CMDT is for config, not a substitute for code review.",
    ],
    related: ["deployments", "sfdx-cli", "apex", "flow"],
    resources: [
      {
        title: "Custom Metadata Types Basics (Trailhead)",
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
        title: "CMDT vs Custom Settings decision guide",
        url: "https://www.salesforceben.com/custom-metadata-types-vs-custom-settings/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "sandboxes",
    title: "Sandboxes & Environments",
    category: "devops",
    tagline:
      "Copies of your org for building and testing — and the environment strategy that keeps production safe.",
    mentalModel: [
      "A sandbox is a copy of your production org's configuration (and sometimes data) where you build and test safely. The tiers differ by data and refresh cadence: Developer (config only, refresh daily), Developer Pro (more storage), Partial Copy (config + a data sample, refresh every 5 days), and Full Copy (everything, refresh every 29 days). Scratch orgs are different animals: ephemeral, source-built orgs created from a definition file, ideal for package development.",
      "The mental model is a pipeline: changes are born in dev environments, integrate in a shared testing sandbox, get validated in a staging/UAT environment that resembles production, then deploy to production. The further right, the more production-like and the more protected. Refreshing a sandbox replaces it with a fresh copy — anything not saved elsewhere (in source control!) is gone.",
    ],
    whenToUse: [
      "All building and testing — production is for users, not experiments.",
      "Full Copy for performance testing and final UAT; Partial for realistic integration testing; Developer for day-to-day work.",
      "Scratch orgs for package-based development and CI jobs.",
    ],
    whenToAvoid: [
      "Don't develop directly in production — even 'tiny' changes ripple through automation and layouts.",
      "Don't treat sandboxes as backup — they're copies of config at refresh time, not a data backup strategy.",
      "Don't let 'the UAT sandbox' drift un-refreshed for a year — stale environments produce false confidence.",
    ],
    pitfalls: [
      "Real customer data (emails, PII) in lower sandboxes: emails can actually send, and access is usually broader — mask or scramble sensitive data.",
      "Refresh without warning: someone refreshes the shared sandbox and a month of un-tracked work evaporates. Communicate and source-control.",
      "Hardcoded production URLs/IDs breaking in sandboxes (and vice versa) — use environment-aware config (custom metadata).",
      "Integration endpoints in sandboxes still pointing at production systems — the test that accidentally charged a real credit card is a genre of war story.",
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
        title: "Environment strategy for architects",
        url: "https://architect.salesforce.com/decision-guides/environment-strategy",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
  {
    slug: "sfdx-cli",
    title: "Salesforce CLI & Source-Driven Development",
    category: "devops",
    tagline:
      "Treating org configuration as code in version control — the foundation of modern Salesforce development.",
    mentalModel: [
      "The Salesforce CLI (sf) turns org metadata into files: retrieve configuration as XML/JSON source, commit it to git, deploy it elsewhere. This inverts the old world where 'the org is the truth' — in source-driven development, the repository is the truth and orgs are places where the source runs.",
      "The core loop: sf project retrieve (pull changes from a dev org into files) → git commit → sf project deploy (push to the next environment). Around this loop grows everything else: code review on org changes, CI pipelines that validate before merge, scratch orgs spun from source, and packages that version whole features. Even declarative changes (flows, layouts, permission sets) are files that diff and merge.",
    ],
    whenToUse: [
      "Any team with more than one person changing an org — source control is how changes stop colliding.",
      "Automated validation: CI running tests and deploy checks on every proposed change.",
      "Repeatable environment builds: seed a fresh sandbox or scratch org from the repo.",
    ],
    whenToAvoid: [
      "A solo admin making occasional field changes can survive on change sets — adopt tooling when pain, not fashion, demands it.",
      "Don't force scratch-org package development on a team still learning the basics — org-based development with source tracking is a fine intermediate step.",
    ],
    pitfalls: [
      "Retrieve-and-commit discipline decay: if half the changes bypass git, the repo silently stops being the truth and deploys start overwriting work.",
      "Profile/permission set XML noise: these files are enormous and merge badly — retrieve them surgically and prefer permission sets.",
      "Metadata dependencies bite deploys: a field referenced by a layout referenced by a profile… deploy errors teach the dependency graph the hard way.",
      "Ignoring the .forceignore file — retrieving junk (personal layouts, package noise) pollutes the repo.",
    ],
    related: ["deployments", "sandboxes", "apex-testing"],
    resources: [
      {
        title: "Salesforce CLI Setup (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/sfdx_app_dev",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Salesforce CLI Command Reference",
        url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_unified.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
      {
        title: "Source-driven development guide",
        url: "https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm",
        source: "Salesforce Docs",
        level: "practical",
      },
    ],
  },
  {
    slug: "deployments",
    title: "Deployments & Release Management",
    category: "devops",
    tagline:
      "Moving changes safely to production: change sets, CLI deploys, DevOps Center, and the discipline around them.",
    mentalModel: [
      "A deployment moves metadata from one org to another. The tools form a maturity ladder: change sets (click-built bundles between connected orgs — simple, manual, no history), CLI/CI deploys (source from git, automated tests, repeatable), and DevOps Center (Salesforce's free UI over git-based pipelines — change sets' successor). Independent vendors (Gearset, Copado) add richer diffing, rollback, and orchestration.",
      "Two platform quirks define the experience. First, production deploys run Apex tests and require 75% coverage — test health is deployment health. Second, there's no true rollback: you 'roll back' by deploying the previous state, which is only possible if the previous state lives in version control. That's the deep argument for source-driven work: git is your undo button.",
    ],
    whenToUse: [
      "Change sets for small teams making occasional declarative changes between connected orgs.",
      "CLI/CI or DevOps Center once changes are frequent, multiple people are involved, or auditability matters.",
      "Validation-only deploys (checkOnly) to catch failures before the real deployment window.",
    ],
    whenToAvoid: [
      "Don't deploy Friday evening without a reason and a rollback plan — platform cliché, still true.",
      "Don't hand-replicate changes in production 'because the change set missed something' — fix the pipeline, not the symptom.",
      "Avoid giant quarterly big-bang releases when weekly small ones are feasible — batch size drives risk.",
    ],
    pitfalls: [
      "The 'works in sandbox' gap: production has different data volumes, users, and integrations — validate with production-like conditions.",
      "Destructive changes are separate: deleting fields/objects requires explicit destructive changes files — forgotten deletions accumulate as drift.",
      "Profiles in change sets are notorious for deploying partially — permission sets deploy far more predictably.",
      "No deployment log/audit: when production breaks, 'what changed recently?' should take one minute to answer, not a forensic investigation.",
      "Skipping post-deploy steps (activating flows, scheduling jobs, updating named credentials) — keep a runbook.",
    ],
    related: ["sandboxes", "sfdx-cli", "apex-testing", "profiles-permission-sets"],
    resources: [
      {
        title: "DevOps Center (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.devops_center_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "Change Sets (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.changesets.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Salesforce DevOps guide (community)",
        url: "https://www.salesforceben.com/salesforce-devops/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
];
