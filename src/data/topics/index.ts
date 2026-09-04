import type { Topic } from "../types";
import { lookupMany } from "@/lib/catalog";
import { dataModelTopics } from "./data-model";
import { automationTopics } from "./automation";
import { codeTopics } from "./code";
import { uiTopics } from "./ui";
import { securityTopics } from "./security";
import { integrationTopics } from "./integration";
import { devopsTopics } from "./devops";
import { aiTopics } from "./ai";
import { strategyTopics } from "./strategy";

export const topics: Topic[] = [
  ...dataModelTopics,
  ...automationTopics,
  ...codeTopics,
  ...uiTopics,
  ...securityTopics,
  ...integrationTopics,
  ...devopsTopics,
  ...aiTopics,
  ...strategyTopics,
];

export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));

export function getTopic(slug: string): Topic | undefined {
  return topicBySlug.get(slug);
}

export function relatedTopics(topic: Topic): Topic[] {
  return lookupMany(topic.related, topicBySlug);
}
