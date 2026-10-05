"use client";

import { useState } from "react";
import type { Certification } from "@/types/content";
import type { FormState } from "@/lib/validation/contact";
import { formatMonth } from "@/lib/utils";
import { ActionForm } from "./ActionForm";
import { DeleteButton } from "./DeleteButton";
import { TextField } from "./Fields";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export function CertificationForm({ certification: c, action }: { certification?: Certification; action: Action }) {
  return (
    <ActionForm action={action} compact submitLabel={c ? "Mettre à jour" : "Ajouter"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name" label="Intitulé *" defaultValue={c?.name} />
        <TextField name="issuer" label="Organisme *" defaultValue={c?.issuer} />
        <TextField name="issue_date" label="Date d'obtention" type="date" defaultValue={c?.issue_date ?? ""} />
        <TextField name="expiry_date" label="Date d'expiration" type="date" defaultValue={c?.expiry_date ?? ""} />
        <TextField name="credential_id" label="Identifiant" defaultValue={c?.credential_id ?? ""} />
        <TextField name="credential_url" label="URL de vérification" type="url" defaultValue={c?.credential_url ?? ""} placeholder="https://" />
        <TextField name="sort_order" label="Ordre" type="number" defaultValue={c?.sort_order ?? 0} />
      </div>
    </ActionForm>
  );
}

export function CertificationRow({ certification, action, deleteAction }: { certification: Certification; action: Action; deleteAction: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  return (
    <li className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{certification.name}</p>
          <p className="text-sm text-stone">
            {certification.issuer}
            {certification.issue_date && ` · ${formatMonth(certification.issue_date)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setEditing((v) => !v)} aria-expanded={editing} className="min-h-9 px-2 text-sm underline underline-offset-4">
            {editing ? "Fermer" : "Modifier"}
          </button>
          <DeleteButton action={deleteAction} />
        </div>
      </div>
      {editing && (
        <div className="mt-4 border-t border-line pt-4">
          <CertificationForm certification={certification} action={action} />
        </div>
      )}
    </li>
  );
}
