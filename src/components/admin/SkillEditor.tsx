"use client";

import { useState } from "react";
import type { Skill, SkillCategory } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { DeleteButton } from "./DeleteButton";
import { CheckboxField, SelectField, TextField } from "./Fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

const iconOptions = [
  { value: "", label: "Aucune" },
  { value: "strategy", label: "Boussole (stratégie)" },
  { value: "acquisition", label: "Cible (acquisition)" },
  { value: "data", label: "Graphique (data)" },
  { value: "web", label: "Navigateur (web)" },
  { value: "management", label: "Réseau (management)" },
];

// ---------------------------------------------------------------------------
// Compétences
// ---------------------------------------------------------------------------

/** Formulaire compact d'une compétence (création ou édition en ligne). */
export function SkillForm({ skill, categories, defaultCategoryId, action }: { skill?: Skill; categories: SkillCategory[]; defaultCategoryId?: string; action: Action }) {
  return (
    <ActionForm action={action} compact submitLabel={skill ? "Mettre à jour" : "Ajouter"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_2fr_1fr]">
        <TextField name="name" label="Compétence *" defaultValue={skill?.name} />
        <SelectField
          name="category_id"
          label="Domaine"
          defaultValue={skill ? (skill.category_id ?? "") : (defaultCategoryId ?? categories[0]?.id ?? "")}
          options={[...categories.map((c) => ({ value: c.id, label: c.name })), { value: "", label: "— Non classée (masquée sur le site) —" }]}
        />
        <TextField name="sort_order" label="Ordre" type="number" defaultValue={skill?.sort_order ?? 0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <TextField name="description" label="Précision (facultatif, au survol)" defaultValue={skill?.description ?? ""} />
        <CheckboxField name="is_featured" label="Afficher sur l'accueil" defaultChecked={skill?.is_featured ?? true} />
      </div>
    </ActionForm>
  );
}

export function SkillRow({ skill, categories, action, deleteAction }: { skill: Skill; categories: SkillCategory[]; action: Action; deleteAction: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  return (
    <li className="p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 flex-1 font-medium">
          {skill.name} {skill.is_featured && <span title="Affichée sur l'accueil">★</span>}
          {!skill.category_id && skill.category && <span className="ml-2 text-xs font-normal text-stone">(ancienne catégorie : {skill.category})</span>}
        </p>
        <span className="font-mono text-xs text-stone">#{skill.sort_order}</span>
        <button type="button" onClick={() => setEditing((v) => !v)} aria-expanded={editing} className="min-h-9 px-2 text-sm underline underline-offset-4">
          {editing ? "Fermer" : "Modifier"}
        </button>
        <DeleteButton action={deleteAction} confirmText={`Supprimer « ${skill.name} » ?`} />
      </div>
      {editing && (
        <div className="mt-4 border-t border-line pt-4">
          <SkillForm skill={skill} categories={categories} action={action} />
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Domaines
// ---------------------------------------------------------------------------

export function SkillCategoryForm({ category, action }: { category?: SkillCategory; action: Action }) {
  return (
    <ActionForm action={action} compact submitLabel={category ? "Mettre à jour le domaine" : "Ajouter le domaine"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_2fr]">
        <TextField name="name" label="Nom du domaine *" defaultValue={category?.name} />
        <TextField name="sort_order" label="Ordre d'affichage" type="number" defaultValue={category?.sort_order ?? 0} hint="1 = premier." />
        <SelectField name="icon" label="Icône" defaultValue={category?.icon ?? ""} options={iconOptions} />
      </div>
      <TextField name="description" label="Description courte (facultatif)" defaultValue={category?.description ?? ""} maxLength={240} />
      {category && <input type="hidden" name="slug" value={category.slug} />}
    </ActionForm>
  );
}

export function SkillCategoryHeader({ category, index, action, deleteAction }: { category: SkillCategory; index: number; action: Action; deleteAction: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          <span className="mr-2 font-mono text-sm text-stone">{String(index).padStart(2, "0")}</span>
          {category.name}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setEditing((v) => !v)} aria-expanded={editing} className="min-h-9 px-2 text-sm underline underline-offset-4">
            {editing ? "Fermer" : "Modifier le domaine"}
          </button>
          <DeleteButton
            action={deleteAction}
            label="Supprimer le domaine"
            confirmText={`Supprimer le domaine « ${category.name} » ? Ses compétences ne sont pas supprimées : elles deviennent « non classées ».`}
          />
        </div>
      </div>
      {category.description && !editing && <p className="text-sm text-stone">{category.description}</p>}
      {editing && (
        <div className="mt-3 border border-line bg-paper p-4">
          <SkillCategoryForm category={category} action={action} />
        </div>
      )}
    </div>
  );
}
