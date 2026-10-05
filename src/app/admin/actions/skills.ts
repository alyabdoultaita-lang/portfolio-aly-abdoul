"use server";

import { adminClient } from "@/lib/auth";
import { skillSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { dbError, form, revalidateSite, validationError } from "./helpers";

export async function saveSkill(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClient();
  const parsed = skillSchema.safeParse({
    name: form.str(fd, "name"),
    category: form.str(fd, "new_category") || form.str(fd, "category"),
    level: form.int(fd, "level", 70),
    description: form.opt(fd, "description"),
    sort_order: form.int(fd, "sort_order"),
    is_featured: form.bool(fd, "is_featured"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const { error } = id
    ? await supabase.from("skills").update(parsed.data).eq("id", id)
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
