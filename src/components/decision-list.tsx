import Link from "next/link";
import { versusPages } from "@/data/versus";

export function DecisionList() {
  return <ul className="decision-list">{versusPages.map((decision, index) => <li key={decision.slug}>
    <Link href={`/versus/${decision.slug}`}>
      <span className="decision-index">D / 0{index + 1}</span>
      <div><h3>{decision.question}</h3><div className="decision-options">{decision.options.map((option) => <span key={option.label}>{option.label}</span>)}</div></div>
      <span className="decision-arrow" aria-hidden="true">↗</span>
    </Link>
  </li>)}</ul>;
}
