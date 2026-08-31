import Link from "next/link";
import { Map, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Compass className="size-4" />
          </span>
          OrgAtlas
          <span className="hidden text-xs font-normal text-muted-foreground sm:inline">
            · the Salesforce topic map
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/map">
              <Map className="size-4" />
              Map
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/topics">Topics</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/start">Start Here</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
