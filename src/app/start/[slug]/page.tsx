import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { paths, pathBySlug } from "@/data/paths";
import { getTopic } from "@/data/topics";
import { categoryById } from "@/data/categories";
import { categoryBadgeClass } from "@/lib/category-colors";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return paths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = pathBySlug.get(slug);
  if (!path) return { title: "Path not found" };
  return { title: `${path.title} path`, description: path.description };
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = pathBySlug.get(slug);
  if (!path) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/start"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All paths
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">{path.title} path</h1>
      <p className="mt-1 text-sm text-muted-foreground">{path.audience}</p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {path.description}
      </p>

      <ol className="mt-10 space-y-0">
        {path.steps.map((step, i) => {
          const topic = getTopic(step.topic);
          if (!topic) return null;
          const isLast = i === path.steps.length - 1;
          return (
            <li key={step.topic} className="relative flex gap-4 pb-8">
              {!isLast && (
                <span
                  className="absolute left-[15px] top-9 h-full w-px bg-border"
                  aria-hidden
                />
              )}
              <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card text-sm font-semibold">
                {i + 1}
              </span>
              <Link
                href={`/topics/${topic.slug}`}
                className="group -mt-1 flex-1 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold group-hover:text-primary">
                    {topic.title}
                  </h2>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      categoryBadgeClass[topic.category]
                    )}
                  >
                    {categoryById[topic.category].label}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.note}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Read the dive
                  <ArrowRight className="size-3" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
