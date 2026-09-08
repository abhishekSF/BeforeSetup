"use client";
import { useEffect, useRef } from "react";

/** Decorative only: all topic geometry and navigation stays in semantic SVG/DOM. */
export function AtlasDepth() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current!;
    let disposed = false;
    let release = () => {};
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      import("./atlas-renderer").then(({ mountAtlasDepth }) => {
        if (!disposed) release = mountAtlasDepth(element);
      }).catch(() => { element.dataset.renderer = "unavailable"; });
    });
    observer.observe(element);
    return () => { disposed = true; observer.disconnect(); release(); };
  }, []);
  return <div ref={host} className="atlas-depth" aria-hidden="true" />;
}
