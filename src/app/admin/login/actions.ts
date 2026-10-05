"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, safeAdminRedirect } from "@/lib/validation/auth";
import type { FormState } from "@/lib/validation/contact";

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

  redirect(safeAdminRedirect(formData.get("next")));
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
