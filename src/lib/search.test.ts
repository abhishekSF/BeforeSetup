import { describe, expect, it } from "vitest";
import { filterTopics, haystackFor, queryWords, topicMatches } from "@/lib/search";
import { makeTopic } from "@/test/fixtures";

const flow = makeTopic({
  slug: "flow",
  title: "Flow",
  category: "automation",
  tagline: "Declarative automation",
  mentalModel: ["Clicks not code"],
  pitfalls: ["Too many flows on one object"],
  whenToUse: ["Same-record field updates"],
});

const apex = makeTopic({
  slug: "apex",
  title: "Apex",
  category: "code",
  tagline: "Server-side code",
  mentalModel: ["Java-like"],
  pitfalls: ["Governor limits"],
  whenToUse: ["Complex logic"],
});

describe("queryWords", () => {
  it("returns empty for blank input and splits on whitespace", () => {
    expect(queryWords("")).toEqual([]);
    expect(queryWords("   ")).toEqual([]);
    expect(queryWords(" Flow  Apex ")).toEqual(["flow", "apex"]);
  });
});

describe("haystackFor", () => {
  it("joins searchable fields lowercase with spaces between fields", () => {
    const hay = haystackFor(flow);
    expect(hay).toContain("flow");
    expect(hay).toContain("declarative automation");
    expect(hay).toContain("clicks not code");
    expect(hay).toContain("too many flows");
    expect(hay).toContain("same-record");
    expect(hay).toContain("flow declarative automation");
    expect(hay).not.toContain("flowdeclarative");
  });
});

describe("topicMatches", () => {
  it("filters by category when set", () => {
    expect(topicMatches(flow, "", "automation")).toBe(true);
    expect(topicMatches(flow, "", "code")).toBe(false);
    expect(topicMatches(flow, "", null)).toBe(true);
  });

  it("requires every query word to appear", () => {
    expect(topicMatches(flow, "flow", null)).toBe(true);
    expect(topicMatches(flow, "FLOW declarative", null)).toBe(true);
    expect(topicMatches(flow, "flow xyz", null)).toBe(false);
    expect(topicMatches(apex, "governor", null)).toBe(true);
  });
});

describe("filterTopics", () => {
  it("returns matching topics", () => {
    const all = [flow, apex];
    expect(filterTopics(all, "", null)).toEqual(all);
    expect(filterTopics(all, "apex", null).map((t) => t.slug)).toEqual(["apex"]);
    expect(filterTopics(all, "", "automation").map((t) => t.slug)).toEqual([
      "flow",
    ]);
    expect(filterTopics(all, "nope", null)).toEqual([]);
  });
});
