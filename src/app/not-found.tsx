import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <Compass className="size-10 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">Off the map</h1>
      <p className="mt-2 text-muted-foreground">
        That page doesn&apos;t exist — but every topic we do cover is one click
        away.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/map">Open the map</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/topics">Browse all topics</Link>
        </Button>
      </div>
    </div>
  );
}
