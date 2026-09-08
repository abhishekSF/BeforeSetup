import type { Topic } from "@/data/types";
import { siteUrl } from "@/lib/site";

export function TopicSchema({ topic }: { topic: Topic }) {
  const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const url = `${origin}/topics/${topic.slug}`;
  const data = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Article", headline: topic.title, description: topic.tagline, dateModified: topic.updatedOn, mainEntityOfPage: url, author: { "@type": "Organization", name: "BeforeSetup", url: origin } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "BeforeSetup", item: origin },
        { "@type": "ListItem", position: 2, name: "Topics", item: `${origin}/topics` },
        { "@type": "ListItem", position: 3, name: topic.title, item: url },
      ] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
