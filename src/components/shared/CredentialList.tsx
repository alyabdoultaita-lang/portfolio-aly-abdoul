import type { Certification } from "@/types/content";
import { formatMonth, formatYear } from "@/lib/utils";

/** Liste de formations ou de certifications (pages À propos et CV). */
export function CredentialList({ items, compact }: { items: Certification[]; compact?: boolean }) {
  return (
    <ul className={compact ? "space-y-2" : "mt-4"}>
      {items.map((c) => {
        const date = c.kind === "formation" ? formatYear(c.issue_date) : formatMonth(c.issue_date);
        const name = c.credential_url ? (
          <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="link-underline">
            {c.name}
          </a>
        ) : (
          c.name
        );
        return compact ? (
          <li key={c.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 print:break-inside-avoid">
            <span>
              <span className="font-medium">{name}</span> — {c.issuer}
            </span>
            {date && <span className="eyebrow text-stone">{date}</span>}
          </li>
        ) : (
          <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-5" data-reveal>
            <div>
              <p className="text-lg font-medium tracking-tight">{name}</p>
              <p className="text-stone">{c.issuer}</p>
            </div>
            {date && <span className="eyebrow text-stone">{date}</span>}
          </li>
        );
      })}
    </ul>
  );
}
