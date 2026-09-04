import Link from "next/link";
import { Scale } from "lucide-react";
import type { Lifecycle, Packaging, Topic, Versus, VersusOption } from "@/data/types";
import { categoryBadgeClass } from "@/lib/category-colors";
import { packagingLabel, showLifecycleBadge } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LifecycleBadge({ lifecycle }: { lifecycle: Lifecycle }) {
  if (!showLifecycleBadge(lifecycle)) {
    return null;
  }
  return (
    <Badge
      variant="outline"
      className="border-amber-500/40 bg-amber-500/10 uppercase text-amber-700 dark:text-amber-300"
    >
      {lifecycle}
    </Badge>
  );
}

export function PackagingBadge({ packaging }: { packaging: Packaging }) {
  const label = packagingLabel(packaging);
  if (label === null) {
    return null;
  }
  return (
    <Badge
      variant="outline"
      className="border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300"
    >
      {label}
    </Badge>
  );
}

export function EditionNote({ note }: { note: string | undefined }) {
  if (note === undefined) {
    return null;
  }
  return (
    <p className="mt-4 rounded-lg border border-sky-500/30 bg-sky-500/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      <span className="font-medium text-foreground">Licensing reality:</span>{" "}
      {note}
    </p>
  );
}

export function RelatedDecisions({ decisions }: { decisions: Versus[] }) {
  if (decisions.length === 0) {
    return null;
  }
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Scale className="size-5 text-primary" />
        Related decisions
      </h2>
      <ul className="mt-3 space-y-2">
        {decisions.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/versus/${v.slug}`}
              className="group flex items-start justify-between gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div>
                <span className="text-sm font-medium group-hover:text-primary">
                  {v.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {v.question}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ConnectedTopics({
  topics,
  heading,
}: {
  topics: Topic[];
  heading: string;
}) {
  if (topics.length === 0) {
    return null;
  }
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {topics.map((item) => (
          <Link key={item.slug} href={`/topics/${item.slug}`}>
            <Badge
              variant="outline"
              className={cn(
                "text-sm transition-colors hover:bg-accent",
                categoryBadgeClass[item.category]
              )}
            >
              {item.title}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function VersusOptions({ options }: { options: VersusOption[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {options.map((option) => {
        if (option.topic === undefined) {
          return (
            <Badge key={option.label} variant="outline" className="text-sm">
              {option.label}
            </Badge>
          );
        }
        return (
          <Link key={option.label} href={`/topics/${option.topic}`}>
            <Badge
              variant="outline"
              className="text-sm transition-colors hover:bg-accent"
            >
              {option.label}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
