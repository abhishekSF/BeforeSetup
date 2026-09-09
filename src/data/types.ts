export type CategoryId =
  | "data-model"
  | "automation"
  | "code"
  | "ui"
  | "security"
  | "integration"
  | "devops"
  | "ai"
  | "strategy";

export type ResourceLevel = "intro" | "practical" | "deep";

export type Lifecycle = "ga" | "beta" | "pilot" | "renamed" | "retired";

export type Packaging = "core" | "edition-gated" | "add-on" | "consumption";

export interface Resource {
  title: string;
  url: string;
  source: string;
  level: ResourceLevel;
}

export interface Topic {
  slug: string;
  title: string;
  category: CategoryId;
  tagline: string;
  mentalModel: string[];
  whenToUse: string[];
  whenToAvoid: string[];
  pitfalls: string[];
  related: string[];
  resources: Resource[];
  updatedOn: string;
  lifecycle: Lifecycle;
  packaging: Packaging;
  editionNote?: string;
}

export interface VersusOption {
  label: string;
  topic?: string;
}

export interface Versus {
  slug: string;
  title: string;
  question: string;
  options: VersusOption[];
  matrix: {
    criterion: string;
    pick: string | string[] | null;
    note: string;
  }[];
  ruleOfThumb: string[];
  relatedTopics: string[];
  updatedOn: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  audience: string;
  description: string;
  steps: { topic: string; note: string }[];
}
