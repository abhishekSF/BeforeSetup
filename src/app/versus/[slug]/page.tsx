import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale, Lightbulb } from "lucide-react";
import { versusPages, versusBySlug } from "@/data/versus";
import { getTopic } from "@/data/topics";
import { categoryBadgeClass } from "@/lib/category-colors";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return versusPages.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const versus = versusBySlug.get(slug);
  if (!versus) return { title: "Decision not found" };
  return { title: versus.title, description: versus.question };
}

function PickCell({ pick }: { pick: string | string[] | null }) {
  if (pick === null) {
    return (
      <span className="inline-flex rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
        It depends
      </span>
    );
  }
  const picks = Array.isArray(pick) ? pick : [pick];
  return (
    <span className="flex flex-wrap gap-1.5">
      {picks.map((p) => (
        <span
          key={p}
          className="inline-flex rounded-md border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300"
        >
          {p}
        </span>
      ))}
    </span>
  );
}

export default async function VersusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const versus = versusBySlug.get(slug);
  if (!versus) notFound();

  const related = versus.relatedTopics
    .map((s) => getTopic(s))
    .filter((t) => t !== undefined);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/versus"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All decisions
      </Link>

      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Scale className="size-4" />
        Decision
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {versus.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        {versus.question}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {versus.options.map((o) =>
          o.topic ? (
            <Link key={o.label} href={`/topics/${o.topic}`}>
              <Badge
                variant="outline"
                className="text-sm transition-colors hover:bg-accent"
              >
                {o.label}
              </Badge>
            </Link>
          ) : (
            <Badge key={o.label} variant="outline" className="text-sm">
              {o.label}
            </Badge>
          )
        )}
      </div>

      <Separator className="my-8" />

      <section>
        <h2 className="text-xl font-semibold">The matrix</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Find your situation in the left column. Green means a committed
          answer; amber means the honest answer is a trade-off — the note says
          on what.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold">Your situation</th>
                <th className="px-4 py-3 font-semibold">Pick</th>
                <th className="px-4 py-3 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody>
              {versus.matrix.map((row) => (
                <tr key={row.criterion} className="border-b last:border-b-0">
                  <td className="px-4 py-3.5 align-top font-medium">
                    {row.criterion}
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <PickCell pick={row.pick} />
                  </td>
                  <td className="px-4 py-3.5 align-top leading-relaxed text-muted-foreground">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-primary/25 bg-primary/5 p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Lightbulb className="size-5 text-primary" />
          Rule of thumb
        </h2>
        <ul className="mt-3 space-y-2.5">
          {versus.ruleOfThumb.map((r, i) => (
            <li key={i} className="text-sm leading-relaxed text-foreground/90">
              {r}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Dive deeper</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((t) => (
              <Link key={t.slug} href={`/topics/${t.slug}`}>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm transition-colors hover:bg-accent",
                    categoryBadgeClass[t.category]
                  )}
                >
                  {t.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        Last reviewed {versus.updatedOn}. Spot something outdated? The platform
        moves; this page should too.
      </p>
    </article>
  );
}
