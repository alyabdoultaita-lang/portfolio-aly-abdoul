import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Renvoie l'utilisateur connecté s'il est administrateur, sinon null.
 * `getUser()` valide le jeton auprès de Supabase (contrairement à getSession()).
 */
export const getAdmin = cache(async () => {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return data ? user : null;
});

/** Pour les pages admin : redirige vers la connexion si nécessaire. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login?error=unauthorized");
  return user;
}

/** Pour les Server Actions : renvoie un client authentifié ou lève une erreur. */
export async function adminClient() {
  const user = await getAdmin();
  if (!user) throw new Error("Non autorisé");
  return createSupabaseServerClient();
}
