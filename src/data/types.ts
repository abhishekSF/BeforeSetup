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
  /** One-sentence answer to "what is this?" */
  tagline: string;
  /** Plain-English mental model, 2–3 short paragraphs */
  mentalModel: string[];
  whenToUse: string[];
  whenToAvoid: string[];
  pitfalls: string[];
  /** Slugs of related topics */
  related: string[];
  resources: Resource[];
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
