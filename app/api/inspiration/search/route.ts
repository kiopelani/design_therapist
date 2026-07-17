import { NextResponse } from "next/server";
import { searchInspirationPhotos } from "@/lib/unsplash";
import { buildSearchQuery } from "@/lib/style-inspiration";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const roomType = searchParams.get("roomType");
    const query = buildSearchQuery({ q, roomType });

    const photos = await searchInspirationPhotos({ query });
    return NextResponse.json({ photos });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search inspiration photos";

    const status = message.includes("UNSPLASH_ACCESS_KEY")
      ? 503
      : message.includes("rate limit")
        ? 429
        : 500;

    return NextResponse.json({ error: message, photos: [] }, { status });
  }
}
