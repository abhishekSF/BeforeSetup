import type { Metadata } from "next";
import { DecisionList } from "@/components/decision-list";
import { Scale } from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/versus" },
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

      <DecisionList />
    </div>
  );
}
