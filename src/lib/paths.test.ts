import { describe, expect, it } from "vitest";
import { resolvePathSteps } from "@/lib/paths";
import { makePath, makeTopic } from "@/test/fixtures";

describe("resolvePathSteps", () => {
  const flow = makeTopic({ slug: "flow", title: "Flow" });
  const apex = makeTopic({ slug: "apex", title: "Apex" });
  const dict = new Map([
    ["flow", flow],
    ["apex", apex],
  ]);

  it("skips missing topics and marks the original last index", () => {
    const path = makePath({
      slug: "dev",
      steps: [
        { topic: "flow", note: "first" },
        { topic: "missing", note: "gone" },
        { topic: "apex", note: "last" },
      ],
    });
    const steps = resolvePathSteps(path, dict);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      topic: flow,
      note: "first",
      index: 0,
      isLast: false,
    });
    expect(steps[1]).toMatchObject({
      topic: apex,
      note: "last",
      index: 2,
      isLast: true,
    });
  });

  it("returns empty when nothing resolves", () => {
    const path = makePath({
      slug: "empty",
      steps: [{ topic: "nope", note: "x" }],
    });
    expect(resolvePathSteps(path, dict)).toEqual([]);
    expect(resolvePathSteps(makePath({ slug: "none", steps: [] }), dict)).toEqual(
      []
    );
  });

  it("marks a single resolved last step as last", () => {
    const path = makePath({
      slug: "one",
      steps: [{ topic: "flow", note: "only" }],
    });
    expect(resolvePathSteps(path, dict)[0]?.isLast).toBe(true);
  });
});
