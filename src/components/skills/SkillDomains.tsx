import type { SkillDomain } from "@/lib/skills";
import { cn, delay, pad } from "@/lib/utils";
import { DomainIcon } from "./DomainIcon";

/**
 * Compétences présentées par grands domaines : numéro, intitulé du domaine
 * (niveau de lecture principal), description courte, puis compétences associées.
 *
 * Grille : mobile = 1 colonne · tablette = 2 colonnes · desktop = 6 colonnes
 * virtuelles (3 blocs en haut, 2 blocs plus larges en bas pour 5 domaines).
 */
export function SkillDomains({
  domains,
  dark,
  showDescriptions = true,
}: {
  domains: SkillDomain[];
  dark?: boolean;
  showDescriptions?: boolean;
}) {
  const n = domains.length;

  // Répartition des colonnes pour que la dernière rangée remplisse toute la largeur
  const span = (i: number) =>
    cn(
      // tablette : 2 colonnes, le dernier bloc d'un nombre impair prend toute la largeur
      n % 2 === 1 && i === n - 1 && "md:col-span-2",
      // desktop : 3 par rangée ; 2 restants → 3+3 colonnes, 1 restant → 6 colonnes
      n % 3 === 2 && i >= n - 2
        ? "lg:col-span-3"
        : n % 3 === 1 && i === n - 1
          ? "lg:col-span-6"
          : "lg:col-span-2",
    );

  return (
    <ol className="grid pl-px pt-px md:grid-cols-2 lg:grid-cols-6">
      {domains.map(({ category, skills }, i) => (
        <li
          key={category.id}
          className={cn(
            "group -ml-px -mt-px flex flex-col border p-6 transition-colors duration-500 sm:p-8 lg:p-10",
            dark
              ? "border-ash bg-ink hover:border-smoke"
              : "border-line bg-paper hover:border-ink",
            span(i),
          )}
          data-reveal
          style={delay((i % 3) * 90)}
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={cn(
                "text-4xl font-normal leading-none tracking-tighter tabular-nums sm:text-5xl",
                dark ? "text-smoke" : "text-stone",
              )}
              aria-hidden="true"
            >
              {pad(i + 1)}
            </span>
            <DomainIcon
              icon={category.icon}
              className={cn(
                "size-6 shrink-0 transition-opacity duration-500",
                dark
                  ? "text-smoke opacity-70 group-hover:opacity-100"
                  : "text-stone opacity-70 group-hover:opacity-100",
              )}
            />
          </div>

          <h3 className="mt-6 text-2xl font-bold uppercase leading-tight tracking-tight sm:mt-8 sm:text-3xl">
            <span className="sr-only">{pad(i + 1)} — </span>
            {category.name}
          </h3>

          {showDescriptions && category.description && (
            <p
              className={cn(
                "mt-3 max-w-md text-[0.95rem] leading-relaxed",
                dark ? "text-smoke" : "text-stone",
              )}
            >
              {category.description}
            </p>
          )}

          {/* Les compétences sont alignées en bas du bloc, avec un espace minimum.
              Chaque compétence est précédée d'un « · » ; ceux qui tombent en début
              de ligne sont rognés (marge négative + overflow-hidden). */}
          <div className="mt-auto pt-6">
            <div
              className={cn(
                "overflow-hidden border-t pt-5",
                dark ? "border-ash" : "border-line",
              )}
            >
              <ul
                className="-ml-5 flex flex-wrap items-baseline gap-y-1.5 text-base font-medium"
                aria-label={`Compétences — ${category.name}`}
              >
                {skills.map((skill) => (
                  <li key={skill.id} className="flex items-baseline">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-5 shrink-0 text-center",
                        dark ? "text-smoke/60" : "text-stone/60",
                      )}
                    >
                      ·
                    </span>
                    <span title={skill.description ?? undefined}>
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
