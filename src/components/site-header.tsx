import Link from "next/link";
import { Compass } from "lucide-react";
import { GlobalSearch } from "@/components/global-search";
import { MobileNavigation } from "@/components/mobile-navigation";

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
        <MobileNavigation>
            {destinations.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <a href="https://github.com/abhishekSF/BeforeSetup">Source on GitHub</a>
        </MobileNavigation>
      </div>
    </div>
  </header>;
}
