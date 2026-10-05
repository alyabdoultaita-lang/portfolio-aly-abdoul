import "server-only";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/validation/contact";
import { csvToArray, linesToArray } from "@/lib/utils";

/** Lecture typée des champs d'un FormData. */
export const form = {
  str: (fd: FormData, key: string) => {
    const v = fd.get(key);
    return typeof v === "string" ? v.trim() : "";
  },
  /** Chaîne vide → null (colonnes facultatives). */
  opt: (fd: FormData, key: string) => {
    const v = fd.get(key);
    return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
  },
  bool: (fd: FormData, key: string) => fd.get(key) === "on",
  int: (fd: FormData, key: string, fallback = 0) => {
    const n = Number.parseInt(String(fd.get(key) ?? ""), 10);
    return Number.isFinite(n) ? n : fallback;
  },
  lines: (fd: FormData, key: string) => linesToArray(String(fd.get(key) ?? "")),
  csv: (fd: FormData, key: string) => csvToArray(String(fd.get(key) ?? "")),
};

export function validationError(error: z.ZodError): FormState {
  return {
    status: "error",
    message: "Certains champs sont invalides.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

export function dbError(error: { message: string; code?: string }): FormState {
  console.error("[admin]", error);
  if (error.code === "23505") return { status: "error", message: "Cette valeur existe déjà (slug ou nom en double)." };
  return { status: "error", message: `Erreur base de données : ${error.message}` };
}

/** Rafraîchit tout le site public (ISR) après une modification. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

export const UNAUTHORIZED: FormState = {
  status: "error",
  message: "Session expirée ou droits insuffisants : reconnectez-vous (votre saisie est conservée).",
};

/**
 * Client Supabase de l'administrateur, ou null si la session n'est plus valide.
 * Les actions de formulaire renvoient alors UNAUTHORIZED au lieu de lever une
 * exception (qui afficherait une page d'erreur et ferait perdre la saisie).
 */
export async function adminClientOrNull() {
  return (await getAdmin()) ? createSupabaseServerClient() : null;
}
