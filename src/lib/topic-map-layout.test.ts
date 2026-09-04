import { describe, expect, it } from "vitest";
import {
  MAP_CX,
  MAP_CY,
  MAP_HEIGHT,
  MAP_RX,
  MAP_RY,
  MAP_WIDTH,
  SHORT_LABEL,
  buildEdges,
  categoryAngle,
  clamp,
  clusterRadius,
  computeLayout,
  curveControl,
  edgeKey,
  neighborSlugs,
  shortLabelFor,
  type NodePos,
} from "@/lib/topic-map-layout";
import { makeCategory, makeTopic } from "@/test/fixtures";

describe("clamp", () => {
  it("returns min, max, or the value", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("clusterRadius", () => {
  it("uses the three size buckets", () => {
    expect(clusterRadius(0)).toBe(52);
    expect(clusterRadius(1)).toBe(52);
    expect(clusterRadius(2)).toBe(52);
    expect(clusterRadius(3)).toBe(84);
    expect(clusterRadius(4)).toBe(84);
    expect(clusterRadius(5)).toBe(100);
    expect(clusterRadius(20)).toBe(100);
  });
});

describe("categoryAngle", () => {
  it("starts at -PI/2 and handles empty totals", () => {
    expect(categoryAngle(0, 0)).toBe(-Math.PI / 2);
    expect(categoryAngle(0, -1)).toBe(-Math.PI / 2);
    expect(categoryAngle(0, 4)).toBe(-Math.PI / 2);
    expect(categoryAngle(1, 4)).toBe(0);
    expect(categoryAngle(2, 4)).toBe(Math.PI / 2);
    expect(categoryAngle(3, 4)).toBe(Math.PI);
  });
});

describe("shortLabelFor", () => {
  it("returns the map label or the title", () => {
    expect(shortLabelFor("flow", "Salesforce Flow")).toBe("Flow");
    expect(shortLabelFor("not-a-topic", "Custom Title")).toBe("Custom Title");
    expect(shortLabelFor("agentforce", "Agentforce")).toBe("Agentforce");
  });
});

describe("edgeKey", () => {
  it("is order-independent", () => {
    expect(edgeKey("a", "b")).toBe("a|b");
    expect(edgeKey("b", "a")).toBe("a|b");
    expect(edgeKey("a", "a")).toBe("a|a");
  });
});

describe("computeLayout", () => {
  it("places a single member on the cluster center", () => {
    const cats = [makeCategory({ id: "code", label: "Code" })];
    const topics = [makeTopic({ slug: "apex", category: "code", title: "Apex" })];
    const layout = computeLayout(cats, topics);
    expect(layout.nodes).toHaveLength(1);
    expect(layout.clusterLabels).toHaveLength(1);
    expect(layout.clusterLabels[0]?.id).toBe("code");
    const angle = categoryAngle(0, 1);
    expect(layout.nodes[0]?.x).toBeCloseTo(MAP_CX + MAP_RX * Math.cos(angle));
    expect(layout.nodes[0]?.y).toBeCloseTo(MAP_CY + MAP_RY * Math.sin(angle));
  });

  it("places three one-member clusters using + radius*trig, not minus or divide", () => {
    const cats = [
      makeCategory({ id: "code", label: "Code" }),
      makeCategory({ id: "ui", label: "UI" }),
      makeCategory({ id: "ai", label: "AI" }),
    ];
    const topics = cats.map((c) =>
      makeTopic({ slug: c.id, category: c.id, title: c.label })
    );
    const layout = computeLayout(cats, topics);
    const angle = categoryAngle(1, 3);
    const node = layout.nodes.find((n) => n.slug === "ui");
    expect(node?.x).toBeCloseTo(MAP_CX + MAP_RX * Math.cos(angle), 8);
    expect(node?.y).toBeCloseTo(MAP_CY + MAP_RY * Math.sin(angle), 8);
    expect(Math.cos(angle)).not.toBeCloseTo(0);
    expect(Math.abs(Math.cos(angle))).not.toBeCloseTo(1);
    expect(Math.sin(angle)).not.toBeCloseTo(0);
    expect(Math.abs(Math.sin(angle))).not.toBeCloseTo(1);

    const r = clusterRadius(1);
    const label = layout.clusterLabels.find((l) => l.id === "ui");
    expect(label?.x).toBeCloseTo(
      clamp(
        MAP_CX + MAP_RX * Math.cos(angle) + Math.cos(angle) * (r + 62),
        110,
        MAP_WIDTH - 110
      ),
      8
    );
    expect(label?.y).toBeCloseTo(
      clamp(
        MAP_CY + MAP_RY * Math.sin(angle) + Math.sin(angle) * (r + 62),
        28,
        MAP_HEIGHT - 14
      ),
      8
    );
    expect(r + 62).not.toBe(r - 62);
  });

  it("spreads three members at radius r with the start offset", () => {
    const cats = [makeCategory({ id: "code", label: "Code" })];
    const topics = [
      makeTopic({ slug: "a", category: "code" }),
      makeTopic({ slug: "b", category: "code" }),
      makeTopic({ slug: "c", category: "code" }),
    ];
    const layout = computeLayout(cats, topics);
    expect(layout.nodes).toHaveLength(3);
    const angle = categoryAngle(0, 1);
    const ccx = MAP_CX + MAP_RX * Math.cos(angle);
    const ccy = MAP_CY + MAP_RY * Math.sin(angle);
    const r = clusterRadius(3);
    const a0 = (0 / 3) * Math.PI * 2 + angle + Math.PI / 3;
    const a1 = (1 / 3) * Math.PI * 2 + angle + Math.PI / 3;
    expect(Math.cos(a0)).not.toBeCloseTo(0);
    expect(Math.abs(Math.cos(a0))).not.toBeCloseTo(1);
    expect(layout.nodes[0]?.x).toBeCloseTo(ccx + r * Math.cos(a0), 8);
    expect(layout.nodes[0]?.y).toBeCloseTo(ccy + r * Math.sin(a0), 8);
    expect(layout.nodes[1]?.x).toBeCloseTo(ccx + r * Math.cos(a1), 8);
    expect(layout.nodes[1]?.y).toBeCloseTo(ccy + r * Math.sin(a1), 8);
  });

  it("clamps cluster labels onto the canvas", () => {
    const cats = [
      makeCategory({ id: "code", label: "Code" }),
      makeCategory({ id: "ui", label: "UI" }),
      makeCategory({ id: "ai", label: "AI" }),
      makeCategory({ id: "security", label: "Sec" }),
    ];
    const topics = cats.flatMap((c) => [
      makeTopic({ slug: `${c.id}-1`, category: c.id }),
      makeTopic({ slug: `${c.id}-2`, category: c.id }),
      makeTopic({ slug: `${c.id}-3`, category: c.id }),
      makeTopic({ slug: `${c.id}-4`, category: c.id }),
      makeTopic({ slug: `${c.id}-5`, category: c.id }),
    ]);
    const layout = computeLayout(cats, topics);
    for (const label of layout.clusterLabels) {
      expect(label.x).toBeGreaterThanOrEqual(110);
      expect(label.x).toBeLessThanOrEqual(MAP_WIDTH - 110);
      expect(label.y).toBeGreaterThanOrEqual(28);
      expect(label.y).toBeLessThanOrEqual(MAP_HEIGHT - 14);
    }
    expect(layout.nodes).toHaveLength(20);
  });

  it("ignores topics from categories that are not listed", () => {
    const layout = computeLayout(
      [makeCategory({ id: "code", label: "Code" })],
      [makeTopic({ slug: "flow", category: "automation" })]
    );
    expect(layout.nodes).toHaveLength(0);
  });
});

describe("buildEdges", () => {
  const nodes: NodePos[] = [
    { slug: "a", title: "A", category: "code", x: 1, y: 1 },
    { slug: "b", title: "B", category: "code", x: 2, y: 2 },
    { slug: "c", title: "C", category: "code", x: 3, y: 3 },
  ];

  it("skips missing endpoints and dedupes undirected pairs", () => {
    const topics = [
      makeTopic({ slug: "a", related: ["b", "missing"] }),
      makeTopic({ slug: "b", related: ["a", "c"] }),
      makeTopic({ slug: "c", related: ["ghost"] }),
      makeTopic({ slug: "orphan", related: ["a"] }),
    ];
    const edges = buildEdges(topics, nodes);
    expect(edges).toHaveLength(2);
    const keys = edges.map(([x, y]) => edgeKey(x.slug, y.slug)).sort();
    expect(keys).toEqual(["a|b", "b|c"]);
    for (const [x, y] of edges) {
      expect(x).toBeDefined();
      expect(y).toBeDefined();
    }
  });

  it("returns empty when there are no relations", () => {
    expect(buildEdges([makeTopic({ slug: "a" })], nodes)).toEqual([]);
    expect(buildEdges([], [])).toEqual([]);
  });
});

describe("neighborSlugs", () => {
  const a: NodePos = { slug: "a", title: "A", category: "code", x: 0, y: 0 };
  const b: NodePos = { slug: "b", title: "B", category: "code", x: 1, y: 1 };
  const c: NodePos = { slug: "c", title: "C", category: "code", x: 2, y: 2 };
  const edges: [NodePos, NodePos][] = [
    [a, b],
    [b, c],
  ];

  it("returns null when nothing is hovered", () => {
    expect(neighborSlugs(null, edges)).toBeNull();
  });

  it("includes the hovered node and both directions of an edge", () => {
    expect(neighborSlugs("a", edges)).toEqual(new Set(["a", "b"]));
    expect(neighborSlugs("b", edges)).toEqual(new Set(["b", "a", "c"]));
    expect(neighborSlugs("c", edges)).toEqual(new Set(["c", "b"]));
    expect(neighborSlugs("z", edges)).toEqual(new Set(["z"]));
  });
});

describe("curveControl", () => {
  it("bends the midpoint away from the canvas center", () => {
    const a: NodePos = { slug: "a", title: "A", category: "code", x: 0, y: 0 };
    const b: NodePos = { slug: "b", title: "B", category: "code", x: 100, y: 50 };
    const { mx, my } = curveControl(a, b);
    expect(mx).toBe((0 + 100) / 2 + (MAP_CY - (0 + 50) / 2) * 0.12);
    expect(my).toBe((0 + 50) / 2 + ((0 + 100) / 2 - MAP_CX) * 0.12);
  });
});

describe("SHORT_LABEL", () => {
  it("contains the known flow short name", () => {
    expect(SHORT_LABEL.flow).toBe("Flow");
    expect(SHORT_LABEL.agentforce).toBe("Agentforce");
  });
});
