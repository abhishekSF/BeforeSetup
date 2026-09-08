import type { Metadata } from "next";
import { PathJourneys } from "@/components/path-journeys";

export const metadata: Metadata = {
  alternates: { canonical: "/start" },
  title: "Start here",
  description:
    "Opinionated reading orders through the BeforeSetup field guide for admins, developers, architects, consultants, and AI builders.",
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Start here</h1>
      <p className="mt-2 text-muted-foreground">
        The map is browsable in any order, but order helps when everything is
        new. Pick the path that matches how you build.
      </p>
      <h2 className="sr-only">Choose your path</h2>
      <PathJourneys />
    </div>
  );
}
