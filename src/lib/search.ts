import type { CategoryId, Topic } from "@/data/types";

export function haystackFor(topic: Topic): string {
  return [
    topic.title,
    topic.tagline,
    ...topic.mentalModel,
    ...topic.pitfalls,
    ...topic.whenToUse,
  ]
    .join(" ")
    .toLowerCase();
}

export function queryWords(query: string): string[] {
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length === 0) {
    return [];
  }
  return trimmed.split(/\s+/);
}

export function topicMatches(
  topic: Topic,
  query: string,
  category: CategoryId | null
): boolean {
  if (category !== null && topic.category !== category) {
    return false;
  }
  const words = queryWords(query);
  const haystack = haystackFor(topic);
  return words.every((word) => haystack.includes(word));
}

export function filterTopics(
  allTopics: readonly Topic[],
  query: string,
  category: CategoryId | null
): Topic[] {
  return allTopics.filter((topic) => topicMatches(topic, query, category));
}
