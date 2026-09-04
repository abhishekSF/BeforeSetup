import type { Topic } from "@/data/types";

/** Collect values that exist in `dict` for each key, in key order. */
export function lookupMany<T>(
  keys: readonly string[],
  dict: Map<string, T>
): T[] {
  const found: T[] = [];
  for (const key of keys) {
    const item = dict.get(key);
    if (item !== undefined) {
      found.push(item);
    }
  }
  return found;
}

export function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string
): T | null {
  for (const item of items) {
    if (item.slug === slug) {
      return item;
    }
  }
  return null;
}

export function topicPageMeta(topic: Topic | undefined): {
  title: string;
  description?: string;
} {
  if (topic === undefined) {
    return { title: "Topic not found" };
  }
  return { title: topic.title, description: topic.tagline };
}

export function versusPageMeta(versus: { title: string; question: string } | undefined): {
  title: string;
  description?: string;
} {
  if (versus === undefined) {
    return { title: "Decision not found" };
  }
  return { title: versus.title, description: versus.question };
}

export function pathPageMeta(
  path: { title: string; description: string } | undefined
): { title: string; description?: string } {
  if (path === undefined) {
    return { title: "Path not found" };
  }
  return { title: `${path.title} path`, description: path.description };
}
