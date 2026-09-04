import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/site";

describe("siteUrl", () => {
  it("falls back for missing or empty values", () => {
    expect(siteUrl(undefined)).toBe("http://localhost:4780");
    expect(siteUrl("")).toBe("http://localhost:4780");
  });

  it("returns a provided url", () => {
    expect(siteUrl("https://beforesetup.dev")).toBe("https://beforesetup.dev");
  });
});
