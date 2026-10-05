import type { Metadata } from "next";
import Link from "next/link";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  const notice = sp.error === "unauthorized" ? "Session expirée ou droits insuffisants. Reconnectez-vous." : undefined;

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <p className="eyebrow text-smoke">A.A.T — Administration</p>
        <p className="display-lg">
          Back<em className="font-serif font-normal">office</em>.
        </p>
        <p className="eyebrow text-smoke">Accès réservé</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Connexion</h1>
          <p className="mt-2 text-stone">Espace d&apos;administration du portfolio.</p>
          <div className="mt-10">{isSupabaseConfigured ? <LoginForm next={next} notice={notice} /> : <SetupNotice />}</div>
          <Link href="/" className="link-underline mt-10 inline-block text-sm text-stone">
            ← Retour au site
          </Link>
        </div>
      </section>
    </main>
  );
}
