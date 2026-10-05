/** Affiché quand Supabase n'est pas encore configuré. */
export function SetupNotice() {
  return (
    <div className="border border-ink bg-paper p-6 text-sm leading-relaxed">
      <p className="font-semibold">Supabase n&apos;est pas configuré.</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-stone">
        <li>Créez un projet sur supabase.com.</li>
        <li>Exécutez <code>supabase/migrations/0001_schema.sql</code> dans le SQL Editor.</li>
        <li>
          Renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans <code>.env.local</code> (ou sur Vercel).
        </li>
        <li>Créez votre utilisateur puis ajoutez-le à la table <code>admins</code> (voir README).</li>
      </ol>
    </div>
  );
}
