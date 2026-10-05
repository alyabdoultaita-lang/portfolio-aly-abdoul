"use client";

import { createContext, startTransition, useActionState, useContext, type FormEvent, type ReactNode } from "react";
import type { FormState } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

const ErrorsContext = createContext<FormState["fieldErrors"]>(undefined);

/** Erreurs de validation du champ `name` renvoyées par la Server Action. */
export function useFieldError(name: string) {
  return useContext(ErrorsContext)?.[name]?.[0];
}

/**
 * Formulaire admin générique : Server Action + état (succès / erreurs),
 * barre d'enregistrement collante en bas d'écran.
 */
export function ActionForm({
  action,
  children,
  submitLabel = "Enregistrer",
  className,
  aside,
  compact,
}: {
  action: Action;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  aside?: ReactNode;
  /** Barre d'enregistrement simple (formulaires courts, en ligne). */
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState);

  // Soumission manuelle : évite la réinitialisation automatique du formulaire
  // par React 19, pour ne pas perdre la saisie en cas d'erreur de validation.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <ErrorsContext.Provider value={state.fieldErrors}>
      <form onSubmit={onSubmit} className={cn(compact ? "space-y-3" : "space-y-8", className)} noValidate>
        {children}
        <div
          className={
            compact
              ? "flex flex-wrap items-center justify-between gap-3"
              : "sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-4 border-t border-line bg-mist/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8"
          }
        >
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={cn("text-sm", state.status === "error" ? "font-medium text-ink" : "text-stone")}
          >
            {state.status === "error" && "⚠ "}
            {state.status === "success" && "✓ "}
            {state.message}
          </p>
          <div className="flex items-center gap-3">
            {aside}
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 bg-ink px-6 text-sm font-medium text-paper transition-opacity disabled:opacity-60"
            >
              {pending ? "Enregistrement…" : submitLabel}
            </button>
          </div>
        </div>
      </form>
    </ErrorsContext.Provider>
  );
}
