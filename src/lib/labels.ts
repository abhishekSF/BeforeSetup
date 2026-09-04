import type { Packaging, ResourceLevel } from "@/data/types";

const PACKAGING_LABELS: Record<Exclude<Packaging, "core">, string> = {
  "edition-gated": "Edition-gated",
  "add-on": "Add-on SKU",
  consumption: "Consumption-priced",
};

export function packagingLabel(packaging: Packaging): string | null {
  if (packaging === "core") {
    return null;
  }
  return PACKAGING_LABELS[packaging];
}

export function showLifecycleBadge(lifecycle: string): boolean {
  return lifecycle !== "ga";
}

export const RESOURCE_LEVEL_CLASS: Record<ResourceLevel, string> = {
  intro:
    "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30",
  practical:
    "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  deep: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
};
