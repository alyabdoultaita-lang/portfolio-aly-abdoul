"use server";

import { adminClient } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { termSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import type { Stat } from "@/types/content";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

const TERM_TABLES = ["categories", "tags"] as const;
function assertTermTable(table: string): asserts table is (typeof TERM_TABLES)[number] {
  if (!(TERM_TABLES as readonly string[]).includes(table)) throw new Error("Table invalide");
}

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;

  const stats: Stat[] = [0, 1, 2, 3]
    .map((i) => ({
      value: form.str(fd, `stat_${i}_value`),
      suffix: form.str(fd, `stat_${i}_suffix`),
      label: form.str(fd, `stat_${i}_label`),
    }))
    .filter((s) => s.value && s.label);

  const rows = [
    { key: "stats", value: stats },
    { key: "hero", value: { kicker: form.str(fd, "hero_kicker"), statement: form.str(fd, "hero_statement") } },
    { key: "contact_cta", value: { title: form.str(fd, "cta_title"), text: form.str(fd, "cta_text") } },
    {
      key: "seo",
      value: { title: form.str(fd, "seo_title"), description: form.str(fd, "seo_description"), keywords: form.csv(fd, "seo_keywords") },
    },
  ];

  if (form.str(fd, "seo_description").length > 170) {
    return { status: "error", message: "Meta description trop longue.", fieldErrors: { seo_description: ["170 caractères maximum."] } };
  }

  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return dbError(error);

  revalidateSite();
  return { status: "success", message: "Paramètres enregistrés." };
}

/** Catégories et tags du blog. */
export async function saveTerm(table: "categories" | "tags", _prev: FormState, fd: FormData): Promise<FormState> {
  assertTermTable(table);
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const name = form.str(fd, "name");
  const parsed = termSchema.safeParse({ name, slug: slugify(name) });
  if (!parsed.success) return validationError(parsed.error);
  const { error } = await supabase.from(table).insert(parsed.data);
  if (error) return dbError(error);
  revalidateSite();
  return { status: "success", message: `« ${name} » ajouté.` };
}

export async function deleteTerm(table: "categories" | "tags", id: string) {
  assertTermTable(table);
  const supabase = await adminClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}
