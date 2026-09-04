import { describe, expect, it } from "vitest";
import {
  findBySlug,
  lookupMany,
  pathPageMeta,
  topicPageMeta,
  versusPageMeta,
} from "@/lib/catalog";
import { makeTopic } from "@/test/fixtures";

describe("lookupMany", () => {
  it("returns values in key order and skips missing keys", () => {
    const dict = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    expect(lookupMany(["b", "z", "a"], dict)).toEqual([2, 1]);
    expect(lookupMany([], dict)).toEqual([]);
  });
});

describe("findBySlug", () => {
  const items = [makeTopic({ slug: "flow" }), makeTopic({ slug: "apex" })];

  it("returns null when slug is unknown", () => {
    expect(findBySlug(items, "missing")).toBeNull();
    expect(findBySlug([], "flow")).toBeNull();
  });

  it("returns the matching item", () => {
    expect(findBySlug(items, "apex")?.slug).toBe("apex");
  });
});

describe("page meta helpers", () => {
  it("topicPageMeta covers missing and found", () => {
    expect(topicPageMeta(undefined)).toEqual({ title: "Topic not found" });
    expect(topicPageMeta(makeTopic({ slug: "flow", title: "Flow", tagline: "t" }))).toEqual({
      title: "Flow",
      description: "t",
    });
  });

  it("versusPageMeta covers missing and found", () => {
    expect(versusPageMeta(undefined)).toEqual({ title: "Decision not found" });
    expect(
      versusPageMeta({ title: "A vs B", question: "Which?" })
    ).toEqual({ title: "A vs B", description: "Which?" });
  });

  it("pathPageMeta covers missing and found", () => {
    expect(pathPageMeta(undefined)).toEqual({ title: "Path not found" });
    expect(
      pathPageMeta({ title: "Admin", description: "For admins" })
    ).toEqual({ title: "Admin path", description: "For admins" });
  });
});
