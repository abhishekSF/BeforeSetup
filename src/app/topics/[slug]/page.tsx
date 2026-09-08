import type { Metadata } from "next";
import { TopicSchema } from "@/components/topic-schema";
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
  const meta = topicPageMeta(getTopic(slug));
  return { ...meta, alternates: { canonical: `/topics/${slug}` }, openGraph: { title: meta.title, description: meta.description, url: `/topics/${slug}` } };
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
    <article className="topic-article mx-auto max-w-3xl px-4 py-10">
      <TopicSchema topic={topic} />
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
      <p className="review-line">Last substantively reviewed <time dateTime={topic.updatedOn}>{topic.updatedOn}</time> · {topic.lifecycle} · {topic.packaging}</p>
      <EditionNote note={topic.editionNote} />
      {topic.reviewNote && <aside className="mt-4 border-l-2 border-amber-400/60 pl-4 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Review note:</strong> {topic.reviewNote}</aside>}
      <nav className="article-rail" aria-label="On this page"><a href="#mental-model">Mental model</a><a href="#reach-for">Reach for it</a><a href="#think-twice">Think twice</a><a href="#pitfalls">Pitfalls</a><a href="#resources">Resources</a></nav>

      <Separator className="my-8" />

      <section id="mental-model">
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
        <section id="reach-for" className="article-note rounded-xl border bg-card p-5">
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

        <section id="think-twice" className="article-note rounded-xl border bg-card p-5">
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

      <section id="pitfalls" className="article-note mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
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

      <section id="resources" className="mt-10">
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
                className="resource-link group flex items-start justify-between gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div>
                  <span className="text-sm font-medium group-hover:text-primary">
                    {r.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {r.source} · {r.kind}
                  </span>
                  <span className="resource-trust">{r.official ? "Official" : "Community"} · {r.verifiedOn ? `Source reviewed ${r.verifiedOn}` : "Source review pending"}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", RESOURCE_LEVEL_CLASS[r.level])}
                  >
                    {r.level}
                  </Badge>
                  <ExternalLink aria-hidden="true" className="size-3.5 text-muted-foreground" /><span className="sr-only">Opens in a new tab</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <a className="mt-8 inline-flex min-h-11 items-center text-sm text-primary" href={`https://github.com/abhishekSF/BeforeSetup/issues/new?title=${encodeURIComponent(`Outdated information: ${topic.title}`)}`}>Report outdated information ↗</a>
      <p className="mt-10 text-xs text-muted-foreground">
        Last reviewed {topic.updatedOn}. The platform moves; if this page has
        drifted, the official docs above win.
      </p>
    </article>
  );
}
