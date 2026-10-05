import Link from "next/link";
import type { Experience } from "@/types/content";
import { formatPeriod, pad , delay } from "@/lib/utils";

/** Liste compacte des expériences (accueil) : lignes qui s'inversent au survol. */
export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <ol className="border-t border-ink">
      {experiences.map((exp, i) => (
        <li key={exp.id} data-reveal style={delay(i * 80)}>
          <Link
            href={`/experience#${exp.id}`}
            className="group relative grid gap-2 overflow-hidden border-b border-line py-7 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-9"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
            />
            <span className="eyebrow relative text-stone transition-colors group-hover:text-smoke sm:col-span-1">{pad(i + 1)}</span>
            <span className="relative text-2xl font-semibold tracking-tight transition-colors group-hover:text-paper sm:col-span-5 sm:text-4xl">
              {exp.role}
            </span>
            <span className="relative font-serif text-xl italic transition-colors group-hover:text-paper sm:col-span-3 sm:text-2xl">
              {exp.company}
            </span>
            <span className="eyebrow relative text-stone transition-colors group-hover:text-smoke sm:col-span-3 sm:text-right">
              {formatPeriod(exp.start_date, exp.end_date, exp.is_current)}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
