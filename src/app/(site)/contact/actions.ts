"use server";

import { getPublicClient } from "@/lib/supabase/public";
import { contactSchema, type FormState } from "@/lib/validation/contact";

/** Enregistre un message de contact. Protection anti-spam : champ piège + délai minimal. */
export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  // Champ invisible rempli = robot → on fait semblant d'accepter.
  if (formData.get("website")) return { status: "success", message: "Merci, votre message a bien été envoyé." };

  const startedAt = Number(formData.get("started_at"));
  if (Number.isFinite(startedAt) && Date.now() - startedAt < 2500) {
    return { status: "error", message: "Envoi trop rapide, veuillez réessayer." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Merci de corriger les champs indiqués.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const db = getPublicClient();
  if (!db) {
    return { status: "success", message: "Mode démo : le formulaire fonctionne, mais le message n'est pas enregistré (Supabase non configuré)." };
  }

  const { error } = await db.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("[contact]", error);
    return { status: "error", message: "Une erreur est survenue. Réessayez ou écrivez-moi directement par e-mail." };
  }

  return { status: "success", message: "Merci ! Votre message a bien été envoyé. Je vous réponds rapidement." };
}
