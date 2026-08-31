import type { CategoryId } from "@/data/types";

export const categoryHex: Record<CategoryId, string> = {
  "data-model": "#3b82f6",
  automation: "#f59e0b",
  code: "#8b5cf6",
  ui: "#ec4899",
  security: "#ef4444",
  integration: "#14b8a6",
  devops: "#22c55e",
  ai: "#f97316",
  strategy: "#64748b",
};

export const categoryBadgeClass: Record<CategoryId, string> = {
  "data-model":
    "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  automation:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  code: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
  ui: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30",
  security:
    "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
  integration:
    "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
  devops:
    "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30",
  ai: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
  strategy:
    "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
};
