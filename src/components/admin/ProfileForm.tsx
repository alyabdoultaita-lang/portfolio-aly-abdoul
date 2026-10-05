"use client";

import type { Profile } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { CheckboxField, Fieldset, TextArea, TextField } from "./Fields";
import { MediaField } from "./MediaField";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function ProfileForm({ profile: p, action }: { profile: Profile | null; action: Action }) {
  return (
    <ActionForm action={action}>
      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <Fieldset legend="Identité">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="full_name" label="Nom complet *" defaultValue={p?.full_name ?? "Abdoul Aly TAITA"} />
              <TextField name="headline" label="Titre professionnel *" defaultValue={p?.headline ?? "Responsable Digital / Marketing Digital"} />
            </div>
            <TextField name="tagline" label="Phrase d'accroche (hero)" defaultValue={p?.tagline ?? ""} />
            <TextArea name="short_bio" label="Présentation courte (accueil, CV)" rows={3} defaultValue={p?.short_bio ?? ""} />
            <TextArea name="bio" label="Biographie complète (À propos)" rows={10} defaultValue={p?.bio ?? ""} hint="Ligne vide = nouveau paragraphe." />
          </Fieldset>
          <Fieldset legend="Coordonnées">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="email" label="E-mail public" type="email" defaultValue={p?.email ?? ""} />
              <TextField name="phone" label="Téléphone" type="tel" defaultValue={p?.phone ?? ""} />
              <TextField name="location" label="Localisation" defaultValue={p?.location ?? "Ouagadougou, Burkina Faso"} />
              <TextField name="website_url" label="Site web" type="url" defaultValue={p?.website_url ?? ""} />
              <TextField name="linkedin_url" label="LinkedIn" type="url" defaultValue={p?.linkedin_url ?? ""} />
              <TextField name="twitter_url" label="X / Twitter" type="url" defaultValue={p?.twitter_url ?? ""} />
              <TextField name="github_url" label="GitHub" type="url" defaultValue={p?.github_url ?? ""} />
            </div>
          </Fieldset>
          <Fieldset legend="Divers">
            <TextField name="languages" label="Langues" defaultValue={p?.languages.join(", ") ?? ""} hint="Séparées par des virgules." />
            <TextField name="interests" label="Centres d'intérêt" defaultValue={p?.interests.join(", ") ?? ""} hint="Séparés par des virgules." />
            <CheckboxField name="available_for_work" label="Afficher « Disponible »" defaultChecked={p?.available_for_work ?? true} />
          </Fieldset>
        </div>
        <div className="min-w-0 space-y-6">
          <Fieldset legend="Photo professionnelle">
            <MediaField name="photo_url" label="Photo" defaultValue={p?.photo_url} folder="profil" />
            <p className="text-xs text-stone">Format portrait (4:5) conseillé, au moins 1200 px de large. Affichée en noir et blanc.</p>
          </Fieldset>
          <Fieldset legend="CV (PDF)">
            <MediaField name="cv_url" label="Fichier PDF" defaultValue={p?.cv_url} folder="cv" accept="application/pdf" kind="file" />
            <p className="text-xs text-stone">Lien utilisé par les boutons « Télécharger mon CV ».</p>
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
