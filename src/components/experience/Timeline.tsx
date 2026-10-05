import type { Experience } from "@/types/content";
import { Pill } from "@/components/ui/Pill";
import { formatPeriod, pad } from "@/lib/utils";

function Block({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="eyebrow text-stone">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-snug">
            <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ink" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Timeline éditoriale : période collante à gauche, détail à droite. */
export function Timeline({ experiences }: { experiences: Experience[] }) {
  return (
    <ol className="relative border-t border-ink">
      {experiences.map((exp, i) => (
        <li key={exp.id} id={exp.id} className="grid scroll-mt-28 gap-6 border-b border-line py-12 sm:py-16 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-xs text-stone">{pad(experiences.length - i)}</p>
              <p className="mt-3 text-lg font-medium tracking-tight">{formatPeriod(exp.start_date, exp.end_date, exp.is_current)}</p>
              <p className="eyebrow mt-2 text-stone">
                {[exp.location, exp.employment_type].filter(Boolean).join(" — ")}
              </p>
              {exp.is_current && (
                <span className="eyebrow mt-4 inline-block bg-ink px-2 py-1 text-paper">Poste actuel</span>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <h3 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{exp.role}</h3>
            <p className="mt-2 font-serif text-2xl italic sm:text-3xl">
              {exp.company_url ? (
                <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {exp.company}
                </a>
              ) : (
                exp.company
              )}
            </p>
            {exp.description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">{exp.description}</p>}

            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <Block title="Responsabilités" items={exp.responsibilities} />
              <Block title="Réalisations" items={exp.achievements} />
              <Block title="Résultats" items={exp.results} />
              {exp.tools.length > 0 && (
                <div>
                  <h4 className="eyebrow text-stone">Outils</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <li key={tool}>
                        <Pill>{tool}</Pill>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
