import OpenAI from "openai";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";
import {
  buildDesignBriefPrompt,
  buildRoomEditPrompt,
  buildRoomVisionAnalysisPrompt,
  buildShoppingListPrompt,
  buildVisionAnalysisPrompt,
  enhanceImagePromptWithRoom,
} from "./prompts";
import { dataUrlToFile } from "./image-data";
import type {
  DesignBrief,
  EnrichedInspiration,
  GenerateRequest,
  GenerateResponse,
  InspirationAnalysisResult,
  RoomAnalysisResult,
  SelectedInspiration,
  ShoppingListItem,
  StyleVisionResult,
} from "./types";
import { EMPTY_ROOM_ANALYSIS } from "./types";

const IMAGE_MODELS = ["gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"] as const;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

function parseJson<T>(content: string): T {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }
  return JSON.parse(jsonMatch[0]) as T;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return "Invalid OpenAI API key. Check your OPENAI_API_KEY in .env.local.";
    }
    if (error.status === 429) {
      return "OpenAI rate limit reached. Please wait a moment and try again.";
    }
    if (error.message.includes("does not exist")) {
      return "The configured image model is unavailable on your API key.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to generate design";
}

function fallbackAnalysis(
  inspirations: SelectedInspiration[],
): InspirationAnalysisResult {
  return {
    enriched: inspirations.map((item) => ({ ...item })),
    combinedStyleSummary: "",
  };
}

function mergeVisionResult(
  inspirations: SelectedInspiration[],
  vision: StyleVisionResult,
): InspirationAnalysisResult {
  const analysisById = new Map(
    vision.photos.map((photo) => [photo.id, photo.analysis]),
  );

  return {
    enriched: inspirations.map((item) => ({
      ...item,
      visionAnalysis: analysisById.get(item.id),
    })),
    combinedStyleSummary: vision.combinedStyleSummary,
  };
}

export async function analyzeInspirationPhotos(
  inspirations: SelectedInspiration[],
  roomType: string,
): Promise<InspirationAnalysisResult> {
  if (!inspirations.length) {
    return fallbackAnalysis(inspirations);
  }

  try {
    const client = getClient();
    const content: ChatCompletionContentPart[] = [
      {
        type: "text",
        text: buildVisionAnalysisPrompt(roomType, inspirations),
      },
      ...inspirations.map(
        (item): ChatCompletionContentPart => ({
          type: "image_url",
          image_url: {
            url: item.imageUrl,
            detail: "low",
          },
        }),
      ),
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      return fallbackAnalysis(inspirations);
    }

    const vision = parseJson<StyleVisionResult>(message);
    return mergeVisionResult(inspirations, vision);
  } catch {
    return fallbackAnalysis(inspirations);
  }
}

function normalizeImageResponse(
  data: { b64_json?: string | null; url?: string | null } | undefined,
): string {
  const b64 = data?.b64_json;
  if (b64) {
    return `data:image/png;base64,${b64}`;
  }

  const imageUrl = data?.url;
  if (imageUrl) {
    return imageUrl;
  }

  throw new Error("No image returned from image generation");
}

export async function analyzeRoomPhoto(
  photoDataUrl: string | null | undefined,
  roomType: string,
  constraints: string,
): Promise<RoomAnalysisResult> {
  if (!photoDataUrl) {
    return EMPTY_ROOM_ANALYSIS;
  }

  try {
    const client = getClient();
    const content: ChatCompletionContentPart[] = [
      {
        type: "text",
        text: buildRoomVisionAnalysisPrompt(roomType, constraints),
      },
      {
        type: "image_url",
        image_url: {
          url: photoDataUrl,
          detail: "high",
        },
      },
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content }],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      return { ...EMPTY_ROOM_ANALYSIS, hasPhoto: true };
    }

    const analysis = parseJson<Omit<RoomAnalysisResult, "hasPhoto">>(message);
    return {
      layout: analysis.layout ?? "",
      architecturalFeatures: analysis.architecturalFeatures ?? "",
      existingFurniture: analysis.existingFurniture ?? "",
      conditions: analysis.conditions ?? "",
      summary: analysis.summary ?? "",
      hasPhoto: true,
    };
  } catch {
    return { ...EMPTY_ROOM_ANALYSIS, hasPhoto: true };
  }
}

