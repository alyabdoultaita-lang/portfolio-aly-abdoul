import { cn } from "@/lib/utils";

/** Séparateur graphique : anneau + point central (remplace l'astérisque). */
function Separator() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[0.55em] shrink-0 opacity-70">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Bandeau défilant en CSS pur (dupliqué pour une boucle continue).
 * Un mot sur deux est affiché en contour pour rythmer la lecture.
 */
export function Marquee({
  items,
  className,
  reverse = false,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
}) {
  if (items.length === 0) return null;
  // Répète la liste pour qu'une rangée soit toujours plus large que l'écran.
  const loop = Array.from({ length: Math.ceil(12 / items.length) }, () => items).flat();
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {loop.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center whitespace-nowrap">
          <span className={cn("px-5 sm:px-8", i % 2 === 1 && "marquee-outline")}>{item}</span>
          <Separator />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className={cn("flex w-max motion-reduce:animate-none", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
