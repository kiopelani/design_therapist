import { NextResponse } from "next/server";
import { refineDesign } from "@/lib/openai";
import type { RefineDesignRequest } from "@/lib/types";
import {
  hasValidFeedback,
  hasValidRoomSize,
  hasValidStyleSelection,
  isValidRoomPhoto,
} from "@/lib/types";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RefineDesignRequest;

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

    if (!body.feedback || !hasValidFeedback(body.feedback)) {
      return NextResponse.json(
        { error: "Please provide feedback between 10 and 1000 characters." },
        { status: 400 },
      );
    }

    if (!body.previousDesign?.title || !body.previousDesign?.description) {
      return NextResponse.json(
        { error: "Previous design is required to refine." },
        { status: 400 },
      );
    }

    const result = await refineDesign(
      { room: body.room, style: body.style },
      body.previousDesign,
      body.feedback,
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to refine design";

    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
