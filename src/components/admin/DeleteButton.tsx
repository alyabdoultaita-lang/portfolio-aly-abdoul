"use client";

import { useTransition } from "react";

/** Bouton de suppression avec confirmation ; appelle une Server Action liée à l'id. */
export function DeleteButton({ action, label = "Supprimer", confirmText = "Supprimer définitivement cet élément ?" }: { action: () => Promise<void>; label?: string; confirmText?: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmText)) start(() => action());
      }}
      className="min-h-9 px-2 text-sm text-stone underline decoration-line underline-offset-4 hover:text-ink disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}
