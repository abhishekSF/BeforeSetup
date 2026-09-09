import { describe, expect, it } from "vitest";
import {
  CANONICAL_SITE_URL,
  joinSitePath,
  sitemapUrls,
  siteUrl,
} from "@/lib/site";

describe("siteUrl", () => {
  it("falls back for missing or empty values outside production", () => {
    expect(siteUrl(undefined, "test")).toBe("http://localhost:4780");
    expect(siteUrl("", "development")).toBe("http://localhost:4780");
    expect(siteUrl(undefined, undefined)).toBe("http://localhost:4780");
  });

  it("uses the GitHub Pages URL in production when unset", () => {
    expect(siteUrl(undefined, "production")).toBe(CANONICAL_SITE_URL);
    expect(siteUrl("", "production")).toBe(CANONICAL_SITE_URL);
  });

  it("returns a provided url in any environment", () => {
    expect(siteUrl("https://beforesetup.dev")).toBe("https://beforesetup.dev");
    expect(siteUrl("https://beforesetup.dev", "production")).toBe(
      "https://beforesetup.dev"
    );
  });
});

describe("joinSitePath", () => {
  it("strips a trailing slash on the origin and prefixes the path", () => {
    expect(joinSitePath("https://x.example", "/a")).toBe("https://x.example/a");
    expect(joinSitePath("https://x.example/", "/a")).toBe("https://x.example/a");
    expect(joinSitePath("https://x.example", "a")).toBe("https://x.example/a");
    expect(joinSitePath("https://x.example/", "a")).toBe("https://x.example/a");
  });

  it("keeps a single slash for the site root", () => {
    expect(joinSitePath("https://x.example", "")).toBe("https://x.example/");
    expect(joinSitePath("https://x.example", "/")).toBe("https://x.example/");
    expect(joinSitePath("https://x.example/", "/")).toBe("https://x.example/");
  });
});

describe("sitemapUrls", () => {
  it("lists static routes then topic, versus, and path URLs", () => {
    expect(
      sitemapUrls("https://abhisheksf.github.io/BeforeSetup", ["flow"], ["a-vs-b"], [
        "admin",
      ])
    ).toEqual([
      "https://abhisheksf.github.io/BeforeSetup/",
      "https://abhisheksf.github.io/BeforeSetup/map",
      "https://abhisheksf.github.io/BeforeSetup/topics",
      "https://abhisheksf.github.io/BeforeSetup/versus",
      "https://abhisheksf.github.io/BeforeSetup/start",
      "https://abhisheksf.github.io/BeforeSetup/topics/flow",
      "https://abhisheksf.github.io/BeforeSetup/versus/a-vs-b",
      "https://abhisheksf.github.io/BeforeSetup/start/admin",
    ]);
  });

  it("still emits the five static routes when catalogs are empty", () => {
    expect(sitemapUrls("https://x.example", [], [], [])).toEqual([
      "https://x.example/",
      "https://x.example/map",
      "https://x.example/topics",
      "https://x.example/versus",
      "https://x.example/start",
    ]);
  });
});
