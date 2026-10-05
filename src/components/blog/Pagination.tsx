import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({ page, pageCount, buildHref }: { page: number; pageCount: number; buildHref: (page: number) => string }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="mt-20 flex items-center justify-between border-t border-ink pt-6">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} rel="prev" className="link-underline min-h-11 py-3">
          ← Précédent
        </Link>
      ) : (
        <span />
      )}
      <ol className="flex gap-1">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={buildHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex size-11 items-center justify-center font-mono text-sm",
                p === page ? "bg-ink text-paper" : "hover:bg-mist",
              )}
            >
              {String(p).padStart(2, "0")}
            </Link>
          </li>
        ))}
      </ol>
      {page < pageCount ? (
        <Link href={buildHref(page + 1)} rel="next" className="link-underline min-h-11 py-3">
          Suivant →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
