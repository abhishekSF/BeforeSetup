import Link from "next/link";
import { Compass, Menu } from "lucide-react";
import { GlobalSearch } from "@/components/global-search";

const destinations = [
  ["Decisions", "/versus"], ["Atlas", "/map"], ["Topics", "/topics"], ["Paths", "/start"],
];

export function SiteHeader() {
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand"><Compass aria-hidden="true" />BeforeSetup<span className="brand-mark">/</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {destinations.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <GlobalSearch />
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><Menu aria-hidden="true" /><span className="sr-only">Menu</span></summary>
          <nav aria-label="Mobile navigation">
            {destinations.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <a href="https://github.com/abhishekSF/BeforeSetup">Source on GitHub</a>
          </nav>
        </details>
      </div>
    </div>
  </header>;
}
