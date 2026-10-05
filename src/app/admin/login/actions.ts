"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/validation/contact";

const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(6, "Mot de passe trop court."),
});

/** N'accepte que des chemins internes à /admin (évite les redirections ouvertes). */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin";
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) {
    return { status: "error", message: "Vérifiez vos identifiants.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    // Message volontairement générique (ne révèle pas si le compte existe).
    return { status: "error", message: "E-mail ou mot de passe incorrect." };
  }

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { status: "error", message: "Ce compte n'a pas les droits d'administration." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
