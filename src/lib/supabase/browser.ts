"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Client navigateur (upload de fichiers depuis l'admin). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
