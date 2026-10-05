"use client";

import type { SiteSettings } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { Fieldset, TextArea, TextField } from "./Fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function SettingsForm({ settings, action }: { settings: SiteSettings; action: Action }) {
  const stats = [0, 1, 2, 3].map((i) => settings.stats[i] ?? { value: "", suffix: "", label: "" });
  return (
    <ActionForm action={action}>
      <Fieldset legend="Statistiques (accueil)">
        <p className="text-sm text-stone">Renseignez uniquement des chiffres vérifiables. Une ligne vide est masquée.</p>
        {stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px] gap-3 sm:grid-cols-[120px_80px_1fr]">
            <TextField name={`stat_${i}_value`} label={`Valeur ${i + 1}`} defaultValue={s.value} inputMode="numeric" />
            <TextField name={`stat_${i}_suffix`} label="Suffixe" defaultValue={s.suffix ?? ""} placeholder="+" />
            <TextField name={`stat_${i}_label`} label="Libellé" defaultValue={s.label} className="col-span-2 sm:col-span-1" />
          </div>
        ))}
      </Fieldset>
      <Fieldset legend="Hero">
        <TextField name="hero_kicker" label="Sur-titre" defaultValue={settings.hero.kicker} />
        <TextArea name="hero_statement" label="Déclaration sous le hero" rows={2} defaultValue={settings.hero.statement} />
      </Fieldset>
      <Fieldset legend="Appel à l'action (bas de page)">
        <TextField name="cta_title" label="Titre" defaultValue={settings.contact_cta.title} />
        <TextArea name="cta_text" label="Texte" rows={2} defaultValue={settings.contact_cta.text} />
      </Fieldset>
      <Fieldset legend="SEO global">
        <TextField name="seo_title" label="Titre du site" defaultValue={settings.seo.title} />
        <TextArea name="seo_description" label="Meta description" rows={3} maxLength={170} defaultValue={settings.seo.description} />
        <TextField name="seo_keywords" label="Mots-clés" defaultValue={settings.seo.keywords.join(", ")} hint="Séparés par des virgules." />
      </Fieldset>
    </ActionForm>
  );
}
