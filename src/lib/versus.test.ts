import { describe, expect, it } from "vitest";
import {
  invalidPickLabels,
  pickValues,
  versusForTopic,
  versusRelatedTopics,
} from "@/lib/versus";
import { makeTopic, makeVersus } from "@/test/fixtures";

const pages = [
  makeVersus({
    slug: "related-only",
    relatedTopics: ["soql"],
    options: [
      { label: "Flow", topic: "flow" },
      { label: "Neither" },
    ],
  }),
  makeVersus({
    slug: "option-only",
    relatedTopics: ["apex"],
    options: [
      { label: "Trigger", topic: "apex-triggers" },
      { label: "Other", topic: "flow" },
    ],
  }),
];

describe("versusForTopic", () => {
  it("matches relatedTopics even when the option list does not mention the slug", () => {
    expect(versusForTopic(pages, "soql").map((v) => v.slug)).toEqual([
      "related-only",
    ]);
  });

  it("matches an option topic even when relatedTopics does not mention it", () => {
    expect(versusForTopic(pages, "apex-triggers").map((v) => v.slug)).toEqual([
      "option-only",
    ]);
  });

  it("does not require every option to match", () => {
    expect(versusForTopic(pages, "flow").map((v) => v.slug).sort()).toEqual([
      "option-only",
      "related-only",
    ]);
  });

  it("returns empty when nothing matches", () => {
    expect(versusForTopic(pages, "missing")).toEqual([]);
    expect(versusForTopic([], "flow")).toEqual([]);
  });
});

describe("pickValues", () => {
  it("normalizes null, string, and array picks", () => {
    expect(pickValues(null)).toBeNull();
    expect(pickValues("Flow")).toEqual(["Flow"]);
    expect(pickValues(["A", "B"])).toEqual(["A", "B"]);
    expect(pickValues([])).toEqual([]);
  });
});

describe("invalidPickLabels", () => {
  const labels = new Set(["Before-save flow", "Apex trigger"]);

  it("returns nothing for it-depends or labels that exist", () => {
    expect(invalidPickLabels(null, labels)).toEqual([]);
    expect(invalidPickLabels("Apex trigger", labels)).toEqual([]);
    expect(invalidPickLabels(["Before-save flow", "Apex trigger"], labels)).toEqual(
      []
    );
    expect(invalidPickLabels([], labels)).toEqual([]);
  });

  it("returns labels that are not options", () => {
    expect(invalidPickLabels("Scheduled flow", labels)).toEqual(["Scheduled flow"]);
    expect(invalidPickLabels(["Apex trigger", "Batch Apex"], labels)).toEqual([
      "Batch Apex",
    ]);
  });
});

describe("versusRelatedTopics", () => {
  it("resolves existing slugs only", () => {
    const flow = makeTopic({ slug: "flow" });
    const dict = new Map([["flow", flow]]);
    const versus = makeVersus({
      slug: "x",
      relatedTopics: ["flow", "missing"],
    });
    expect(versusRelatedTopics(versus, dict)).toEqual([flow]);
    expect(
      versusRelatedTopics(makeVersus({ slug: "empty", relatedTopics: [] }), dict)
    ).toEqual([]);
  });
});
