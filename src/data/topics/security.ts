import type { Topic } from "../types";

export const securityTopics: Topic[] = [
  {
    slug: "identity-sso",
    title: "Identity, SSO & Connected Apps",
    category: "security",
    tagline:
      "Who is this user and how do we know: My Domain, single sign-on, MFA, and the OAuth apps that connect everything else.",
    mentalModel: [
      "Salesforce identity has two directions. Inbound (people logging into Salesforce): My Domain gives your org its own login URL, SSO delegates authentication to your identity provider (Okta, Entra ID) over SAML or OpenID Connect, and MFA is mandatory. Users stop having a 'Salesforce password' at all — the IdP owns authentication, Salesforce owns authorization. Outbound and app-to-app: Connected Apps (and the newer External Client Apps) are the OAuth registrations that let integrations, mobile apps, and now MCP clients get tokens to call your org's APIs.",
      "The mental model that simplifies everything: authentication answers 'who are you?' once, at the front door; everything you've learned about profiles, permission sets, and sharing answers 'what can you do?' after that. SSO doesn't change your security model — it changes who verifies the human. That's also why deprovisioning through the IdP is the killer feature: one offboarding in Okta closes CRM access the same minute, instead of whenever someone remembers the Salesforce user list.",
    ],
    whenToUse: [
      "Any org with more than a handful of users: SSO through the corporate IdP is table stakes for security and offboarding hygiene.",
      "Every integration: a dedicated Connected App (or External Client App) per system, with the narrowest OAuth scopes that work — never shared credentials.",
      "JIT provisioning or SCIM when user churn is high — accounts created and deactivated by the IdP, not by ticket queue.",
    ],
    whenToAvoid: [
      "Don't roll SSO to all users without a break-glass admin that authenticates directly — an IdP outage otherwise locks everyone out, including the people who could fix it.",
      "Don't reuse one Connected App across many integrations 'to keep it simple' — you lose per-system audit trails, scoping, and the ability to revoke one without breaking all.",
    ],
    pitfalls: [
      "Certificate expiry: SAML signing certs expire and take login down with them. Calendar the renewal like production maintenance, because it is.",
      "OAuth scope sprawl: apps requesting 'full' scope because it works. Scopes are your blast-radius control — narrow them.",
      "Forgetting API-only integration users in the MFA/SSO design — they need their own policy (certificates, JWT flows), not exemption sprawl.",
      "Experience Cloud login is its own identity surface: external identity licenses, self-registration flows, and social sign-on live under different settings than employee SSO.",
    ],
    related: ["profiles-permission-sets", "rest-apis", "experience-cloud", "headless-360"],
    resources: [
      {
        title: "User Authentication (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/identity_login",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Single Sign-On (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.sso_about.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "OAuth flows for Connected Apps",
        url: "https://help.salesforce.com/s/articleView?id=platform.remoteaccess_oauth_flows.htm&type=5",
        source: "Salesforce Help",
        level: "deep",
      },
    ],
  },
  {
    slug: "profiles-permission-sets",
    title: "Profiles & Permission Sets",
    category: "security",
    tagline:
      "What a user is allowed to do: object access, field access, and system permissions — now built around permission sets.",
    mentalModel: [
      "Salesforce splits 'what can you do' (this topic) from 'which records can you see' (sharing). Object permissions (create/read/edit/delete per object), field-level security, tab visibility, and system permissions like 'Export Reports' all live in profiles and permission sets. Every user has exactly one profile and any number of permission sets stacked on top — access is additive, and nothing subtracts.",
      "The modern doctrine matters: Salesforce is actively moving away from fat profiles. The target model is a minimal profile (login basics, defaults) plus permission sets grouped into permission set groups for job functions. Think of the profile as the chassis and permission sets as bolt-on capabilities: 'Sales User', 'Invoice Approver', 'Report Exporter' — assigned per human, mixed and matched.",
    ],
    whenToUse: [
      "Any new capability grant: create a permission set, not a profile tweak — future-you can assign it precisely and audit it.",
      "Permission set groups to bundle what a role needs ('Support Agent' = case management + knowledge + telephony sets).",
      "Field-level security to hide sensitive fields (comp, SSNs) from roles that don't need them — it applies everywhere: reports, APIs, exports.",
    ],
    whenToAvoid: [
      "Don't clone profiles to make small variations — that's how orgs end up with 40 near-identical profiles nobody can diff.",
      "Don't use page layouts to 'hide' sensitive data — layouts are cosmetic; the API and reports still expose the field unless FLS blocks it.",
    ],
    pitfalls: [
      "Access is additive-only: you can't use one permission set to remove what another grants. Design grants small and composable.",
      "'View All Data' and 'Modify All Data' bypass the entire sharing model — audit who has them quarterly; the answer is usually 'too many'.",
      "Forgetting Apex runs in system mode: your carefully designed FLS means nothing inside code unless the code enforces it.",
      "Permission sprawl without naming conventions becomes unauditable — name sets by capability, not by team.",
    ],
    related: ["sharing-and-visibility", "objects-and-fields", "record-types", "apex"],
    resources: [
      {
        title: "Data Security (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/data_security",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Permission sets (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.perm_sets_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "The move away from profiles, explained",
        url: "https://www.salesforceben.com/salesforce-permission-sets/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
  {
    slug: "sharing-and-visibility",
    title: "Sharing & Record Visibility",
    category: "security",
    tagline:
      "Which records a user can see: org-wide defaults set the floor, then roles, rules, and manual shares open doors upward.",
    mentalModel: [
      "Sharing answers a different question than permissions. A user might have Read on the Opportunity object (permission) but see only their own opportunities (sharing). The system starts with org-wide defaults (OWD) per object — Private, Public Read Only, or Public Read/Write. OWD is the floor: everything else only ever opens access wider, never narrower.",
      "On top of the floor: the role hierarchy grants managers access to their reports' records; sharing rules open records by owner or field criteria to groups; teams and manual sharing handle case-by-case grants; and Apex managed sharing covers what nothing else can. The design method is always the same — set OWD to the most restrictive setting anyone needs, then grant upward deliberately. If any user must not see all records of an object, that object's OWD must be Private.",
    ],
    whenToUse: [
      "Whenever the business says 'reps shouldn't see each other's deals' or 'this region's data is confidential' — that's an OWD and sharing rule conversation.",
      "Role hierarchy design — mirror data access needs, not the HR org chart.",
      "Account/Opportunity teams for collaborative selling instead of blanket access.",
    ],
    whenToAvoid: [
      "Don't leave everything Public Read/Write because sharing is 'complicated' — retrofitting Private OWD onto a mature org is a project.",
      "Don't reach for Apex managed sharing until declarative options are exhausted; code-managed shares must be maintained through ownership changes and data loads.",
    ],
    pitfalls: [
      "Sharing recalculation on OWD changes or role moves can take hours in large orgs — schedule big changes carefully.",
      "Implicit sharing surprises: access to a child (Opportunity) grants some access to the parent Account, and account access cascades down — the model has built-in edges people forget.",
      "'Why can this user see this record?' is genuinely hard to answer in a mature org — document your sharing design as you build it.",
      "Guest users and Experience Cloud have their own tighter sharing model — never assume internal rules apply externally.",
    ],
    related: ["profiles-permission-sets", "relationships", "objects-and-fields", "approvals"],
    resources: [
      {
        title: "Who Sees What (video series)",
        url: "https://help.salesforce.com/s/articleView?id=platform.security_data_access.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Record-Level Access: Under the Hood",
        url: "https://architect.salesforce.com/fundamentals/record-level-access",
        source: "Salesforce Architects",
        level: "deep",
      },
      {
        title: "Sharing rules explained",
        url: "https://www.salesforceben.com/salesforce-sharing-rules/",
        source: "Salesforce Ben",
        level: "practical",
      },
    ],
  },
];
