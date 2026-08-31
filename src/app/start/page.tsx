import type { Metadata } from "next";
import Link from "next/link";
import { paths } from "@/data/paths";

export const metadata: Metadata = {
  title: "Start here",
  description:
    "Opinionated reading orders through the Salesforce topic map for admins and developers.",
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Start here</h1>
      <p className="mt-2 text-muted-foreground">
        The map is browsable in any order, but order helps when everything is
        new. Pick the path that matches how you build.
      </p>
      <div className="mt-8 grid gap-4">
        {paths.map((p) => (
          <Link
            key={p.slug}
            href={`/start/${p.slug}`}
            className="group rounded-xl border bg-card p-6 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary">
              {p.title} →
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.audience}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {p.description}
            </p>
            <p className="mt-3 text-sm font-medium text-primary">
              {p.steps.length} topics in order
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
