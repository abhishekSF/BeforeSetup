import type { Metadata } from "next";
import { TopicMap } from "@/components/topic-map";

export const metadata: Metadata = {
  title: "Topic map",
  description:
    "An interactive map of the Salesforce platform: 36 topics across data model, automation, code, UI, security, integration, DevOps, AI & agents, and architecture & strategy — with the connections between them.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">The topic map</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Every core platform topic, grouped by area, with lines showing what
        connects to what. Hover to see how a topic relates to its neighbors —
        click to dive in.
      </p>
      <div className="mt-8">
        <TopicMap />
      </div>
    </div>
  );
}
