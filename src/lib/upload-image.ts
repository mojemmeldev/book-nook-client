/**
 * Server-side book cover upload.
 *
 * - With `IMGBB_API_KEY` set in the environment → real upload to imgbb,
 *   the returned URL is stored in the database.
 * - Without a key → the image is stored as a data URL so the form works
 *   out of the box (drop a key into `.env.local` to switch to imgbb).
 *
 * (postimage.com has no public API, so imgbb is used instead.)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export class ImageUploadError extends Error {}

export async function uploadImage(file: File): Promise<string> {
  if (file.size === 0) {
    throw new ImageUploadError("The selected image is empty.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new ImageUploadError("Image must be 5 MB or smaller.");
  }

  const apiKey = process.env.IMGBB_API_KEY;

  if (apiKey) {
    const body = new FormData();
    body.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new ImageUploadError("Uploading the image to imgbb failed.");
    }

    const json = (await response.json()) as {
      data?: { url?: string; display_url?: string };
    };
    const url = json.data?.display_url ?? json.data?.url;

    if (!url) {
      throw new ImageUploadError("imgbb did not return an image URL.");
    }
    return url;
  }

  // No API key yet — keep the image inline so everything still works.
  const bytes = Buffer.from(await file.arrayBuffer());
  return `data:${file.type || "image/png"};base64,${bytes.toString("base64")}`;
}
