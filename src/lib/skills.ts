import type { Skill, SkillCategory } from "@/types/content";

export interface SkillDomain {
  category: SkillCategory;
  skills: Skill[];
}

/**
 * Regroupe les compétences par domaine, dans l'ordre des domaines (sort_order)
 * puis des compétences. Les domaines vides et les compétences non classées
 * (category_id null) ne sont pas affichés.
 * Repli : si aucun domaine n'est exploitable, regroupement par l'ancien libellé `category`.
 */
export function groupSkillsByDomain(categories: SkillCategory[], skills: Skill[]): SkillDomain[] {
  const domains = groupByCategoryId(categories, skills);
  // Base pas encore migrée (0002) ou aucune compétence rattachée : on regroupe
  // par l'ancien libellé texte pour ne jamais afficher une section vide.
  return domains.length > 0 ? domains : groupByLegacyCategory(skills);
}

function bySortOrder<T extends { sort_order: number; name: string }>(a: T, b: T) {
  return a.sort_order - b.sort_order || a.name.localeCompare(b.name, "fr");
}

function groupByLegacyCategory(skills: Skill[]): SkillDomain[] {
  const groups = new Map<string, Skill[]>();
  for (const skill of [...skills].sort(bySortOrder)) {
    const name = skill.category?.trim();
    if (!name) continue;
    groups.set(name, [...(groups.get(name) ?? []), skill]);
  }
  return [...groups].map(([name, items], i) => ({
    category: { id: `legacy-${i}`, name, slug: `legacy-${i}`, description: null, icon: null, sort_order: i + 1 },
    skills: items,
  }));
}

function groupByCategoryId(categories: SkillCategory[], skills: Skill[]): SkillDomain[] {
  return [...categories]
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "fr"))
    .map((category) => ({
      category,
      skills: skills
        .filter((s) => s.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "fr")),
    }))
    .filter((d) => d.skills.length > 0);
}
