import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { topics } from "@/data/topics";
import { versusPages } from "@/data/versus";
import { paths } from "@/data/paths";
import { siteUrl } from "@/lib/site";

describe("sitemap and robots routes", () => {
  it("lists every topic, decision, and path under the current site URL", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
    expect(urls).toContain(`${origin}/`);
    expect(urls).toContain(`${origin}/map`);
    for (const topic of topics) {
      expect(urls).toContain(`${origin}/topics/${topic.slug}`);
    }
    for (const page of versusPages) {
      expect(urls).toContain(`${origin}/versus/${page.slug}`);
    }
    for (const path of paths) {
      expect(urls).toContain(`${origin}/start/${path.slug}`);
    }
    expect(urls).toHaveLength(5 + topics.length + versusPages.length + paths.length);
  });

  it("points crawlers at the sitemap", () => {
    const origin = siteUrl(process.env.NEXT_PUBLIC_SITE_URL);
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${origin}/sitemap.xml`,
    });
  });
});
