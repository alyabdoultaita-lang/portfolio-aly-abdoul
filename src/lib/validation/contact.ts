import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom (2 caractères minimum).").max(120),
  email: z.email("Adresse e-mail invalide.").max(200),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Votre message est trop court (10 caractères minimum).").max(5000, "Message trop long (5000 caractères max)."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
