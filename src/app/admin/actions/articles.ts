"use server";

import { redirect } from "next/navigation";
import { adminClient } from "@/lib/auth";
import { readingTime, slugify, stripHtml, truncate } from "@/lib/utils";
import { articleSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

/**
 * Création / mise à jour d'un article.
 * Statuts côté formulaire : draft | published | scheduled.
 * « scheduled » = published + date future (filtrée par la RLS publique).
 */
export async function saveArticle(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;

  const title = form.str(fd, "title");
  const content = form.str(fd, "content");
  const uiStatus = form.str(fd, "status");
  let publishedAt = form.opt(fd, "published_at");

  if (uiStatus === "scheduled") {
    if (!publishedAt || new Date(publishedAt) <= new Date()) {
      return { status: "error", message: "Pour programmer, choisissez une date future.", fieldErrors: { published_at: ["Date future requise."] } };
    }
  } else if (uiStatus === "published" && !publishedAt) {
    publishedAt = new Date().toISOString();
  }

  // Nouvelle catégorie saisie à la volée
  let categoryId = form.opt(fd, "category_id");
  const newCategory = form.opt(fd, "new_category");
  if (newCategory) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name: newCategory, slug: slugify(newCategory) }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) return dbError(error);
    categoryId = data.id;
  }

  const parsed = articleSchema.safeParse({
    title,
    subtitle: form.opt(fd, "subtitle"),
    slug: slugify(form.str(fd, "slug") || title),
    excerpt: form.opt(fd, "excerpt") ?? (truncate(stripHtml(content), 200) || null),
    content,
    cover_url: form.opt(fd, "cover_url"),
    cover_alt: form.opt(fd, "cover_alt"),
    author: form.str(fd, "author") || "Abdoul Aly TAITA",
    category_id: categoryId,
    status: uiStatus === "draft" ? "draft" : "published",
    published_at: publishedAt,
    reading_time: readingTime(content),
    meta_title: form.opt(fd, "meta_title"),
    meta_description: form.opt(fd, "meta_description"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const query = id
    ? supabase.from("articles").update(parsed.data).eq("id", id).select("id").single()
    : supabase.from("articles").insert(parsed.data).select("id").single();
  const { data: saved, error } = await query;
  if (error) return dbError(error);

  // Tags : « SEO, Google Ads » → upsert + liaison
  // Dédoublonnage par slug : « SEO, seo » ferait échouer l'upsert.
  const tagRows = [
    ...new Map(
      form
        .csv(fd, "tags")
        .map((name) => ({ name: name.slice(0, 80), slug: slugify(name) }))
        .filter((t) => t.slug)
        .map((t) => [t.slug, t]),
    ).values(),
  ];
  const { error: unlinkError } = await supabase.from("article_tags").delete().eq("article_id", saved.id);
  if (unlinkError) return dbError(unlinkError);
  if (tagRows.length > 0) {
    const { data: tags, error: tagError } = await supabase
      .from("tags")
      .upsert(tagRows, { onConflict: "slug" })
      .select("id");
    if (tagError) return dbError(tagError);
    const { error: linkError } = await supabase
      .from("article_tags")
      .insert(tags.map((t) => ({ article_id: saved.id, tag_id: t.id })));
    if (linkError) return dbError(linkError);
  }

  revalidateSite();
  if (!id) redirect(`/admin/articles/${saved.id}?created=1`);
  return { status: "success", message: "Article enregistré." };
}

export async function deleteArticle(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/articles");
}
