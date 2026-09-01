import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Scale } from "lucide-react";
import { versusPages } from "@/data/versus";

export const metadata: Metadata = {
  title: "Decisions",
  description:
    "The recurring 'X vs Y' decisions of the Salesforce platform, answered with a matrix and a rule of thumb instead of a diplomatic 'it depends'.",
};

export default function VersusIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Scale className="size-4" />
        Decisions
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        The questions people actually ask
      </h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Nobody searches &ldquo;what is Flow.&rdquo; They search &ldquo;Flow vs
        Apex trigger.&rdquo; Each page here takes one recurring decision, lays
        out the options in a matrix, and commits to a rule of thumb — saying
        &ldquo;it depends&rdquo; only where it genuinely does, and then saying
        on <em>what</em>.
      </p>

      <ul className="mt-8 space-y-4">
        {versusPages.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/versus/${v.slug}`}
              className="group block rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold group-hover:text-primary">
                  {v.title}
                </h2>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {v.question}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        Each page links back to the full topic dives. If a decision you keep
        having is missing, that is a content bug — the catalog should cover
        the ones that generate Slack threads.
      </p>
    </div>
  );
}
