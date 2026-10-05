import Image, { type ImageProps } from "next/image";

const optimizableHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

/** Seules les images locales et celles du stockage Supabase passent par l'optimiseur. */
function canOptimize(src: string) {
  if (src.endsWith(".svg")) return false;
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname === optimizableHost;
  } catch {
    return false;
  }
}

/**
 * Wrapper de next/image : AVIF/WebP redimensionnés pour les images connues,
 * affichage direct pour les SVG de démo et les URL externes saisies dans l'admin.
 */
export function SmartImage({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image alt={alt} {...props} unoptimized={props.unoptimized ?? (src !== "" && !canOptimize(src))} />;
}
