import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopicMap } from "@/components/topic-map";
import { DecisionList } from "@/components/decision-list";
import { PathJourneys } from "@/components/path-journeys";
import { changes } from "@/data/changes";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <div className="home-shell">
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Free · Independent · No sign-up</p>
        <h1>The five minutes before you touch Setup</h1>
        <p className="hero-description">Plain-English mental models, real trade-offs, common traps, and the official resources worth reading — before you start building.</p>
        <div className="hero-actions"><Button size="lg" asChild><Link href="/versus">Start with a decision <span aria-hidden="true">↗</span></Link></Button><Button size="lg" variant="ghost" asChild><Link href="#atlas">Explore the atlas ↓</Link></Button></div>
        <p className="hero-note">Orientation, not certification.<br />Know the territory. Then build.</p>
      </div>
      <div className="hero-atlas"><TopicMap compact /></div>
    </section>
    <section className="home-section" id="decisions"><div className="section-heading"><div><p className="eyebrow">01 / Choose deliberately</p><h2>Start with a decision</h2></div><p>The questions that show up in Slack.<br />Trade-offs, then a recommendation.</p></div><DecisionList /></section>
    <section className="home-section" id="atlas"><div className="section-heading"><div><p className="eyebrow">02 / See the connections</p><h2>Explore the Salesforce Atlas</h2></div><p>Nine regions. One connected platform.<br />Follow the relationships before the implementation.</p></div><TopicMap /></section>
    <section className="home-section changes-section"><div><p className="eyebrow">Field guide revisions</p><h2>Recently changed</h2><p className="text-muted-foreground">Small corrections. Better decisions.</p></div><ul>{changes.map((change) => <li key={change.topic}><Link href={`/topics/${change.topic}`}><time dateTime={change.date}>{change.date}</time><h3>{change.title} <span aria-hidden="true">↗</span></h3><p>{change.note}</p></Link></li>)}</ul></section>
    <section className="home-section"><div className="section-heading"><div><p className="eyebrow">03 / Find your bearings</p><h2>Choose your path</h2></div><p>Opinionated reading orders.<br />Start where your work starts.</p></div><PathJourneys /></section>
  </div>;
}
