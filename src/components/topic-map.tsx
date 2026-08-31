"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { topics } from "@/data/topics";
import { categories } from "@/data/categories";
import type { CategoryId } from "@/data/types";
import { categoryHex, categoryBadgeClass } from "@/lib/category-colors";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const W = 1320;
const H = 940;
const CX = W / 2;
const CY = 500;
const RX = 400;
const RY = 310;

const shortLabel: Record<string, string> = {
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

interface NodePos {
  slug: string;
  title: string;
  category: CategoryId;
  x: number;
  y: number;
}

function computeLayout(): {
  nodes: NodePos[];
  clusterLabels: { id: CategoryId; label: string; x: number; y: number }[];
} {
  const nodes: NodePos[] = [];
  const clusterLabels: {
    id: CategoryId;
    label: string;
    x: number;
    y: number;
  }[] = [];

  categories.forEach((cat, i) => {
    const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
    const ccx = CX + RX * Math.cos(angle);
    const ccy = CY + RY * Math.sin(angle);
    const members = topics.filter((t) => t.category === cat.id);
    const r = members.length <= 2 ? 52 : members.length <= 4 ? 84 : 100;

    // Label sits on the far side of the cluster, away from the map center,
    // clamped so it never leaves the canvas.
    clusterLabels.push({
      id: cat.id,
      label: cat.label,
      x: Math.min(Math.max(ccx + Math.cos(angle) * (r + 62), 110), W - 110),
      y: Math.min(Math.max(ccy + Math.sin(angle) * (r + 62), 28), H - 14),
    });

    members.forEach((t, j) => {
      if (members.length === 1) {
        nodes.push({ slug: t.slug, title: t.title, category: cat.id, x: ccx, y: ccy });
        return;
      }
      const a = (j / members.length) * Math.PI * 2 + angle + Math.PI / members.length;
      nodes.push({
        slug: t.slug,
        title: t.title,
        category: cat.id,
        x: ccx + r * Math.cos(a),
        y: ccy + r * Math.sin(a),
      });
    });
  });

  return { nodes, clusterLabels };
}

const { nodes, clusterLabels } = computeLayout();
const nodeBySlug = new Map(nodes.map((n) => [n.slug, n]));

const edges: [NodePos, NodePos][] = (() => {
  const seen = new Set<string>();
  const list: [NodePos, NodePos][] = [];
  for (const t of topics) {
    for (const rel of t.related) {
      const a = nodeBySlug.get(t.slug);
      const b = nodeBySlug.get(rel);
      if (!a || !b) continue;
      const key = [t.slug, rel].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      list.push([a, b]);
    }
  }
  return list;
})();

export function TopicMap() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const neighbors = useMemo(() => {
    if (!hovered) return null;
    const set = new Set<string>([hovered]);
    for (const [a, b] of edges) {
      if (a.slug === hovered) set.add(b.slug);
      if (b.slug === hovered) set.add(a.slug);
    }
    return set;
  }, [hovered]);

  const hoveredTopic = hovered
    ? topics.find((t) => t.slug === hovered)
    : null;

  return (
    <div>
      {/* Full map on md+ screens */}
      <div className="hidden md:block">
        <div className="relative rounded-xl border bg-card p-2 shadow-sm">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full select-none"
            role="img"
            aria-label="Interactive map of Salesforce platform topics grouped by category"
          >
            {/* Edges */}
            {edges.map(([a, b]) => {
              const active =
                hovered !== null &&
                (a.slug === hovered || b.slug === hovered);
              const mx = (a.x + b.x) / 2 + (CY - (a.y + b.y) / 2) * 0.12;
              const my = (a.y + b.y) / 2 + ((a.x + b.x) / 2 - CX) * 0.12;
              return (
                <path
                  key={`${a.slug}-${b.slug}`}
                  d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                  fill="none"
                  stroke={active ? categoryHex[a.category] : "currentColor"}
                  strokeWidth={active ? 2.2 : 1}
                  className={cn(
                    "text-border transition-opacity",
                    hovered && !active ? "opacity-10" : "opacity-60"
                  )}
                />
              );
            })}

            {/* Cluster labels */}
            {clusterLabels.map((c) => (
              <text
                key={c.id}
                x={c.x}
                y={c.y}
                textAnchor="middle"
                className="fill-muted-foreground text-[15px] font-semibold uppercase tracking-wider"
                style={{ opacity: hovered ? 0.35 : 0.9 }}
              >
                {c.label}
              </text>
            ))}

            {/* Nodes */}
            {nodes.map((n) => {
              const dimmed = neighbors !== null && !neighbors.has(n.slug);
              const isHover = hovered === n.slug;
              return (
                <g
                  key={n.slug}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="cursor-pointer transition-opacity"
                  style={{ opacity: dimmed ? 0.2 : 1 }}
                  onMouseEnter={() => setHovered(n.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => router.push(`/topics/${n.slug}`)}
                >
                  <circle
                    r={isHover ? 15 : 11}
                    fill={categoryHex[n.category]}
                    fillOpacity={isHover ? 1 : 0.85}
                    stroke={categoryHex[n.category]}
                    strokeOpacity={0.35}
                    strokeWidth={isHover ? 10 : 6}
                    className="transition-all"
                  />
                  <text
                    y={32}
                    textAnchor="middle"
                    className={cn(
                      "fill-foreground text-[14px]",
                      isHover ? "font-semibold" : "font-medium"
                    )}
                  >
                    {shortLabel[n.slug] ?? n.title}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover detail panel */}
          <div className="pointer-events-none absolute left-4 top-4 max-w-xs">
            {hoveredTopic ? (
              <div className="rounded-lg border bg-popover p-3 shadow-md">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ background: categoryHex[hoveredTopic.category] }}
                  />
                  <span className="text-sm font-semibold">
                    {hoveredTopic.title}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {hoveredTopic.tagline}
                </p>
                <p className="mt-1.5 text-[11px] font-medium text-primary">
                  Click to dive in →
                </p>
              </div>
            ) : (
              <p className="rounded-lg border bg-popover/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
                Hover a node to preview · click to dive in
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grouped list fallback on small screens */}
      <div className="space-y-6 md:hidden">
        {categories.map((cat) => {
          const members = topics.filter((t) => t.category === cat.id);
          return (
            <div key={cat.id}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: categoryHex[cat.id] }}
                />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((t) => (
                  <Link key={t.slug} href={`/topics/${t.slug}`}>
                    <Badge
                      variant="outline"
                      className={cn("text-sm", categoryBadgeClass[cat.id])}
                    >
                      {t.title}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
