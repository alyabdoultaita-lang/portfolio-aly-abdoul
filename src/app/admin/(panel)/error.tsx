"use client";

import Link from "next/link";

/** Erreur dans l'admin (ex. suppression refusée, session expirée). */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="border border-ink bg-paper p-8">
      <p className="eyebrow text-stone">Erreur</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">L&apos;opération n&apos;a pas pu aboutir.</h1>
      <p className="mt-2 text-stone">
        {error.message === "Non autorisé"
          ? "Votre session a expiré ou vos droits ont changé."
          : "Réessayez ; si le problème persiste, vérifiez la configuration Supabase."}
      </p>
      <div className="mt-6 flex gap-4">
        <button type="button" onClick={reset} className="min-h-11 bg-ink px-5 text-sm text-paper">
          Réessayer
        </button>
        <Link href="/admin/login" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">
          Se reconnecter
        </Link>
      </div>
    </div>
  );
}
