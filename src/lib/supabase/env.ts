/** Lecture centralisée des variables d'environnement Supabase. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** `false` → mode local : contenu du CV (src/content/cv.ts) + articles d'exemple. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
