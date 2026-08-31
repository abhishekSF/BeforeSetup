import type { Metadata } from "next";
import { TopicBrowser } from "@/components/topic-browser";

export const metadata: Metadata = {
  title: "All topics",
  description:
    "Browse and search every Salesforce quick-dive: data model, automation, Apex, LWC, security, integration, and DevOps.",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">All topics</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Search across titles, mental models, and pitfalls — or filter by area.
      </p>
      <div className="mt-8">
        <TopicBrowser />
      </div>
    </div>
  );
}
