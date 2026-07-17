import { NextResponse } from "next/server";
import { generateDesign } from "@/lib/openai";
import type { GenerateRequest } from "@/lib/types";
import { hasValidRoomSize, hasValidStyleSelection, isValidRoomPhoto } from "@/lib/types";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.room?.type) {
      return NextResponse.json(
        { error: "Room type is required." },
        { status: 400 },
      );
    }

    if (!hasValidStyleSelection(body.style)) {
      return NextResponse.json(
        { error: "Please select at least one inspiration photo." },
        { status: 400 },
      );
    }

    if (!hasValidRoomSize(body.room)) {
      return NextResponse.json(
        { error: "Please provide both length and width for custom room dimensions." },
        { status: 400 },
      );
    }

    if (body.room.roomPhoto && !isValidRoomPhoto(body.room.roomPhoto)) {
      return NextResponse.json(
        { error: "Invalid room photo. Please upload a JPEG, PNG, or WebP image under 2 MB." },
        { status: 400 },
      );
    }

    const result = await generateDesign(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate design";

    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
