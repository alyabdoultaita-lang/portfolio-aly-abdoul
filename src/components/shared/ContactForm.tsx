"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { sendMessage } from "@/app/(site)/contact/actions";
import type { FormState } from "@/lib/validation/contact";
import { ArrowIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const initial: FormState = { status: "idle" };

function Field({
  id,
  label,
  error,
  textarea,
  ...props
}: {
  id: string;
  label: string;
  error?: string[];
  textarea?: boolean;
} & InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const cls =
    "peer w-full border-b border-line bg-transparent pb-3 pt-2 text-xl outline-none transition-colors placeholder:text-transparent focus:border-ink aria-invalid:border-ink";
  return (
    <div className="relative pt-6">
      {textarea ? (
        <textarea id={id} name={id} rows={6} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className={cn(cls, "resize-y")} {...props} />
      ) : (
        <input id={id} name={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className={cls} {...props} />
      )}
      <label htmlFor={id} className="eyebrow absolute left-0 top-0 text-stone">
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium">
          ↳ {error[0]}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const startedRef = useRef<HTMLInputElement>(null);

  // Horodatage posé côté client (anti-robot) ; évite un écart d'hydratation.
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div role="status" className="border border-ink p-8 sm:p-12">
        <p className="eyebrow text-stone">Message envoyé</p>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{state.message}</p>
      </div>
    );
  }

  // Soumission manuelle pour conserver la saisie en cas d'erreur.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="Nom complet *" autoComplete="name" required maxLength={120} error={state.fieldErrors?.name} />
        <Field id="email" label="E-mail *" type="email" autoComplete="email" required maxLength={200} error={state.fieldErrors?.email} />
      </div>
      <Field id="subject" label="Sujet" maxLength={200} error={state.fieldErrors?.subject} />
      <Field id="message" label="Votre message *" textarea required maxLength={5000} error={state.fieldErrors?.message} />

      {/* Anti-spam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedRef} type="hidden" name="started_at" defaultValue="" />

      {state.status === "error" && state.message && (
        <p role="alert" className="border-l-2 border-ink pl-4 font-medium">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex min-h-14 w-full items-center justify-between gap-4 bg-ink px-6 text-lg font-medium text-paper transition-opacity disabled:opacity-60 sm:w-auto sm:min-w-72"
      >
        {pending ? "Envoi en cours…" : "Envoyer le message"}
        <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
