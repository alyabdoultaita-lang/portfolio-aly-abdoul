"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/validation/contact";
import { signIn } from "./actions";

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, { status: "idle" });
  const message = state.message ?? notice;

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label htmlFor="email" className="eyebrow text-stone">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          className="mt-2 min-h-12 w-full border border-line bg-paper px-4 outline-none focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="password" className="eyebrow text-stone">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          className="mt-2 min-h-12 w-full border border-line bg-paper px-4 outline-none focus:border-ink"
        />
      </div>
      {message && (
        <p role="alert" className="border-l-2 border-ink pl-3 text-sm font-medium">
          {message}
        </p>
      )}
      <button type="submit" disabled={pending} className="min-h-12 w-full bg-ink font-medium text-paper disabled:opacity-60">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
