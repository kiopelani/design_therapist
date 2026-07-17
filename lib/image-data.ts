import { toFile } from "openai/uploads";

const DATA_URL_PATTERN = /^data:(image\/[a-z+]+);base64,(.+)$/i;

export function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } {
  const match = dataUrl.match(DATA_URL_PATTERN);
  if (!match) {
    throw new Error("Invalid image data URL");
  }

  return {
    mimeType: match[1].toLowerCase(),
    buffer: Buffer.from(match[2], "base64"),
  };
}

export function dataUrlToBuffer(dataUrl: string): Buffer {
  return parseDataUrl(dataUrl).buffer;
}

export async function dataUrlToFile(
  dataUrl: string,
  filename = "room.jpg",
): Promise<File> {
  const { mimeType, buffer } = parseDataUrl(dataUrl);
  return toFile(buffer, filename, { type: mimeType });
}
