"use client";

import { useMemo, useState } from "react";

import { CategoryFilter } from "@/components/category-filter";
import { AtlasDepth } from "@/components/atlas-depth";
import { filterTopics } from "@/lib/search";
import type { CategoryId } from "@/data/types";
import Link from "next/link";
import { topics } from "@/data/topics";
import { categories } from "@/data/categories";
import { categoryHex, categoryBadgeClass } from "@/lib/category-colors";
import { findBySlug } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  buildEdges,
  computeLayout,
  curveControl,
  neighborSlugs,
  shortLabelFor,
} from "@/lib/topic-map-layout";

const { nodes, clusterLabels } = computeLayout(categories, topics);
const edges = buildEdges(topics, nodes);

export function TopicMap({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const visible = new Set(filterTopics(topics, query, category).map((topic) => topic.slug));
  const [hovered, setHovered] = useState<string | null>(null);

  const neighbors = useMemo(
    () => neighborSlugs(hovered, edges),
    [hovered]
  );

  const hoveredTopic =
    hovered === null ? null : findBySlug(topics, hovered);

  return (
    <div className={cn("atlas", compact && "atlas-compact")}>
      {!compact && <div className="atlas-controls"><input aria-label="Search the atlas" placeholder="Locate a topic…" value={query} onChange={(event) => setQuery(event.target.value)} /><CategoryFilter value={category} onChange={setCategory} /><p role="status">{visible.size} topics in view</p></div>}
      <div className="atlas-visual">
        <div className="atlas-surface">
          <AtlasDepth />
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="h-auto w-full select-none"
            role="group"
            aria-label="Interactive map of Salesforce platform topics grouped by category"
          >
            {edges.filter(([a, b]) => visible.has(a.slug) && visible.has(b.slug)).map(([a, b]) => {
              const active =
                hovered !== null &&
                (a.slug === hovered || b.slug === hovered);
              const { mx, my } = curveControl(a, b);
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

            {nodes.filter((node) => visible.has(node.slug)).map((n) => {
              const dimmed = neighbors !== null && !neighbors.has(n.slug);
              const isHover = hovered === n.slug;
              return (
                <a
                  href={`/topics/${n.slug}`}
                  aria-label={n.title}
                  key={n.slug}

                  className="atlas-node transition-opacity"
                  style={{ opacity: dimmed ? 0.2 : 1 }}
                  onMouseEnter={() => setHovered(n.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n.slug)}
                  onBlur={() => setHovered(null)}
                >
                  <g transform={`translate(${n.x}, ${n.y})`}>
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
                    {shortLabelFor(n.slug, n.title)}
                  </text>
                  </g>
                </a>
              );
            })}
          </svg>

          <div className="atlas-preview" aria-live="polite">
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
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {hoveredTopic.tagline}
                </p>
                <p className="mt-1.5 text-sm font-medium text-primary">
                  Open topic →
                </p>
              </div>
            ) : (
              <p className="rounded-lg border bg-popover/80 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
                Hover or focus to trace connections · open a topic to dive in
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="atlas-topic-list" aria-label="Atlas topics">
        {categories.map((cat) => {
          const members = topics.filter((t) => t.category === cat.id && visible.has(t.slug));
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
