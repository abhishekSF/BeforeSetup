import type { Category } from "./types";

export const categories: Category[] = [
  {
    id: "data-model",
    label: "Data Model",
    description:
      "How Salesforce stores and relates data: objects, fields, relationships, and record types.",
  },
  {
    id: "automation",
    label: "Automation",
    description:
      "Making things happen when records change: Flow, triggers, approvals, and background jobs.",
  },
  {
    id: "code",
    label: "Apex & Queries",
    description:
      "Server-side code and queries: Apex, SOQL, governor limits, and testing.",
  },
  {
    id: "ui",
    label: "User Interface",
    description:
      "What users see and click: Lightning pages, app builder, and custom web components.",
  },
  {
    id: "security",
    label: "Security & Sharing",
    description:
      "Who can see and do what: profiles, permission sets, and record-level sharing.",
  },
  {
    id: "integration",
    label: "Integration",
    description:
      "Connecting Salesforce to everything else: APIs, events, and integration patterns.",
  },
  {
    id: "devops",
    label: "Environments & DevOps",
    description:
      "Building and shipping safely: sandboxes, source control, CLI, and deployments.",
  },
  {
    id: "ai",
    label: "AI & Agents",
    description:
      "The 2025–26 wave: Agentforce, Data 360, Headless 360 and MCP, and the Claudeforce partnership.",
  },
  {
    id: "strategy",
    label: "Architecture & Strategy",
    description:
      "The decisions above the build: org strategy, scale, licensing, buy-vs-build, and running an implementation.",
  },
];

export const categoryById = Object.fromEntries(
  categories.map((c) => [c.id, c])
) as Record<Category["id"], Category>;
