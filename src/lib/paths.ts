import type { LearningPath, Topic } from "@/data/types";

interface ResolvedPathStep {
  topic: Topic;
  note: string;
  index: number;
  isLast: boolean;
}

export function resolvePathSteps(
  path: LearningPath,
  topicBySlug: Map<string, Topic>
): ResolvedPathStep[] {
  const steps: ResolvedPathStep[] = [];
  const lastIndex = path.steps.length - 1;
  for (let i = 0; i < path.steps.length; i += 1) {
    const step = path.steps[i];
    const topic = topicBySlug.get(step.topic);
    if (topic === undefined) {
      continue;
    }
    steps.push({
      topic,
      note: step.note,
      index: i,
      isLast: i === lastIndex,
    });
  }
  return steps;
}
