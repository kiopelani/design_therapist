const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_ORIGINAL_BYTES = 10 * 1024 * 1024;
const MAX_LONG_EDGE = 1536;
const JPEG_QUALITY = 0.85;

export const MAX_ROOM_PHOTO_UPLOAD_BYTES = MAX_ORIGINAL_BYTES;

export async function processRoomPhotoFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, or WebP image.");
  }

  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("Image is too large. Please use a photo under 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Could not process this image. Please try another photo.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  if (!dataUrl.startsWith("data:image/jpeg;base64,")) {
    throw new Error("Could not process this image. Please try another photo.");
  }

  return dataUrl;
}
