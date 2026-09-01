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

/** Where a capability is in its life: shipped, pre-GA, or renamed/retired. */
export type Lifecycle = "ga" | "beta" | "pilot" | "renamed" | "retired";

/** How you pay for it — deliberately separate from Lifecycle
 *  (Data 360 is both add-on *and* GA; one enum can't say that). */
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
  /** ISO date of the last substantive content review */
  updatedOn: string;
  lifecycle: Lifecycle;
  packaging: Packaging;
  /** e.g. "Add-on SKU. Do not assume it is in Enterprise Edition." */
  editionNote?: string;
}

/** One choice in a versus page. Not every option is a map topic —
 *  "scheduled path" or "Data Import Wizard" have no dive of their own. */
export interface VersusOption {
  label: string;
  /** Topic slug, when a dive exists for this option */
  topic?: string;
}

export interface Versus {
  slug: string;
  /** "Flow vs Apex trigger vs scheduled path" */
  title: string;
  /** The Slack-message form of the decision */
  question: string;
  options: VersusOption[];
  matrix: {
    /** "Record-change, same transaction" */
    criterion: string;
    /** Option label(s); null = "it depends" — say why in the note */
    pick: string | string[] | null;
    note: string;
  }[];
  /** 3–5 bullets */
  ruleOfThumb: string[];
  /** Topic slugs to dive deeper */
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
