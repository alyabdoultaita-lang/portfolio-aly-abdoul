"use server";

import { adminClient } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { skillCategorySchema, skillSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

// ---------------------------------------------------------------------------
// Compétences
// ---------------------------------------------------------------------------

export async function saveSkill(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const parsed = skillSchema.safeParse({
    name: form.str(fd, "name"),
    category_id: form.opt(fd, "category_id"),
    level: null,
    description: form.opt(fd, "description"),
    sort_order: form.int(fd, "sort_order"),
    is_featured: form.bool(fd, "is_featured"),
  });
  if (!parsed.success) return validationError(parsed.error);

  // Les niveaux en % ne sont plus affichés : on ne touche pas à une valeur existante.
  const { level: _level, ...fields } = parsed.data;
  const { error } = id
    ? await supabase.from("skills").update(fields).eq("id", id)
    : await supabase.from("skills").insert(parsed.data);
  if (error) return dbError(error);

  revalidateSite();
  return { status: "success", message: id ? "Compétence mise à jour." : `« ${parsed.data.name} » ajoutée.` };
}

export async function deleteSkill(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

// ---------------------------------------------------------------------------
// Domaines de compétences (skill_categories)
// ---------------------------------------------------------------------------

export async function saveSkillCategory(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const name = form.str(fd, "name");
  const parsed = skillCategorySchema.safeParse({
    name,
    slug: slugify(form.str(fd, "slug") || name),
    description: form.opt(fd, "description"),
    icon: form.opt(fd, "icon"),
    sort_order: form.int(fd, "sort_order"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const { error } = id
    ? await supabase.from("skill_categories").update(parsed.data).eq("id", id)
    : await supabase.from("skill_categories").insert(parsed.data);
  if (error) return dbError(error);

  revalidateSite();
  return { status: "success", message: id ? "Domaine mis à jour." : `Domaine « ${name} » ajouté.` };
}

/** Supprime un domaine : ses compétences ne sont pas supprimées, elles deviennent « non classées ». */
export async function deleteSkillCategory(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}
