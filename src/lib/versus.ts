import type { Topic, Versus } from "@/data/types";
import { lookupMany } from "@/lib/catalog";

export function versusForTopic(
  pages: readonly Versus[],
  slug: string
): Versus[] {
  return pages.filter(
    (page) =>
      page.relatedTopics.includes(slug) ||
      page.options.some((option) => option.topic === slug)
  );
}

/** `null` means "it depends"; otherwise a list of committed picks. */
export function pickValues(pick: string | string[] | null): string[] | null {
  if (pick === null) {
    return null;
  }
  if (Array.isArray(pick)) {
    return pick;
  }
  return [pick];
}

/** Pick labels that are not in the versus option list. Empty when it depends. */
export function invalidPickLabels(
  pick: string | string[] | null,
  optionLabels: ReadonlySet<string>
): string[] {
  const values = pickValues(pick);
  if (values === null) {
    return [];
  }
  const invalid: string[] = [];
  for (const value of values) {
    if (!optionLabels.has(value)) {
      invalid.push(value);
    }
  }
  return invalid;
}

export function versusRelatedTopics(
  versus: Versus,
  topicBySlug: Map<string, Topic>
): Topic[] {
  return lookupMany(versus.relatedTopics, topicBySlug);
}
