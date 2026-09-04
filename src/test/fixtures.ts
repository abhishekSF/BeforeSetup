import type {
  Category,
  LearningPath,
  Topic,
  Versus,
} from "@/data/types";

export function makeTopic(overrides: Partial<Topic> & Pick<Topic, "slug">): Topic {
  return {
    title: overrides.title ?? overrides.slug,
    category: "code",
    tagline: "A tagline",
    mentalModel: ["model"],
    whenToUse: ["use it"],
    whenToAvoid: ["skip it"],
    pitfalls: ["a pitfall"],
    related: [],
    resources: [
      {
        title: "Docs",
        url: "https://example.com/docs",
        source: "Docs",
        level: "intro",
      },
    ],
    updatedOn: "2026-01-01",
    lifecycle: "ga",
    packaging: "core",
    ...overrides,
  };
}

export function makeCategory(
  overrides: Partial<Category> & Pick<Category, "id">
): Category {
  return {
    label: overrides.label ?? overrides.id,
    description: "A category",
    ...overrides,
  };
}

export function makeVersus(overrides: Partial<Versus> & Pick<Versus, "slug">): Versus {
  return {
    title: overrides.title ?? overrides.slug,
    question: "Which one?",
    options: [{ label: "A" }, { label: "B", topic: "flow" }],
    matrix: [
      { criterion: "Simple", pick: "A", note: "because" },
      { criterion: "Hard", pick: ["A", "B"], note: "both" },
      { criterion: "Unclear", pick: null, note: "depends" },
    ],
    ruleOfThumb: ["Prefer A"],
    relatedTopics: [],
    updatedOn: "2026-01-01",
    ...overrides,
  };
}

export function makePath(
  overrides: Partial<LearningPath> & Pick<LearningPath, "slug">
): LearningPath {
  return {
    title: overrides.title ?? overrides.slug,
    audience: "everyone",
    description: "A path",
    steps: [{ topic: "flow", note: "start here" }],
    ...overrides,
  };
}
