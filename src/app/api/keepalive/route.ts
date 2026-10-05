import { getPublicClient } from "@/lib/supabase/public";

/**
 * Réveil quotidien de Supabase.
 * Le plan gratuit met le projet en pause après 7 jours sans activité, ce qui
 * viderait le site. Une tâche planifiée Vercel (vercel.json › crons) appelle
 * cette route chaque jour : une petite lecture suffit à maintenir le projet actif.
 * Lecture seule, aucune donnée renvoyée.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Si CRON_SECRET est défini sur Vercel, seules les tâches planifiées peuvent appeler la route.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const db = getPublicClient();
  if (!db) return Response.json({ ok: true, supabase: "non configuré" });

  const { error } = await db.from("site_settings").select("key").limit(1);
  if (error) {
    console.error("[keepalive]", error);
    return Response.json({ ok: false }, { status: 503 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
