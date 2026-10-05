/**
 * Redimensionne une photo dans le navigateur avant son envoi :
 * - côté le plus long limité à `maxSize` px (2000 par défaut, largement
 *   suffisant pour un écran Retina) ;
 * - conversion en WebP (ou JPEG si le navigateur ne sait pas encoder le WebP) ;
 * - orientation EXIF des photos de téléphone respectée.
 * Les SVG, GIF (animations) et fichiers non-image sont renvoyés tels quels,
 * de même que les images déjà petites ou que la conversion n'allègerait pas.
 */
export async function resizeImage(file: File, maxSize = 2000, quality = 0.85): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // format non décodable par le navigateur : envoi sans modification
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 1_500_000) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  let blob = await toBlob("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
  if (!blob || blob.size >= file.size) return file;

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + `.${ext}`, { type: blob.type });
}
