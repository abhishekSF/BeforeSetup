import Link from "next/link";
import { Map, Compass, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopicMap } from "@/components/topic-map";
import { topics } from "@/data/topics";
import { paths } from "@/data/paths";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          Free · No sign-up · No badges
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          The map of the Salesforce platform
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {topics.length} quick dives into the topics every Salesforce builder
          needs — from objects and Apex to Agentforce, Data 360, Headless 360,
          and Claudeforce. A plain-English mental model, when to use it, where
          it bites, and the best links to go deeper. Orientation in five
          minutes — then back to work.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/map">
              <Map className="size-4" />
              Explore the map
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/start">Start here paths</Link>
          </Button>
        </div>
      </section>

      {/* The map itself */}
      <section className="pb-16">
        <TopicMap />
      </section>

      {/* What this is / isn't */}
      <section className="grid gap-6 pb-16 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <Compass className="mb-3 size-6 text-primary" />
          <h2 className="font-semibold">Orientation, not certification</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Trailhead teaches you how, step by step, with badges. OrgAtlas
            answers the question that comes first: what is this thing, how does
            it connect, and do I even need it?
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Zap className="mb-3 size-6 text-primary" />
          <h2 className="font-semibold">Five-minute dives</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Every topic follows the same shape: mental model, when to use it,
            when to avoid it, and the pitfalls that generate real support
            tickets. Read one on the way into a meeting.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <BookOpen className="mb-3 size-6 text-primary" />
          <h2 className="font-semibold">Curated onward links</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Each dive ends with the best official docs, Trailhead modules, and
            community resources — labeled intro, practical, or deep — so the
            next step is always one click away.
          </p>
        </div>
      </section>

      {/* Paths */}
      <section className="pb-20">
        <h2 className="text-2xl font-bold tracking-tight">
          Not sure where to begin?
        </h2>
        <p className="mt-1.5 text-muted-foreground">
          Opinionated reading orders through the map — for admins, developers,
          architects, consultants, and anyone tracking the AI wave.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => (
            <Link
              key={p.slug}
              href={`/start/${p.slug}`}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <h3 className="font-semibold group-hover:text-primary">
                {p.title} →
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.audience}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <p className="mt-3 text-xs font-medium text-primary">
                {p.steps.length} topics in order
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
