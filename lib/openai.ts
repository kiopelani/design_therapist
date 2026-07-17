import OpenAI from "openai";
import {
  buildDesignBriefPrompt,
  buildShoppingListPrompt,
} from "./prompts";
import type {
  DesignBrief,
  GenerateRequest,
  GenerateResponse,
  ShoppingListItem,
} from "./types";

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

export async function generateDesignBrief(
  input: GenerateRequest,
): Promise<DesignBrief> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: buildDesignBriefPrompt(input),
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
  const response = await client.images.generate({
    model: "gpt-image-1",
    prompt: imagePrompt,
    n: 1,
    size: "1024x1024",
  });

  const b64 = response.data?.[0]?.b64_json;
  if (b64) {
    return `data:image/png;base64,${b64}`;
  }

  const imageUrl = response.data?.[0]?.url;
  if (imageUrl) {
    return imageUrl;
  }

  throw new Error("No image returned from image generation");
}

export async function generateShoppingList(
  input: GenerateRequest,
  brief: DesignBrief,
): Promise<ShoppingListItem[]> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: buildShoppingListPrompt(input, brief),
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
  const brief = await generateDesignBrief(input);
  const [imageUrl, shoppingList] = await Promise.all([
    generateRoomImage(brief.imagePrompt),
    generateShoppingList(input, brief),
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
}
