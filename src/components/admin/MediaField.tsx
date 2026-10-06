"use client";

import { useId, useState } from "react";
import { resizeImage } from "@/lib/client/resize-image";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { useFieldError } from "./ActionForm";

const MAX_SIZE = 10 * 1024 * 1024;

/**
 * Envoie un fichier dans le bucket « media » et renvoie son URL publique.
 * Les photos sont d'abord redimensionnées (2400 px max, WebP) : envoi plus
 * rapide et pages plus légères, même depuis un téléphone.
 */
export async function uploadMedia(original: File, folder: string) {
  const file = await resizeImage(original);
  if (file.size > MAX_SIZE) throw new Error("Fichier trop volumineux (10 Mo maximum).");
  const supabase = createSupabaseBrowserClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/**
 * Champ image / fichier : upload direct vers Supabase Storage (bucket public
 * « media »), ou saisie manuelle d'une URL. La valeur envoyée au serveur est l'URL.
 */
export function MediaField({
  name,
  label,
  defaultValue,
  folder,
  accept = "image/*",
  kind = "image",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: string;
  accept?: string;
  kind?: "image" | "file";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState<{ url: string; w: number; h: number } | null>(null);
  const size = dims?.url === url ? dims : null;
  const fieldError = useFieldError(name);
  const inputId = useId();

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setUrl(await uploadMedia(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2 text-stone">{label}</p>
      <div className="flex flex-col gap-3">
        {kind === "image" && (
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-line bg-mist">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element -- aperçu admin d'une URL arbitraire
              <img
                src={url}
                alt=""
                className="size-full object-cover"
                onLoad={(e) => setDims({ url, w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              />
            ) : (
              <span className="eyebrow absolute inset-0 flex items-center justify-center text-stone">Aucune image</span>
            )}
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… ou envoyez un fichier"
            aria-label={`${label} (URL)`}
            className="w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex min-h-10 cursor-pointer items-center border border-ink px-3 text-sm hover:bg-ink hover:text-paper"
            >
              {busy ? "Optimisation et envoi…" : "Choisir un fichier"}
            </label>
            <input id={inputId} type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            {url && (
              <>
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center px-2 text-sm underline">
                  Ouvrir
                </a>
                <button type="button" onClick={() => setUrl("")} className="inline-flex min-h-10 items-center px-2 text-sm text-stone underline">
                  Retirer
                </button>
              </>
            )}
          </div>
          {kind === "image" && size && size.w > 0 && (
            <p className="text-xs text-stone">
              Taille : {size.w} × {size.h} px
              {Math.max(size.w, size.h) < 1200 && (
                <strong className="ml-1 font-semibold text-ink">
                  — image trop petite, elle paraîtra floue sur le site. Envoyez l&apos;original (1200 px minimum, idéalement 2000 px).
                </strong>
              )}
            </p>
          )}
          {(error || fieldError) && <p className="text-xs font-semibold">↳ {error ?? fieldError}</p>}
        </div>
      </div>
    </div>
  );
}
