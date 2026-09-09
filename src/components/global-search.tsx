"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Search, X } from "lucide-react";
import { topics } from "@/data/topics";
import { filterTopics } from "@/lib/search";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    function shortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const results = filterTopics(topics, query, null);
  function navigateResults(event: KeyboardEvent<HTMLElement>) {
    if (event.nativeEvent.isComposing) return;
    const links = Array.from(list.current!.querySelectorAll<HTMLAnchorElement>("a"));
    if (event.key === "Enter" && event.target === input.current) {
      event.preventDefault();
      links[0]?.click();
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = [input.current!, ...links];
    const index = items.indexOf(document.activeElement as HTMLInputElement | HTMLAnchorElement);
    const direction = event.key === "ArrowDown" ? 1 : -1;
    items[(index + direction + items.length) % items.length].focus();
  }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger aria-label="Search" ref={trigger} className="search-trigger"><Search aria-hidden="true" size={17} /><span>Search</span><kbd>⌘ K</kbd></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="search-overlay" />
      <Dialog.Content className="search-dialog" onOpenAutoFocus={(event) => { event.preventDefault(); input.current!.focus(); }}>
        <div className="flex items-center justify-between gap-4"><Dialog.Title>Find your next five minutes</Dialog.Title><Dialog.Close aria-label="Close search"><X /></Dialog.Close></div>
        <Dialog.Description className="text-sm text-muted-foreground">Search mental models, trade-offs, and pitfalls across the atlas.</Dialog.Description>
        <input ref={input} onKeyDown={navigateResults} aria-label="Search the field guide" placeholder="Try Flow, sharing, or callout…" value={query} onChange={(event) => setQuery(event.target.value)} />
        <p role="status" className="text-sm text-muted-foreground">{results.length} topics found</p>
        <ul ref={list} onKeyDown={navigateResults} className="search-results">{results.map((topic) => <li key={topic.slug}><Dialog.Close asChild><Link href={`/topics/${topic.slug}`}><strong>{topic.title}</strong><span>{topic.tagline}</span></Link></Dialog.Close></li>)}</ul>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
