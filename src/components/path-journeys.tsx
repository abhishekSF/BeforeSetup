import Link from "next/link";
import { paths } from "@/data/paths";
import { topicBySlug } from "@/data/topics";
import { categoryHex } from "@/lib/category-colors";

export function PathJourneys() {
  return <ol className="path-journeys">{paths.map((path, index) => <li key={path.slug}>
    <Link href={`/start/${path.slug}`}>
      <span className="journey-index">0{index + 1}</span>
      <div><h3>{path.title}</h3><p>{path.audience}</p>
        <div className="journey-stops" aria-hidden="true">{path.steps.map((step) => <span key={step.topic} style={{ background: categoryHex[topicBySlug.get(step.topic)!.category] }} />)}</div>
      </div>
      <span className="journey-count">{path.steps.length} stops <span aria-hidden="true">↗</span></span>
    </Link>
  </li>)}</ol>;
}
