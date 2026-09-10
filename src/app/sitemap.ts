import type { MetadataRoute } from "next";
import { paths } from "@/data/paths";
import { topics } from "@/data/topics";
import { versusPages } from "@/data/versus";
import { joinSitePath, siteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return [
    ...["/", "/map", "/topics", "/versus", "/start"].map((path) => ({
      url: joinSitePath(origin, path),
    })),
    ...topics.map((topic) => ({
      url: joinSitePath(origin, `/topics/${topic.slug}`),
      lastModified: topic.updatedOn,
    })),
    ...versusPages.map((page) => ({
      url: joinSitePath(origin, `/versus/${page.slug}`),
      lastModified: page.updatedOn,
    })),
    ...paths.map((path) => ({
      url: joinSitePath(origin, `/start/${path.slug}`),
    })),
  ];
}
