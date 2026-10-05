"use server";

import { adminClient } from "@/lib/auth";
import { certificationSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

export async function saveCertification(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const parsed = certificationSchema.safeParse({
    name: form.str(fd, "name"),
    issuer: form.str(fd, "issuer"),
    issue_date: form.opt(fd, "issue_date"),
    expiry_date: form.opt(fd, "expiry_date"),
    credential_id: form.opt(fd, "credential_id"),
    credential_url: form.opt(fd, "credential_url"),
    sort_order: form.int(fd, "sort_order"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const { error } = id
    ? await supabase.from("certifications").update(parsed.data).eq("id", id)
    : await supabase.from("certifications").insert(parsed.data);
  if (error) return dbError(error);

  revalidateSite();
  return { status: "success", message: id ? "Certification mise à jour." : "Certification ajoutée." };
}

export async function deleteCertification(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}
