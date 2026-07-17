import { NextResponse } from "next/server";
import { generateDesign } from "@/lib/openai";
import type { GenerateRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.room?.type || !body.style?.styles?.length) {
      return NextResponse.json(
        { error: "Room type and at least one style are required." },
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
