# Editorial stabilization (September 9, 2026)

This pass classifies the requested content review and records the evidence used. A `verifiedOn` date is set only for first-party pages read during review.

## VERIFIED

- **Apex security model:** [Salesforce Architecture Blog](https://www.salesforce.com/blog/summer-26-release-architect-highlights/) (read September 8) supports the API 67.0 database-operation defaults and the trigger boundary. [Salesforce Developers Blog](https://developer.salesforce.com/blogs/2026/06/the-salesforce-developers-guide-to-the-summer-26-release) (read September 8) supports the API 67.0 class defaults and user-mode database operations. The reviewed resource is present on Apex, LWC, and Profiles & Permission Sets; it is no longer attached to Identity & SSO.
- **Agentforce execution identity:** [Salesforce Help article 005315874](https://help.salesforce.com/s/articleView?id=005315874&language=en_US&type=1) (read September 9) distinguishes employee agents running in the logged-in employee context from customer agents using a dedicated Agent User. The Agentforce topic now links this page and retains permission, verification, and action-context caveats.
- **Next-generation DevOps Center:** [Current Trailhead material](https://trailhead.salesforce.com/content/learn/modules/devops-center-quick-look/say-hello-to-devops-center) (read September 9) says the product is built into the platform, needs no package install, uses DX Inspector for viewing and committing changes, treats the source repository as source of truth, and promotes metadata with associated configuration data. The topic now reflects those facts and links the Trailhead unit.
- **Headless 360 Hosted MCP:** The specific [`platform/headless-360` reference](https://developer.salesforce.com/docs/platform/hosted-mcp-servers/references/reference/headless-360-mcp.html) (read September 9) identifies Beta since July 2026, API v67+, four tools, and per-user OAuth through an External Client App. A separate [Salesforce Developers post](https://developer.salesforce.com/blogs/2026/04/salesforce-hosted-mcp-servers-are-now-generally-available) (read September 9) supports Hosted MCP infrastructure GA. The topic qualifies Beta to the specific server.
- **Claudeforce announcement:** The [August 26 Salesforce–Anthropic announcement](https://www.salesforce.com/news/press-releases/2026/08/26/salesforce-and-anthropic-announce-claudeforce/) (read September 9) supports the announcement date, three workstreams, 37 skills, and the announced model/default and Bedrock positioning. Those statements are date-qualified as announcement claims, with current availability and commercial terms left to verification.

## QUALIFIED

- Topic lifecycle and edition copy for Headless 360 and Claudeforce now distinguish server-specific Beta or dated pilot language from broader Hosted MCP infrastructure and avoid asserting current edition access or terms.
- Architecture guidance in Claudeforce is labeled as an architecture note. Packaging uses `verify-terms` where the reviewed announcement does not establish current commercial terms.

## REMOVED

- Unresolved review notes for Agentforce, Headless 360, and Claudeforce.
- The obsolete Salesforce Ben DevOps Center setup guide, which describes the earlier managed-package generation (reviewed September 9; updated April 30, 2024).
- Unsupported Headless claims about Slack Claude Tag authentication, a universal Data Loader limit equivalence, and `GET only` behavior for read-only dispatch.
- Separate Anthropic contract and consumption assertions for Claudeforce.

## UNRESOLVED

- Current org-specific entitlements, edition access, pilot enrollment, commercial terms, and post-announcement availability for Agentforce and Claudeforce remain deployment decisions requiring current contract or product checks. No release decision is made here.
