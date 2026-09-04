"use client";

import { useMemo, useState } from "react";
import { SearchX, Search } from "lucide-react";
import { topics } from "@/data/topics";
import { categories } from "@/data/categories";
import type { CategoryId } from "@/data/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/topic-card";
import { categoryBadgeClass } from "@/lib/category-colors";
import { filterTopics } from "@/lib/search";
import { cn } from "@/lib/utils";

export function TopicBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | null>(null);

  const results = useMemo(
    () => filterTopics(topics, query, category),
    [query, category]
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics — try 'bulk', 'sharing', 'callout'…"
          className="h-11 pl-9"
          aria-label="Search topics"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by area">
        <Badge
          variant={category === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setCategory(null)}
        >
          All ({topics.length})
        </Badge>
        {categories.map((c) => (
          <Badge
            key={c.id}
            variant="outline"
            data-category={c.id}
            className={cn(
              "cursor-pointer",
              category === c.id
                ? categoryBadgeClass[c.id] + " ring-1 ring-current"
                : "text-muted-foreground"
            )}
            onClick={() => setCategory(category === c.id ? null : c.id)}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium">No topics match that search</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a broader term like &ldquo;flow&rdquo;, &ldquo;apex&rdquo;, or
              &ldquo;security&rdquo; — or clear the filters.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <TopicCard key={t.slug} topic={t} />
          ))}
        </div>
      )}
    </div>
  );
}
