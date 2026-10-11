import { cn } from "@/lib/utils";

/** Bandeau défilant en CSS pur (dupliqué pour une boucle continue). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-6 sm:px-10">{item}</span>
          <span aria-hidden="true" className="font-serif italic opacity-60">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
