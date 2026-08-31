import type { Topic } from "../types";

export const securityTopics: Topic[] = [
  {
    slug: "identity-sso",
    title: "Identity, SSO & Connected Apps",
    category: "security",
    tagline:
      "Who verifies the humans and how apps get tokens — SSO, MFA, and the Connected App layer every integration passes through.",
    mentalModel: [
      "Two distinct questions live here. Human identity: who verifies a user at login? With SSO, your identity provider (Entra ID, Okta) does, via SAML or OpenID Connect — one place to onboard, offboard, and enforce MFA, with Salesforce as the service provider. App identity: how does software get access? Through Connected Apps (evolving into External Client Apps) — each defines an OAuth client with scopes, policies, and its own token lifecycle. Every integration, mobile app, and now every MCP-connected AI tool authenticates through this layer.",
      "The mental model that clarifies OAuth flows: match the flow to who's present. A human in a browser → authorization code flow (web server flow). A headless integration → JWT bearer or client credentials flow — never a stored username and password. Salesforce can also be the identity provider for other apps, and Experience Cloud adds external identity (customers and partners logging in) with its own license type.",
    ],
    whenToUse: [
      "SSO from day one in any org with more than a handful of users — offboarding alone justifies it (one disable, all access gone).",
      "JWT bearer flow for CI/CD and server-to-server integrations; client credentials for simple API access under a designated user.",
      "Named Credentials + External Credentials for outbound callouts — they handle token refresh and keep secrets out of code.",
    ],
    whenToAvoid: [
      "Don't build custom login handlers when standard SAML/OIDC configuration works — custom identity code is a liability magnet.",
      "Don't share one integration user + Connected App across five integrations — you lose per-system audit trails and blast-radius control.",
      "Avoid long-lived refresh tokens with broad scopes ('full') when narrow scopes do the job.",
    ],
    pitfalls: [
      "Offboarding gaps: SSO disabled the employee, but their API tokens and password-based logins linger — disable the user, revoke tokens, audit login history.",
      "The frozen admin: SSO misconfigured with no fallback local login path locks everyone out — keep a break-glass admin with password auth.",
      "OAuth scope sprawl: apps requesting 'full refresh_token' because it's easy; review what each Connected App can actually do.",
      "Integration users with System Administrator profiles — the single most common security-review finding; use minimum-access profiles with permission sets.",
      "Ignoring the new security surface: MCP servers and AI agents authenticate as OAuth clients too — the same hygiene (scopes, policies, monitoring) applies to them.",
    ],
    related: ["profiles-permission-sets", "rest-apis", "headless-360", "experience-cloud"],
    resources: [
      {
        title: "Identity Basics (Trailhead)",
        url: "https://trailhead.salesforce.com/content/learn/modules/identity_basics",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Salesforce Identity documentation",
        url: "https://help.salesforce.com/s/articleView?id=platform.identity_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "OAuth flows explained",
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
      "Object and field permissions: what users can do — and Salesforce's decade-long shift from profiles to permission sets.",
    mentalModel: [
      "Two layers of 'can you?': object permissions (create/read/edit/delete on Accounts?) and field-level security (can you see/edit this field?). Historically both lived on the profile — one per user. The modern model: the profile is a minimal base (login hours, defaults), and permission sets grant capabilities additively. Users get many permission sets; permission set groups bundle them by job function.",
      "The direction of travel matters: Salesforce has been steering away from profile-based permissions for years. New builds should treat profiles as nearly empty shells and put all grants in permission sets — 'permissions by job to be done', stackable and auditable. Note this is all about what you can do, not which records you can see — that's sharing (a separate topic).",
    ],
    whenToUse: [
      "Any new capability grant → permission set (or add to an existing group), not a profile edit.",
      "Role-based bundles: 'Sales Manager' = permission set group containing pipeline, forecasting, and reporting sets.",
      "Temporary/exceptional access: assign a set with an expiration date instead of cloning a profile.",
    ],
    whenToAvoid: [
      "Don't create profile #47 because one team needs one extra field — that's exactly what permission sets solve.",
      "Avoid 'View All Data'/'Modify All Data' as a shortcut — it bypasses the entire sharing model and is an audit red flag.",
      "Don't manage permissions user-by-user with ad-hoc sets — group them or drown in assignments.",
    ],
    pitfalls: [
      "Profile sprawl from the old world: 60 profiles that differ by two checkboxes. Migrate to base-profile + permission sets deliberately.",
      "Field-level security forgotten on new fields: a new field defaults to visible/invisible per profile settings — check FLS at creation time.",
      "Permissions vs sharing confusion: 'they have Edit on Cases but can't edit this case' is a sharing question, not a permission one.",
      "Nobody audits who has what: run permission analysis regularly — access accretes and never sheds on its own.",
    ],
    related: ["sharing-and-visibility", "record-types", "deployments"],
    resources: [
      {
        title: "Data Security (Trailhead module)",
        url: "https://trailhead.salesforce.com/content/learn/modules/data_security",
        source: "Trailhead",
        level: "intro",
      },
      {
        title: "Permission Sets (Salesforce Help)",
        url: "https://help.salesforce.com/s/articleView?id=platform.perm_sets_overview.htm&type=5",
        source: "Salesforce Help",
        level: "practical",
      },
      {
        title: "The end of permissions on profiles (community explainer)",
        url: "https://admin.salesforce.com/blog/2023/permissions-updates-learn-moar-spring-23",
        source: "Salesforce Admins Blog",
        level: "practical",
      },
    ],
  },
  {
    slug: "sharing-and-visibility",
    title: "Sharing & Record Visibility",
    category: "security",
    tagline:
      "Which records a user can see: org-wide defaults, role hierarchy, sharing rules, and the layers on top.",
    mentalModel: [
      "Sharing answers 'which rows?' where permissions answer 'which actions?'. The model is subtractive-then-additive: org-wide defaults (OWD) set the baseline (Private, Read Only, or Read/Write per object), then layers add access back: the role hierarchy (managers see subordinates' records), sharing rules (criteria- or owner-based grants to groups), manual/team sharing, and programmatic (Apex-managed) sharing for exotic cases.",
      "Design mantra: set OWD as restrictive as the business can tolerate, then open up deliberately. If OWD is Public Read/Write, every other mechanism is irrelevant. The reverse mistake — Private OWD with no layers — buries teams in 'I can't see the record' tickets. Owner matters enormously: ownership drives the hierarchy and many rules, which is why 'who owns integration-created records' is a real design decision.",
    ],
    whenToUse: [
      "Any multi-team org where not everyone should see everything — which is almost every org at scale.",
      "Criteria-based sharing rules for 'region sees region', 'department sees department' patterns.",
      "Apex-managed sharing when access logic depends on data relationships the declarative tools can't express.",
    ],
    whenToAvoid: [
      "Don't use Private OWD reflexively for objects with no confidentiality requirement — you pay in complexity and support load.",
      "Avoid modeling security through the role hierarchy alone when the org chart doesn't match data access needs — roles are a data-access tree, not an HR chart.",
      "Don't hand out 'View All' on objects to silence tickets — it's a hole, not a fix.",
    ],
    pitfalls: [
      "Sharing recalculation pain: changing OWD or moving big role subtrees on large data volumes can lock tables and take hours — plan and schedule.",
      "Implicit sharing surprises: account access grants some access to child opportunities/cases in ways people don't expect.",
      "Guest user and Experience Cloud sharing follow different, stricter rules — external sharing model is separate.",
      "Apex in system mode ignores sharing unless told otherwise — 'with sharing' matters for anything user-facing.",
      "Nobody documents why a sharing rule exists; years later everyone is afraid to touch it.",
    ],
    related: ["profiles-permission-sets", "relationships", "objects-and-fields", "apex"],
    resources: [
      {
        title: "Who Sees What (video series)",
        url: "https://help.salesforce.com/s/articleView?id=platform.security_data_access.htm&type=5",
        source: "Salesforce Help",
        level: "intro",
      },
      {
        title: "Record-Level Access: Under the Hood (whitepaper)",
        url: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_record_access_under_the_hood.meta/salesforce_record_access_under_the_hood/salesforce_record_access_under_the_hood.htm",
        source: "Salesforce Docs",
        level: "deep",
      },
      {
        title: "Sharing architecture on architect.salesforce.com",
        url: "https://architect.salesforce.com/fundamentals/sharing-architecture",
        source: "Salesforce Architects",
        level: "deep",
      },
    ],
  },
];
