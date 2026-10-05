"use client";

import { useState } from "react";
import type { Experience } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { CheckboxField, Fieldset, ListField, TextArea, TextField } from "./Fields";
import { MediaField } from "./MediaField";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function ExperienceForm({ experience, action }: { experience?: Experience | null; action: Action }) {
  const [current, setCurrent] = useState(experience?.is_current ?? false);
  return (
    <ActionForm action={action}>
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField name="role" label="Poste *" defaultValue={experience?.role} />
            <TextField name="company" label="Entreprise / organisation *" defaultValue={experience?.company} />
          </div>
          <TextArea name="description" label="Description" rows={4} defaultValue={experience?.description ?? ""} />
          <ListField name="responsibilities" label="Responsabilités" rows={5} defaultValue={experience?.responsibilities} />
          <ListField name="achievements" label="Réalisations" rows={4} defaultValue={experience?.achievements} />
          <ListField name="results" label="Résultats (chiffrés si possible)" rows={4} defaultValue={experience?.results} />
          <TextField name="tools" label="Technologies / outils" defaultValue={experience?.tools.join(", ")} hint="Séparés par des virgules." />
        </div>
        <div className="min-w-0 space-y-6">
          <Fieldset legend="Période">
            <TextField name="start_date" label="Début *" type="date" defaultValue={experience?.start_date} />
            <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
              <input type="checkbox" name="is_current" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="size-4 accent-ink" />
              Poste actuel
            </label>
            {!current && <TextField name="end_date" label="Fin" type="date" defaultValue={experience?.end_date ?? ""} />}
          </Fieldset>
          <Fieldset legend="Détails">
            <TextField name="location" label="Lieu" defaultValue={experience?.location ?? ""} />
            <TextField name="employment_type" label="Type de contrat" defaultValue={experience?.employment_type ?? ""} placeholder="CDI, Consultant…" />
            <TextField name="company_url" label="Site de l'entreprise" type="url" defaultValue={experience?.company_url ?? ""} placeholder="https://" />
            <MediaField name="logo_url" label="Logo" defaultValue={experience?.logo_url} folder="logos" />
          </Fieldset>
          <Fieldset legend="Affichage">
            <CheckboxField name="is_visible" label="Visible sur le site" defaultChecked={experience?.is_visible ?? true} />
            <TextField name="sort_order" label="Ordre" type="number" defaultValue={experience?.sort_order ?? 0} hint="Plus petit = en premier." />
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
