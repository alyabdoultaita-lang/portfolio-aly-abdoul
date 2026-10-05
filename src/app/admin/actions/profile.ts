"use server";

import { adminClient } from "@/lib/auth";
import { profileSchema } from "@/lib/validation/admin";
import type { FormState } from "@/lib/validation/contact";
import { dbError, form, revalidateSite, validationError } from "./helpers";

export async function saveProfile(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const supabase = await adminClient();
  const parsed = profileSchema.safeParse({
    full_name: form.str(fd, "full_name"),
    headline: form.str(fd, "headline"),
    tagline: form.opt(fd, "tagline"),
    short_bio: form.opt(fd, "short_bio"),
    bio: form.opt(fd, "bio"),
    location: form.opt(fd, "location"),
    email: form.opt(fd, "email"),
    phone: form.opt(fd, "phone"),
    photo_url: form.opt(fd, "photo_url"),
    cv_url: form.opt(fd, "cv_url"),
    linkedin_url: form.opt(fd, "linkedin_url"),
    twitter_url: form.opt(fd, "twitter_url"),
    github_url: form.opt(fd, "github_url"),
    website_url: form.opt(fd, "website_url"),
    available_for_work: form.bool(fd, "available_for_work"),
    languages: form.csv(fd, "languages"),
    interests: form.csv(fd, "interests"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const { error } = id
    ? await supabase.from("profiles").update(parsed.data).eq("id", id)
    : await supabase.from("profiles").insert({ ...parsed.data, is_primary: true });
  if (error) return dbError(error);

  revalidateSite();
  return { status: "success", message: "Profil enregistré." };
}
