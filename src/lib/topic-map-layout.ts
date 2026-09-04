import type { Category, CategoryId, Topic } from "@/data/types";

export const MAP_WIDTH = 1320;
export const MAP_HEIGHT = 940;
export const MAP_CX = MAP_WIDTH / 2;
export const MAP_CY = 500;
export const MAP_RX = 400;
export const MAP_RY = 310;

export const SHORT_LABEL: Record<string, string> = {
  "objects-and-fields": "Objects & Fields",
  relationships: "Relationships",
  "record-types": "Record Types",
  flow: "Flow",
  "apex-triggers": "Triggers",
  approvals: "Approvals",
  "async-apex": "Async Apex",
  apex: "Apex",
  soql: "SOQL & SOSL",
  "governor-limits": "Governor Limits",
  "apex-testing": "Testing",
  "lightning-app-builder": "App Builder",
  "lightning-web-components": "LWC",
  "profiles-permission-sets": "Permissions",
  "sharing-and-visibility": "Sharing",
  "rest-apis": "APIs",
  "platform-events": "Events & CDC",
  "integration-patterns": "Patterns",
  sandboxes: "Sandboxes",
  "sfdx-cli": "CLI & Source",
  deployments: "Deployments",
  "data-loading": "Data Loading",
  "reports-dashboards": "Reports",
  "validation-rules": "Validation",
  "experience-cloud": "Experience Cloud",
  "custom-metadata": "Custom Metadata",
  agentforce: "Agentforce",
  "data-360": "Data 360",
  "headless-360": "Headless 360",
  claudeforce: "Claudeforce",
  "identity-sso": "Identity & SSO",
  "org-strategy": "Org Strategy",
  "large-data-volumes": "LDV & Scale",
  "licenses-editions": "Licenses",
  appexchange: "AppExchange",
  "implementation-lifecycle": "Implementations",
};

export interface NodePos {
  slug: string;
  title: string;
  category: CategoryId;
  x: number;
  y: number;
}

interface ClusterLabel {
  id: CategoryId;
  label: string;
  x: number;
  y: number;
}

interface MapLayout {
  nodes: NodePos[];
  clusterLabels: ClusterLabel[];
}

type MapEdge = [NodePos, NodePos];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clusterRadius(memberCount: number): number {
  if (memberCount <= 2) {
    return 52;
  }
  if (memberCount <= 4) {
    return 84;
  }
  return 100;
}

export function categoryAngle(index: number, total: number): number {
  if (total <= 0) {
    return -Math.PI / 2;
  }
  return (index / total) * Math.PI * 2 - Math.PI / 2;
}

export function shortLabelFor(slug: string, title: string): string {
  const label = SHORT_LABEL[slug];
  if (label === undefined) {
    return title;
  }
  return label;
}

export function edgeKey(a: string, b: string): string {
  const pair = [a, b].sort();
  return `${pair[0]}|${pair[1]}`;
}

export function computeLayout(
  categoryList: readonly Category[],
  topicList: readonly Topic[]
): MapLayout {
  const nodes: NodePos[] = [];
  const clusterLabels: ClusterLabel[] = [];

  categoryList.forEach((cat, i) => {
    const angle = categoryAngle(i, categoryList.length);
    const ccx = MAP_CX + MAP_RX * Math.cos(angle);
    const ccy = MAP_CY + MAP_RY * Math.sin(angle);
    const members = topicList.filter((t) => t.category === cat.id);
    const r = clusterRadius(members.length);

    clusterLabels.push({
      id: cat.id,
      label: cat.label,
      x: clamp(ccx + Math.cos(angle) * (r + 62), 110, MAP_WIDTH - 110),
      y: clamp(ccy + Math.sin(angle) * (r + 62), 28, MAP_HEIGHT - 14),
    });

    placeMembers(members, cat.id, ccx, ccy, r, angle, nodes);
  });

  return { nodes, clusterLabels };
}

function placeMembers(
  members: readonly Topic[],
  category: CategoryId,
  ccx: number,
  ccy: number,
  r: number,
  angle: number,
  nodes: NodePos[]
): void {
  if (members.length === 1) {
    const only = members[0];
    nodes.push({
      slug: only.slug,
      title: only.title,
      category,
      x: ccx,
      y: ccy,
    });
    return;
  }

  members.forEach((topic, j) => {
    const a =
      (j / members.length) * Math.PI * 2 + angle + Math.PI / members.length;
    nodes.push({
      slug: topic.slug,
      title: topic.title,
      category,
      x: ccx + r * Math.cos(a),
      y: ccy + r * Math.sin(a),
    });
  });
}

export function buildEdges(
  topicList: readonly Topic[],
  nodes: readonly NodePos[]
): MapEdge[] {
  const nodeBySlug = new Map(nodes.map((n) => [n.slug, n]));
  const seen = new Set<string>();
  const list: MapEdge[] = [];

  for (const topic of topicList) {
    for (const rel of topic.related) {
      const a = nodeBySlug.get(topic.slug);
      const b = nodeBySlug.get(rel);
      if (a === undefined || b === undefined) {
        continue;
      }
      const key = edgeKey(topic.slug, rel);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      list.push([a, b]);
    }
  }

  return list;
}

export function neighborSlugs(
  hovered: string | null,
  edges: readonly MapEdge[]
): Set<string> | null {
  if (hovered === null) {
    return null;
  }
  const set = new Set<string>([hovered]);
  for (const [a, b] of edges) {
    if (a.slug === hovered) {
      set.add(b.slug);
    }
    if (b.slug === hovered) {
      set.add(a.slug);
    }
  }
  return set;
}

export function curveControl(
  a: NodePos,
  b: NodePos
): { mx: number; my: number } {
  const mx = (a.x + b.x) / 2 + (MAP_CY - (a.y + b.y) / 2) * 0.12;
  const my = (a.y + b.y) / 2 + ((a.x + b.x) / 2 - MAP_CX) * 0.12;
  return { mx, my };
}
