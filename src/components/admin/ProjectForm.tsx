"use client";

import { useState } from "react";
import type { Project, ProjectCategory } from "@/types/content";
import { slugify } from "@/lib/utils";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { CheckboxField, Fieldset, ListField, SelectField, TextArea, TextField } from "./Fields";
import { MediaField } from "./MediaField";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function ProjectForm({ project, categories, action }: { project?: Project | null; categories: ProjectCategory[]; action: Action }) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [touched, setTouched] = useState(Boolean(project?.slug));
  const effectiveSlug = touched ? slug : slugify(title);

  return (
    <ActionForm action={action}>
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <TextField name="title" label="Titre *" value={title} onChange={(e) => setTitle(e.target.value)} className="[&_input]:text-2xl [&_input]:font-semibold" />
          <TextField
            name="slug"
            label="Slug (URL)"
            value={effectiveSlug}
            onChange={(e) => {
              setTouched(true);
              setSlug(slugify(e.target.value));
            }}
            hint={<>/portfolio/<strong>{effectiveSlug || "…"}</strong></>}
          />
          <TextArea name="excerpt" label="Accroche" rows={2} defaultValue={project?.excerpt ?? ""} hint="Une phrase affichée sur la carte du projet." />
          <TextArea name="description" label="Description" rows={6} defaultValue={project?.description ?? ""} hint="Ligne vide = nouveau paragraphe." />
          <TextArea name="context" label="Contexte" rows={4} defaultValue={project?.context ?? ""} />
          <TextArea name="objectives" label="Objectifs" rows={4} defaultValue={project?.objectives ?? ""} />
          <TextArea name="results" label="Résultats" rows={4} defaultValue={project?.results ?? ""} />
          <ListField name="gallery" label="Galerie (URLs d'images)" defaultValue={project?.gallery} hint="Une URL par ligne. Utilisez le champ image ci-contre pour envoyer des fichiers puis copiez l'URL." />
        </div>

        <div className="min-w-0 space-y-6">
          <Fieldset legend="Publication">
            <SelectField
              name="status"
              label="Statut"
              defaultValue={project?.status ?? "draft"}
              options={[
                { value: "draft", label: "Brouillon" },
                { value: "published", label: "Publié" },
              ]}
            />
            <CheckboxField name="is_featured" label="Mis en avant sur l'accueil" defaultChecked={project?.is_featured} />
            <TextField name="sort_order" label="Ordre d'affichage" type="number" defaultValue={project?.sort_order ?? 0} hint="Plus petit = affiché en premier." />
          </Fieldset>
          <Fieldset legend="Informations">
            <SelectField
              name="category_id"
              label="Catégorie"
              defaultValue={project?.category_id ?? ""}
              options={[{ value: "", label: "— Aucune —" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <TextField name="client" label="Client" defaultValue={project?.client ?? ""} />
            <TextField name="year" label="Année" type="number" inputMode="numeric" defaultValue={project?.year ?? ""} />
            <TextField name="tools" label="Outils utilisés" defaultValue={project?.tools.join(", ") ?? ""} hint="Séparés par des virgules." />
            <TextField name="link_url" label="Lien externe" type="url" defaultValue={project?.link_url ?? ""} placeholder="https://" />
          </Fieldset>
          <Fieldset legend="Image principale">
            <MediaField name="cover_url" label="Image" defaultValue={project?.cover_url} folder="projets" />
            <TextField name="cover_alt" label="Texte alternatif" defaultValue={project?.cover_alt ?? ""} />
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
