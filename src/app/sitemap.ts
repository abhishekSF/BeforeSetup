import type { MetadataRoute } from "next";
import { paths } from "@/data/paths";
import { topics } from "@/data/topics";
import { versusPages } from "@/data/versus";
import { sitemapUrls, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return sitemapUrls(
    origin,
    topics.map((topic) => topic.slug),
    versusPages.map((page) => page.slug),
    paths.map((path) => path.slug)
  ).map((url) => ({ url }));
}
