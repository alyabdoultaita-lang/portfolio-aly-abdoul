import type { Skill, SkillCategory } from "@/types/content";

export interface SkillDomain {
  category: SkillCategory;
  skills: Skill[];
}

/**
 * Regroupe les compétences par domaine, dans l'ordre des domaines (sort_order)
 * puis des compétences. Les domaines vides et les compétences non classées
 * (category_id null) ne sont pas affichés.
 */
export function groupSkillsByDomain(categories: SkillCategory[], skills: Skill[]): SkillDomain[] {
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