export async function generateDesignBrief(
  input: GenerateRequest,
  enriched: EnrichedInspiration[],
  combinedStyleSummary: string,
  roomAnalysis: RoomAnalysisResult,
): Promise<DesignBrief> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: buildDesignBriefPrompt(
          input,
          enriched,
          combinedStyleSummary,
          roomAnalysis,
        ),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No design brief returned from AI");
  }

  return parseJson<DesignBrief>(content);
}

export async function generateRoomImage(imagePrompt: string): Promise<string> {
  const client = getClient();
  let lastError: unknown;

  for (const model of IMAGE_MODELS) {
    try {
      const response = await client.images.generate({
        model,
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
      });

      return normalizeImageResponse(response.data?.[0]);
    } catch (error) {
      lastError = error;
      const message = getErrorMessage(error);
      const shouldTryNext =
        message.includes("does not exist") || message.includes("not found");

      if (!shouldTryNext) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No supported image model is available on your API key");
}

export async function editRoomImage(
  photoDataUrl: string,
  editPrompt: string,
): Promise<string> {
  const client = getClient();
  const imageFile = await dataUrlToFile(photoDataUrl, "room.jpg");
  let lastError: unknown;

  for (const model of IMAGE_MODELS) {
    try {
      const response = await client.images.edit({
        model,
        image: imageFile,
        prompt: editPrompt,
        n: 1,
        size: "1024x1024",
      });

      return normalizeImageResponse(response.data?.[0]);
    } catch (error) {
      lastError = error;
      const message = getErrorMessage(error);
      const shouldTryNext =
        message.includes("does not exist") || message.includes("not found");

      if (!shouldTryNext) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No supported image model is available on your API key");
}

export async function generateShoppingList(
  input: GenerateRequest,
  brief: DesignBrief,
  enriched: EnrichedInspiration[],
  combinedStyleSummary: string,
  roomAnalysis: RoomAnalysisResult,
): Promise<ShoppingListItem[]> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: buildShoppingListPrompt(
          input,
          brief,
          enriched,
          combinedStyleSummary,
          roomAnalysis,
        ),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No shopping list returned from AI");
  }

  const parsed = parseJson<{ shoppingList: ShoppingListItem[] }>(content);
  if (!parsed.shoppingList?.length) {
    throw new Error("Shopping list was empty");
  }

  return parsed.shoppingList;
}

export async function generateDesign(
  input: GenerateRequest,
): Promise<GenerateResponse> {
  try {
    const [{ enriched, combinedStyleSummary }, roomAnalysis] = await Promise.all([
      analyzeInspirationPhotos(
        input.style.selectedInspirations,
        input.room.type,
      ),
      analyzeRoomPhoto(
        input.room.roomPhoto,
        input.room.type,
        input.room.constraints,
      ),
    ]);

    const brief = await generateDesignBrief(
      input,
      enriched,
      combinedStyleSummary,
      roomAnalysis,
    );

    const imagePromise = input.room.roomPhoto
      ? editRoomImage(
          input.room.roomPhoto,
          buildRoomEditPrompt(brief, roomAnalysis, input.room),
        ).catch(() =>
          generateRoomImage(
            enhanceImagePromptWithRoom(brief.imagePrompt, roomAnalysis),
          ),
        )
      : generateRoomImage(brief.imagePrompt);

    const [imageUrl, shoppingList] = await Promise.all([
      imagePromise,
      generateShoppingList(
        input,
        brief,
        enriched,
        combinedStyleSummary,
        roomAnalysis,
      ),
    ]);

    return {
      designSummary: {
        title: brief.title,
        description: brief.description,
        palette: brief.palette,
        keyPieces: brief.keyPieces,
      },
      imageUrl,
      shoppingList,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
