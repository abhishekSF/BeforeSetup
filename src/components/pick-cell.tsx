import { pickValues } from "@/lib/versus";

export function PickCell({ pick }: { pick: string | string[] | null }) {
  const values = pickValues(pick);
  if (values === null) {
    return (
      <span className="inline-flex rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
        It depends
      </span>
    );
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {values.map((p) => (
        <span
          key={p}
          className="inline-flex rounded-md border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300"
        >
          {p}
        </span>
      ))}
    </span>
  );
}
