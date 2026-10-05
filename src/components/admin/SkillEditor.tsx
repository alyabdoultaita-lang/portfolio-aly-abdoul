"use client";

import { useState } from "react";
import type { Skill } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { DeleteButton } from "./DeleteButton";
import { CheckboxField, SelectField, TextField } from "./Fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/** Formulaire compact d'une compétence (création ou édition en ligne). */
export function SkillForm({ skill, categories, action }: { skill?: Skill; categories: string[]; action: Action }) {
  const [level, setLevel] = useState(skill?.level ?? 70);
  return (
    <ActionForm action={action} compact submitLabel={skill ? "Mettre à jour" : "Ajouter"}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TextField name="name" label="Compétence *" defaultValue={skill?.name} />
        <SelectField name="category" label="Catégorie" defaultValue={skill?.category ?? categories[0]} options={categories.map((c) => ({ value: c, label: c }))} />
        {!skill && <TextField name="new_category" label="…ou nouvelle catégorie" />}
        <div>
          <label htmlFor={`level-${skill?.id ?? "new"}`} className="eyebrow mb-2 flex justify-between text-stone">
            Niveau <span className="text-ink">{level}%</span>
          </label>
          <input
            id={`level-${skill?.id ?? "new"}`}
            name="level"
            type="range"
            min={0}
            max={100}
            step={5}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="min-h-11 w-full accent-ink"
          />
        </div>
        <TextField name="sort_order" label="Ordre" type="number" defaultValue={skill?.sort_order ?? 0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <TextField name="description" label="Description (facultatif)" defaultValue={skill?.description ?? ""} />
        <CheckboxField name="is_featured" label="Afficher sur l'accueil" defaultChecked={skill?.is_featured} />
      </div>
    </ActionForm>
  );
}

export function SkillRow({ skill, categories, action, deleteAction }: { skill: Skill; categories: string[]; action: Action; deleteAction: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  return (
    <li className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">
            {skill.name} {skill.is_featured && <span title="Affichée sur l'accueil">★</span>}
          </p>
          <div className="mt-2 h-px w-full max-w-xs bg-line" aria-hidden="true">
            <div className="h-px bg-ink" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
        <span className="font-mono text-xs text-stone">{skill.level}%</span>
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
