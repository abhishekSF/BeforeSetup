import { describe, expect, it } from "vitest";
import {
  packagingLabel,
  RESOURCE_LEVEL_CLASS,
  showLifecycleBadge,
} from "@/lib/labels";

describe("packagingLabel", () => {
  it("returns null for core and a label otherwise", () => {
    expect(packagingLabel("core")).toBeNull();
    expect(packagingLabel("edition-gated")).toBe("Edition-gated");
    expect(packagingLabel("add-on")).toBe("Add-on SKU");
    expect(packagingLabel("consumption")).toBe("Consumption-priced");
  });
});

describe("showLifecycleBadge", () => {
  it("hides GA and shows everything else", () => {
    expect(showLifecycleBadge("ga")).toBe(false);
    expect(showLifecycleBadge("beta")).toBe(true);
    expect(showLifecycleBadge("pilot")).toBe(true);
    expect(showLifecycleBadge("renamed")).toBe(true);
    expect(showLifecycleBadge("retired")).toBe(true);
  });
});

describe("RESOURCE_LEVEL_CLASS", () => {
  it("has a class for every resource level", () => {
    expect(RESOURCE_LEVEL_CLASS.intro).toContain("green");
    expect(RESOURCE_LEVEL_CLASS.practical).toContain("blue");
    expect(RESOURCE_LEVEL_CLASS.deep).toContain("violet");
  });
});
