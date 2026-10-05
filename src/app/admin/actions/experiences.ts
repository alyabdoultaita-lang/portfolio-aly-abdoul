"use server";

import { redirect } from "next/navigation";
import { adminClient } from "@/lib/auth";
import { experienceSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { adminClientOrNull, dbError, form, revalidateSite, UNAUTHORIZED, validationError } from "./helpers";

export async function saveExperience(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClientOrNull();
  if (!supabase) return UNAUTHORIZED;
  const isCurrent = form.bool(fd, "is_current");

  const parsed = experienceSchema.safeParse({
    company: form.str(fd, "company"),
    role: form.str(fd, "role"),
    location: form.opt(fd, "location"),
    employment_type: form.opt(fd, "employment_type"),
    start_date: form.str(fd, "start_date"),
    end_date: isCurrent ? null : form.opt(fd, "end_date"),
    is_current: isCurrent,
    description: form.opt(fd, "description"),
    responsibilities: form.lines(fd, "responsibilities"),
    achievements: form.lines(fd, "achievements"),
    results: form.lines(fd, "results"),
    tools: form.csv(fd, "tools"),
    company_url: form.opt(fd, "company_url"),
    logo_url: form.opt(fd, "logo_url"),
    sort_order: form.int(fd, "sort_order"),
    is_visible: form.bool(fd, "is_visible"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const query = id
    ? supabase.from("experiences").update(parsed.data).eq("id", id).select("id").single()
    : supabase.from("experiences").insert(parsed.data).select("id").single();
  const { error } = await query;
  if (error) return dbError(error);

  revalidateSite();
  if (!id) redirect("/admin/experiences?created=1");
  return { status: "success", message: "Expérience enregistrée." };
}

export async function deleteExperience(id: string) {
  const supabase = await adminClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/experiences");
}
