import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { topics, getTopic, relatedTopics } from "@/data/topics";
import { categoryById } from "@/data/categories";
import { categoryBadgeClass } from "@/lib/category-colors";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ResourceLevel } from "@/data/types";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: "Topic not found" };
  return { title: topic.title, description: topic.tagline };
}

const levelStyles: Record<ResourceLevel, string> = {
  intro: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30",
  practical: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  deep: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
};

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const related = relatedTopics(topic);
  const category = categoryById[topic.category];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/map"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the map
      </Link>

      <Badge
        variant="outline"
        className={cn("mb-3", categoryBadgeClass[topic.category])}
      >
        {category.label}
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {topic.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        {topic.tagline}
      </p>

      <Separator className="my-8" />

      <section>
        <h2 className="text-xl font-semibold">The mental model</h2>
        <div className="mt-3 space-y-4">
          {topic.mentalModel.map((p, i) => (
            <p key={i} className="leading-relaxed text-foreground/90">
              {p}
            </p>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            Reach for it when
          </h2>
          <ul className="mt-3 space-y-2.5">
            {topic.whenToUse.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <XCircle className="size-5 text-red-600 dark:text-red-400" />
            Think twice when
          </h2>
          <ul className="mt-3 space-y-2.5">
            {topic.whenToAvoid.map((item, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
          Pitfalls that generate real tickets
        </h2>
        <ul className="mt-3 space-y-3">
          {topic.pitfalls.map((item, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Connected topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/topics/${r.slug}`}>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm transition-colors hover:bg-accent",
                    categoryBadgeClass[r.category]
                  )}
                >
                  {r.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Go deeper</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Curated links, labeled by depth. Official docs are always the source
          of truth.
        </p>
        <ul className="mt-4 space-y-3">
          {topic.resources.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div>
                  <span className="text-sm font-medium group-hover:text-primary">
                    {r.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {r.source}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", levelStyles[r.level])}
                  >
                    {r.level}
                  </Badge>
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
