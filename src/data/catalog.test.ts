import { describe, expect, it } from "vitest";
import { categories, categoryById } from "@/data/categories";
import { paths, pathBySlug } from "@/data/paths";
import { getTopic, relatedTopics, topicBySlug, topics } from "@/data/topics";
import { versusBySlug, versusForTopic, versusPages } from "@/data/versus";

describe("topic catalog", () => {
  it("has unique slugs and a working lookup", () => {
    const slugs = topics.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getTopic("flow")?.title).toBe("Flow");
    expect(getTopic("does-not-exist")).toBeUndefined();
    expect(topicBySlug.get("flow")).toBe(getTopic("flow"));
  });

  it("resolves related topics and drops nothing that exists", () => {
    for (const topic of topics) {
      const related = relatedTopics(topic);
      expect(related).toHaveLength(topic.related.length);
      for (const rel of related) {
        expect(topic.related).toContain(rel.slug);
      }
    }
  });

  it("keeps every topic in a known category", () => {
    for (const topic of topics) {
      expect(categoryById[topic.category].id).toBe(topic.category);
    }
    expect(categories).toHaveLength(9);
  });
});

describe("versus catalog", () => {
  it("indexes every decision page", () => {
    expect(versusPages.length).toBeGreaterThan(0);
    for (const page of versusPages) {
      expect(versusBySlug.get(page.slug)).toBe(page);
      for (const option of page.options) {
        if (option.topic !== undefined) {
          expect(getTopic(option.topic)).toBeDefined();
        }
      }
      for (const slug of page.relatedTopics) {
        expect(getTopic(slug)).toBeDefined();
      }
    }
  });

  it("versusForTopic finds pages by option or related slug", () => {
    const forFlow = versusForTopic("flow");
    expect(forFlow.length).toBeGreaterThan(0);
    expect(versusForTopic("no-such-topic")).toEqual([]);
  });
});

describe("learning paths", () => {
  it("indexes every path and points at real topics", () => {
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(pathBySlug.get(path.slug)).toBe(path);
      for (const step of path.steps) {
        expect(getTopic(step.topic)).toBeDefined();
      }
    }
  });
});
