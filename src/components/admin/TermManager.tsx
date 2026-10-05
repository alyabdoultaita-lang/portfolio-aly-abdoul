"use client";

import type { FormState } from "@/lib/validation/contact";
import { ActionForm } from "./ActionForm";
import { DeleteButton } from "./DeleteButton";
import { TextField } from "./Fields";

type Term = { id: string; name: string; slug: string };

/** Petite gestion de taxonomie : liste + ajout + suppression. */
export function TermManager({
  title,
  terms,
  addAction,
  deleteActions,
}: {
  title: string;
  terms: Term[];
  addAction: (prev: FormState, fd: FormData) => Promise<FormState>;
  deleteActions: Record<string, () => Promise<void>>;
}) {
  return (
    <section className="border border-line bg-paper p-5">
      <h2 className="eyebrow text-stone">{title}</h2>
      <ul className="mt-3 divide-y divide-line">
        {terms.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 py-2">
            <span>
              {t.name} <span className="font-mono text-xs text-stone">{t.slug}</span>
            </span>
            <DeleteButton action={deleteActions[t.id]} confirmText={`Supprimer « ${t.name} » ?`} />
          </li>
        ))}
        {terms.length === 0 && <li className="py-2 text-sm text-stone">Aucun élément.</li>}
      </ul>
      <div className="mt-4">
        <ActionForm action={addAction} submitLabel="Ajouter" compact>
          <TextField name="name" label="Nouveau" placeholder="Nom" />
        </ActionForm>
      </div>
    </section>
  );
}
