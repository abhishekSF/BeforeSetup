import { describe, expect, it } from "vitest";
import { categories, categoryById } from "@/data/categories";
import { paths, pathBySlug } from "@/data/paths";
import { getTopic, relatedTopics, topicBySlug, topics } from "@/data/topics";
import { versusBySlug, versusForTopic, versusPages } from "@/data/versus";
import {
  duplicateValues,
  hasLongDash,
  hasSalesforceDocsResource,
  httpsUrlError,
  isIsoDate,
} from "@/lib/catalog-invariants";
import { SHORT_LABEL } from "@/lib/topic-map-layout";
import { invalidPickLabels } from "@/lib/versus";

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

  it("gives every category at least one topic", () => {
    for (const category of categories) {
      expect(topics.some((topic) => topic.category === category.id)).toBe(true);
    }
  });
});

describe("topic editorial shape", () => {
  it("keeps related links unique, existent, and not self-referential", () => {
    for (const topic of topics) {
      expect(topic.related).not.toContain(topic.slug);
      expect(duplicateValues(topic.related)).toEqual([]);
      expect(topic.related.length).toBeGreaterThan(0);
    }
  });

  it("fills the five-minute dive fields and an ISO review date", () => {
    for (const topic of topics) {
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.tagline.length).toBeGreaterThan(0);
      expect(topic.mentalModel.length).toBeGreaterThanOrEqual(2);
      expect(topic.mentalModel.length).toBeLessThanOrEqual(3);
      expect(topic.whenToUse.length).toBeGreaterThan(0);
      expect(topic.whenToAvoid.length).toBeGreaterThan(0);
      expect(topic.pitfalls.length).toBeGreaterThan(0);
      expect(isIsoDate(topic.updatedOn)).toBe(true);
    }
  });

  it("requires https resources, unique URLs, and at least one official Salesforce link", () => {
    for (const topic of topics) {
      expect(topic.resources.length).toBeGreaterThan(0);
      const urls = topic.resources.map((resource) => resource.url);
      expect(duplicateValues(urls)).toEqual([]);
      for (const resource of topic.resources) {
        expect(resource.title.length).toBeGreaterThan(0);
        expect(resource.source.length).toBeGreaterThan(0);
        expect(httpsUrlError(resource.url)).toBeNull();
      }
      expect(hasSalesforceDocsResource(topic.resources)).toBe(true);
    }
  });

  it("warns on SKU reality whenever packaging is not core", () => {
    for (const topic of topics) {
      if (topic.packaging === "core") {
        continue;
      }
      expect(topic.editionNote, topic.slug).toBeDefined();
      expect(topic.editionNote?.length).toBeGreaterThan(0);
    }
  });

  it("gives every topic a map short label and no leftover labels", () => {
    const slugs = topics.map((topic) => topic.slug).sort();
    expect(Object.keys(SHORT_LABEL).sort()).toEqual(slugs);
  });
});

describe("versus catalog", () => {
  it("indexes every decision page", () => {
    expect(versusPages.length).toBeGreaterThan(0);
    expect(duplicateValues(versusPages.map((page) => page.slug))).toEqual([]);
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

  it("keeps option labels unique and matrix picks inside that list", () => {
    for (const page of versusPages) {
      const labels = page.options.map((option) => option.label);
      expect(labels.length).toBeGreaterThan(1);
      expect(duplicateValues(labels)).toEqual([]);
      const optionLabels = new Set(labels);
      expect(duplicateValues(page.matrix.map((row) => row.criterion))).toEqual([]);
      for (const row of page.matrix) {
        expect(invalidPickLabels(row.pick, optionLabels)).toEqual([]);
        expect(row.note.length).toBeGreaterThan(0);
      }
      expect(page.ruleOfThumb.length).toBeGreaterThanOrEqual(3);
      expect(page.ruleOfThumb.length).toBeLessThanOrEqual(5);
      expect(duplicateValues(page.relatedTopics)).toEqual([]);
      expect(isIsoDate(page.updatedOn)).toBe(true);
    }
  });
});

function catalogProse(): { path: string; text: string }[] {
  const entries: { path: string; text: string }[] = [];
  for (const topic of topics) {
    entries.push({ path: `${topic.slug}.tagline`, text: topic.tagline });
    topic.mentalModel.forEach((text, index) => {
      entries.push({ path: `${topic.slug}.mentalModel.${index}`, text });
    });
    topic.whenToUse.forEach((text, index) => {
      entries.push({ path: `${topic.slug}.whenToUse.${index}`, text });
    });
    topic.whenToAvoid.forEach((text, index) => {
      entries.push({ path: `${topic.slug}.whenToAvoid.${index}`, text });
    });
    topic.pitfalls.forEach((text, index) => {
      entries.push({ path: `${topic.slug}.pitfalls.${index}`, text });
    });
    if (topic.editionNote !== undefined) {
      entries.push({ path: `${topic.slug}.editionNote`, text: topic.editionNote });
    }
    topic.resources.forEach((resource, index) => {
      entries.push({
        path: `${topic.slug}.resources.${index}.title`,
        text: resource.title,
      });
    });
  }
  for (const category of categories) {
    entries.push({ path: `category.${category.id}`, text: category.description });
    entries.push({ path: `category.${category.id}.label`, text: category.label });
  }
  for (const page of versusPages) {
    entries.push({ path: `versus.${page.slug}.title`, text: page.title });
    entries.push({ path: `versus.${page.slug}.question`, text: page.question });
    page.matrix.forEach((row, index) => {
      entries.push({
        path: `versus.${page.slug}.matrix.${index}.criterion`,
        text: row.criterion,
      });
      entries.push({
        path: `versus.${page.slug}.matrix.${index}.note`,
        text: row.note,
      });
    });
    page.ruleOfThumb.forEach((text, index) => {
      entries.push({ path: `versus.${page.slug}.ruleOfThumb.${index}`, text });
    });
  }
  for (const path of paths) {
    entries.push({ path: `path.${path.slug}.title`, text: path.title });
    entries.push({ path: `path.${path.slug}.audience`, text: path.audience });
    entries.push({ path: `path.${path.slug}.description`, text: path.description });
    path.steps.forEach((step, index) => {
      entries.push({ path: `path.${path.slug}.steps.${index}`, text: step.note });
    });
  }
  return entries;
}

describe("site copy punctuation", () => {
  it("keeps published catalog prose free of em dashes and en dashes", () => {
    const hits = catalogProse()
      .filter((entry) => hasLongDash(entry.text))
      .map((entry) => entry.path);
    expect(hits).toEqual([]);
  });
});

describe("learning paths", () => {
  it("indexes every path and points at real topics", () => {
    expect(paths.length).toBeGreaterThan(0);
    expect(duplicateValues(paths.map((path) => path.slug))).toEqual([]);
    for (const path of paths) {
      expect(pathBySlug.get(path.slug)).toBe(path);
      const stepTopics = path.steps.map((step) => step.topic);
      expect(stepTopics.length).toBeGreaterThan(0);
      expect(duplicateValues(stepTopics)).toEqual([]);
      for (const step of path.steps) {
        expect(getTopic(step.topic)).toBeDefined();
        expect(step.note.length).toBeGreaterThan(0);
      }
    }
  });
});
