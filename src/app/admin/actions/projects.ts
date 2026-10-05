"use server";

import { redirect } from "next/navigation";
import { adminClient } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { projectSchema, termSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

export async function saveProject(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const title = form.str(fd, "title");
  const year = form.opt(fd, "year");

  const parsed = projectSchema.safeParse({
    title,
    slug: slugify(form.str(fd, "slug") || title),
    category_id: form.opt(fd, "category_id"),
    client: form.opt(fd, "client"),
    year: year ? Number(year) : null,
    cover_url: form.opt(fd, "cover_url"),
    cover_alt: form.opt(fd, "cover_alt"),
    gallery: form.lines(fd, "gallery"),
    excerpt: form.opt(fd, "excerpt"),
    description: form.opt(fd, "description"),
    context: form.opt(fd, "context"),
    objectives: form.opt(fd, "objectives"),
    results: form.opt(fd, "results"),
    tools: form.csv(fd, "tools"),
    link_url: form.opt(fd, "link_url"),
    is_featured: form.bool(fd, "is_featured"),
    status: form.str(fd, "status") === "published" ? "published" : "draft",
    sort_order: form.int(fd, "sort_order"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const query = id
    ? supabase.from("projects").update(parsed.data).eq("id", id).select("id").single()
    : supabase.from("projects").insert(parsed.data).select("id").single();
  const { data, error } = await query;
  if (error) return dbError(error);

  revalidateSite();
  if (!id) redirect(`/admin/projets/${data.id}?created=1`);
  return { status: "success", message: "Projet enregistré." };
}

export async function deleteProject(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/projets");
}

export async function saveProjectCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const name = form.str(fd, "name");
  const parsed = termSchema.safeParse({ name, slug: slugify(name) });
  if (!parsed.success) return validationError(parsed.error);
  const { error } = await supabase.from("project_categories").insert({ ...parsed.data, sort_order: form.int(fd, "sort_order") });
  if (error) return dbError(error);
  revalidateSite();
  return { status: "success", message: `Catégorie « ${name} » ajoutée.` };
}

export async function deleteProjectCategory(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}
