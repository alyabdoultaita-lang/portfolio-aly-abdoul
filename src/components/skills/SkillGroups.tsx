import type { Skill } from "@/types/content";
import { skillCategories } from "@/config/site";
import { cn, delay, pad } from "@/lib/utils";

/** Regroupe les compétences par catégorie, dans l'ordre défini dans la config. */
export function groupSkills(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const s of skills) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);
  const order = skillCategories as readonly string[];
  return [...groups.entries()].sort(([a], [b]) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

/** Barre de niveau : se remplit lorsque le bloc parent devient visible. */
function LevelBar({ level, dark }: { level: number; dark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative mt-2 block h-px w-full", dark ? "bg-ash" : "bg-line")}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 block w-full origin-left scale-x-0 transition-transform duration-[1.4s] ease-out-expo [[data-visible]_&]:scale-x-[var(--level)]",
          dark ? "bg-paper" : "bg-ink",
        )}
        style={{ "--level": level / 100 } as import("react").CSSProperties}
      />
    </span>
  );
}

export function SkillGroups({ skills, dark, showLevels = true }: { skills: Skill[]; dark?: boolean; showLevels?: boolean }) {
  const groups = groupSkills(skills);
  return (
    <div className="grid pl-px pt-px sm:grid-cols-2 lg:grid-cols-3">
      {groups.map(([category, items], i) => (
        <section
          key={category}
          aria-labelledby={`skill-cat-${i}`}
          className={cn("-ml-px -mt-px border p-6 sm:p-8", dark ? "border-ash bg-ink" : "border-line bg-paper")}
          data-reveal
          style={delay((i % 3) * 90)}
        >
          <div className="flex items-baseline justify-between">
            <h3 id={`skill-cat-${i}`} className="text-xl font-semibold tracking-tight">
              {category}
            </h3>
            <span className={cn("eyebrow", dark ? "text-smoke" : "text-stone")}>{pad(i + 1)}</span>
          </div>
          <ul className="mt-6 space-y-4">
            {items.map((skill) => (
              <li key={skill.id}>
                <div className="flex items-baseline justify-between gap-4 text-[0.95rem]">
                  <span>{skill.name}</span>
                  {showLevels && (
                    <span className={cn("font-mono text-xs", dark ? "text-smoke" : "text-stone")}>{skill.level}%</span>
                  )}
                </div>
                {showLevels && <LevelBar level={skill.level} dark={dark} />}
                {skill.description && (
                  <p className={cn("mt-2 text-sm", dark ? "text-smoke" : "text-stone")}>{skill.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
