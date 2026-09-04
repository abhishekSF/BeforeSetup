import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Scale, Lightbulb } from "lucide-react";
import { versusPages, versusBySlug } from "@/data/versus";
import { topicBySlug } from "@/data/topics";
import { versusPageMeta } from "@/lib/catalog";
import { versusRelatedTopics } from "@/lib/versus";
import { Separator } from "@/components/ui/separator";
import { PickCell } from "@/components/pick-cell";
import { ConnectedTopics, VersusOptions } from "@/components/content-bits";

export function generateStaticParams() {
  return versusPages.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return versusPageMeta(versusBySlug.get(slug));
}

export default async function VersusPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const versus = versusBySlug.get(slug);
  if (versus === undefined) {
    notFound();
  }

  const related = versusRelatedTopics(versus, topicBySlug);

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

      <VersusOptions options={versus.options} />

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

      <ConnectedTopics topics={related} heading="Dive deeper" />

      <p className="mt-10 text-xs text-muted-foreground">
        Last reviewed {versus.updatedOn}. Spot something outdated? The platform
        moves; this page should too.
      </p>
    </article>
  );
}
