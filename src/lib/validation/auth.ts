import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(6, "Mot de passe trop court."),
});

/** N'accepte que des chemins internes à /admin (évite les redirections ouvertes). */
export function safeAdminRedirect(value: unknown) {
  const next = typeof value === "string" ? value : "";
  return /^\/admin(\/[\w\-/]*)?$/.test(next) && !next.includes("//") ? next : "/admin";
}
