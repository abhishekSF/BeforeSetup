"use client";

import { useRef, type ReactNode } from "react";
import { Menu } from "lucide-react";

export function MobileNavigation({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <details ref={menu} className="mobile-menu" onKeyDown={(event) => {
    if (event.key === "Escape") {
      menu.current!.open = false;
      menu.current!.querySelector("summary")!.focus();
    }
  }}>
    <summary aria-label="Open navigation"><Menu aria-hidden="true" /><span className="sr-only">Menu</span></summary>
    <nav aria-label="Mobile navigation" onClick={(event) => {
      if ((event.target as Element).closest("a")) menu.current!.open = false;
    }}>{children}</nav>
  </details>;
}
