"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Search, X } from "lucide-react";
import { topics } from "@/data/topics";
import { filterTopics } from "@/lib/search";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        trigger.current?.click();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const results = filterTopics(topics, query, null);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger aria-label="Search" ref={trigger} className="search-trigger"><Search aria-hidden="true" size={17} /><span>Search</span><kbd>⌘ K</kbd></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="search-overlay" />
      <Dialog.Content className="search-dialog">
        <div className="flex items-center justify-between gap-4"><Dialog.Title>Find your next five minutes</Dialog.Title><Dialog.Close aria-label="Close search"><X /></Dialog.Close></div>
        <Dialog.Description className="text-sm text-muted-foreground">Search mental models, trade-offs, and pitfalls across the atlas.</Dialog.Description>
        <input aria-label="Search the field guide" placeholder="Try Flow, sharing, or callout…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <p role="status" className="text-sm text-muted-foreground">{results.length} topics found</p>
        <ul className="search-results">{results.map((topic) => <li key={topic.slug}><Dialog.Close asChild><Link href={`/topics/${topic.slug}`}><strong>{topic.title}</strong><span>{topic.tagline}</span></Link></Dialog.Close></li>)}</ul>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
