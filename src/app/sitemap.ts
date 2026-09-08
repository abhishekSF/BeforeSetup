import type { MetadataRoute } from "next";
import { topics } from "@/data/topics";
import { paths } from "@/data/paths";
import { versusPages } from "@/data/versus";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return [
    ...["", "/topics", "/versus", "/map", "/start"].map((path) => ({ url: `${origin}${path}` })),
    ...topics.map((topic) => ({ url: `${origin}/topics/${topic.slug}`, lastModified: topic.updatedOn })),
    ...versusPages.map((page) => ({ url: `${origin}/versus/${page.slug}`, lastModified: page.updatedOn })),
    ...paths.map((path) => ({ url: `${origin}/start/${path.slug}` })),
  ];
}
