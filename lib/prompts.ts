import type { GenerateRequest } from "./types";

export function buildDesignBriefPrompt(input: GenerateRequest): string {
  const { room, style } = input;

  return `You are an expert interior designer. Create a customized room design brief based on the client's inputs.

Room type: ${room.type}
Room size: ${room.size}
Constraints: ${room.constraints || "None specified"}

Style preferences: ${style.styles.join(", ") || "Open to suggestions"}
Color preferences: ${style.colors || "Open to suggestions"}
Desired mood: ${style.mood || "Comfortable and inviting"}
Budget: ${style.budget}

Respond with ONLY valid JSON matching this schema:
{
  "title": "short evocative design title",
  "description": "2-3 sentence design overview",
  "palette": ["color1", "color2", "color3", "color4"],
  "keyPieces": ["furniture or decor item 1", "item 2", "item 3", "item 4", "item 5"],
  "layoutNotes": "brief layout and placement guidance",
  "imagePrompt": "detailed DALL-E prompt for a photorealistic interior design photo of this room, wide angle, natural lighting, professionally styled, no people"
}`;
}

export function buildShoppingListPrompt(
  input: GenerateRequest,
  brief: {
    title: string;
    description: string;
    palette: string[];
    keyPieces: string[];
    layoutNotes: string;
  },
): string {
  const budgetGuidance = {
    low: "budget-friendly, under $100 per item where possible",
    medium: "mid-range quality and pricing",
    high: "premium and designer-quality items",
  }[input.style.budget];

  return `You are an expert interior designer creating a shopping list for a room makeover.

Design: ${brief.title}
Overview: ${brief.description}
Palette: ${brief.palette.join(", ")}
Key pieces: ${brief.keyPieces.join(", ")}
Layout notes: ${brief.layoutNotes}
Room: ${input.room.type} (${input.room.size})
Budget guidance: ${budgetGuidance}
Constraints: ${input.room.constraints || "None"}

Create a practical shopping list with 10-16 items covering furniture, lighting, textiles, decor, and finishing touches. Respect the budget and constraints.

Respond with ONLY valid JSON matching this schema:
{
  "shoppingList": [
    {
      "category": "Furniture | Lighting | Textiles | Decor | Paint & Finishes | Storage",
      "item": "specific product description",
      "notes": "optional sizing or placement note",
      "estPrice": "optional estimated price range like $50-$80"
    }
  ]
}`;
}
