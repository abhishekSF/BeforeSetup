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
import { versusForTopic } from "@/data/versus";
import { categoryById } from "@/data/categories";
import { categoryBadgeClass } from "@/lib/category-colors";
import { topicPageMeta } from "@/lib/catalog";
import { RESOURCE_LEVEL_CLASS } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ConnectedTopics,
  EditionNote,
  LifecycleBadge,
  PackagingBadge,
  RelatedDecisions,
} from "@/components/content-bits";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return topicPageMeta(getTopic(slug));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (topic === undefined) {
    notFound();
  }

  const related = relatedTopics(topic);
  const decisions = versusForTopic(topic.slug);
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

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={categoryBadgeClass[topic.category]}
        >
          {category.label}
        </Badge>
        <LifecycleBadge lifecycle={topic.lifecycle} />
        <PackagingBadge packaging={topic.packaging} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {topic.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        {topic.tagline}
      </p>
      <EditionNote note={topic.editionNote} />

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

      <RelatedDecisions decisions={decisions} />
      <ConnectedTopics topics={related} heading="Connected topics" />

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
                    className={cn("text-xs", RESOURCE_LEVEL_CLASS[r.level])}
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

      <p className="mt-10 text-xs text-muted-foreground">
        Last reviewed {topic.updatedOn}. The platform moves; if this page has
        drifted, the official docs above win.
      </p>
    </article>
  );
}
