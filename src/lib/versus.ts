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

export function versusRelatedTopics(
  versus: Versus,
  topicBySlug: Map<string, Topic>
): Topic[] {
  return lookupMany(versus.relatedTopics, topicBySlug);
}
