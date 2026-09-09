import type { MetadataRoute } from "next";
import { joinSitePath, siteUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: joinSitePath(origin, "/sitemap.xml"),
  };
}
