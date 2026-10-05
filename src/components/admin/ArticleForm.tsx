"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Article, Category } from "@/types/content";
import { readingTime, slugify, stripHtml } from "@/lib/utils";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { DateTimeField } from "./DateTimeField";
import { Fieldset, SelectField, TextArea, TextField } from "./Fields";
import { MediaField } from "./MediaField";

// L'éditeur (Tiptap) n'est chargé que dans l'admin, côté client.
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[480px] animate-pulse border border-line bg-paper" />,
});

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

function initialStatus(article?: Article | null) {
  if (!article || article.status === "draft") return "draft";
  return article.published_at && new Date(article.published_at) > new Date() ? "scheduled" : "published";
}

export function ArticleForm({ article, categories, action }: { article?: Article | null; categories: Category[]; action: Action }) {
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [status, setStatus] = useState(initialStatus(article));
  const [metaTitle, setMetaTitle] = useState(article?.meta_title ?? "");
  const [metaDesc, setMetaDesc] = useState(article?.meta_description ?? "");
  const [minutes, setMinutes] = useState(article?.reading_time ?? 1);
  const [words, setWords] = useState(() => stripHtml(article?.content ?? "").split(" ").filter(Boolean).length);

  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <ActionForm action={action} submitLabel={status === "draft" ? "Enregistrer le brouillon" : status === "scheduled" ? "Programmer" : "Publier"}>
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <TextField
            name="title"
            label="Titre *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="[&_input]:text-2xl [&_input]:font-semibold"
          />
          <TextField name="subtitle" label="Sous-titre" defaultValue={article?.subtitle ?? ""} />
          <div>
            <TextField
              name="slug"
              label="Slug (URL)"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              hint={<>/blog/<strong>{effectiveSlug || "…"}</strong> — généré automatiquement depuis le titre.</>}
            />
          </div>
          <div>
            <p className="eyebrow mb-2 flex justify-between text-stone">
              <span>Contenu</span>
              <span>
                {words} mots · {minutes} min de lecture
              </span>
            </p>
            <RichTextEditor
              name="content"
              defaultValue={article?.content}
              onTextChange={(html) => {
                setMinutes(readingTime(html));
                setWords(stripHtml(html).split(" ").filter(Boolean).length);
              }}
            />
          </div>
          <TextArea name="excerpt" label="Extrait" rows={3} defaultValue={article?.excerpt ?? ""} hint="Résumé affiché dans les listes. Laisser vide pour le générer depuis le contenu." />
        </div>

        <div className="min-w-0 space-y-6">
          <Fieldset legend="Publication">
            <SelectField
              name="status"
              label="Statut"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { value: "draft", label: "Brouillon" },
                { value: "published", label: "Publié" },
                { value: "scheduled", label: "Programmé" },
              ]}
            />
            {status !== "draft" && (
              <DateTimeField
                name="published_at"
                label={status === "scheduled" ? "Date de publication *" : "Date de publication"}
                defaultValue={article?.published_at}
                hint={status === "published" ? "Vide = maintenant." : "L'article apparaîtra automatiquement à cette date."}
              />
            )}
            <TextField name="author" label="Auteur" defaultValue={article?.author ?? "Abdoul Aly TAITA"} />
          </Fieldset>

          <Fieldset legend="Classement">
            <SelectField
              name="category_id"
              label="Catégorie"
              defaultValue={article?.category_id ?? ""}
              options={[{ value: "", label: "— Aucune —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <TextField name="new_category" label="…ou nouvelle catégorie" placeholder="Ex. Social media" />
            <TextField name="tags" label="Tags" defaultValue={article?.tags?.map((t) => t.name).join(", ") ?? ""} hint="Séparés par des virgules." />
          </Fieldset>

          <Fieldset legend="Image de couverture">
            <MediaField name="cover_url" label="Image" defaultValue={article?.cover_url} folder="articles" />
            <TextField name="cover_alt" label="Texte alternatif" defaultValue={article?.cover_alt ?? ""} hint="Décrit l'image (accessibilité, SEO)." />
          </Fieldset>

          <Fieldset legend="SEO">
            <TextField
              name="meta_title"
              label={`Meta title (${metaTitle.length}/70)`}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={70}
              hint="Vide = titre de l'article."
            />
            <TextArea
              name="meta_description"
              label={`Meta description (${metaDesc.length}/170)`}
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              maxLength={170}
            />
            {/* Aperçu Google */}
            <div className="border border-line p-3 text-sm" aria-hidden="true">
              <p className="truncate text-xs text-stone">votre-site.com › blog › {effectiveSlug}</p>
              <p className="truncate text-base font-medium">{metaTitle || title || "Titre de l'article"}</p>
              <p className="line-clamp-2 text-xs text-stone">{metaDesc || "La meta description apparaîtra ici."}</p>
            </div>
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
