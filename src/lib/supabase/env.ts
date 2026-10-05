/** Lecture centralisée des variables d'environnement Supabase. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** `false` → le site fonctionne en mode démonstration (src/content/demo.ts). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
