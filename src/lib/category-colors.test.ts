import { describe, expect, it } from "vitest";
import { categoryBadgeClass, categoryHex } from "@/lib/category-colors";
import { categories } from "@/data/categories";

describe("category colors", () => {
  it("defines a hex and badge class for every category", () => {
    for (const category of categories) {
      expect(categoryHex[category.id]).toMatch(/^#/);
      expect(categoryBadgeClass[category.id].length).toBeGreaterThan(0);
    }
  });
});
