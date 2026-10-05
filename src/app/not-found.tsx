import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-ink p-6 text-paper sm:p-12">
      <p className="eyebrow text-smoke">Erreur 404</p>
      <div>
        <h1 className="display-xl">
          Page <em className="font-serif font-normal">introuvable</em>.
        </h1>
        <p className="mt-6 max-w-xl text-xl text-smoke">Le contenu que vous cherchez a été déplacé ou n&apos;existe plus.</p>
      </div>
      <Link href="/" className="link-underline self-start text-lg">
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
