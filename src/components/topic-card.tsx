import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Topic } from "@/data/types";
import { categoryById } from "@/data/categories";
import { categoryBadgeClass } from "@/lib/category-colors";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{topic.title}</h3>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {topic.tagline}
      </p>
      <div className="mt-auto pt-1">
        <Badge
          variant="outline"
          className={cn("text-xs", categoryBadgeClass[topic.category])}
        >
          {categoryById[topic.category].label}
        </Badge>
      </div>
    </Link>
  );
}
