import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <nav aria-label="Footer" className="footer-links">
          <a href="https://github.com/abhishekSF/BeforeSetup">GitHub / source</a>
          <a href="https://github.com/abhishekSF/BeforeSetup/issues/new">Report outdated information</a>
          <Link href="/topics">Topics</Link><Link href="/versus">Decisions</Link>
          <a href="https://github.com/abhishekSF/BeforeSetup/blob/main/LICENSE">MIT license</a>
        </nav>
        <p className="max-w-3xl leading-relaxed">
          BeforeSetup is a free, independent community field guide for
          orienting on Salesforce platform topics. It is not affiliated with,
          sponsored by, or endorsed by Salesforce. Salesforce, Trailhead, Apex,
          Lightning, and Agentforce are trademarks of Salesforce, Inc. For
          authoritative guidance, always check the official documentation
          linked from each topic.
        </p>
      </div>
    </footer>
  );
}
