import { formatEnrichedInspirationForPrompt } from "./style-inspiration";
import type {
  EnrichedInspiration,
  GenerateRequest,
  SelectedInspiration,
} from "./types";
import { getRoomSizeDescription } from "./types";

export function buildVisionAnalysisPrompt(
  roomType: string,
  inspirations: SelectedInspiration[],
): string {
  const photoList = inspirations
    .map((item, index) => `${index + 1}. id="${item.id}" label="${item.label}"`)
    .join("\n");

  return `You are an expert interior designer analyzing room inspiration photos selected by a client designing their ${roomType}.

The images are attached in order:
${photoList}

For each photo, analyze: color palette, materials and textures, furniture style, decor elements, lighting, mood, and overall design aesthetic.

Respond with ONLY valid JSON matching this schema:
{
  "photos": [
    { "id": "photo id from list", "analysis": "detailed style analysis for this room photo" }
  ],
  "combinedStyleSummary": "synthesized style direction combining all selected photos for a cohesive ${roomType} design"
}`;
}

export function buildDesignBriefPrompt(
  input: GenerateRequest,
  enriched: EnrichedInspiration[],
  combinedStyleSummary: string,
): string {
  const { room, style } = input;

  return `You are an expert interior designer. Create a customized room design brief based on the client's inputs.

Room type: ${room.type}
Room size: ${getRoomSizeDescription(room)}
Constraints: ${room.constraints || "None specified"}

Style inspiration (rooms the client selected, with visual analysis):
${formatEnrichedInspirationForPrompt(enriched, combinedStyleSummary)}
Budget: ${style.budget}

Respond with ONLY valid JSON matching this schema:
{
  "title": "short evocative design title",
  "description": "2-3 sentence design overview",
  "palette": ["color1", "color2", "color3", "color4"],
  "keyPieces": ["furniture or decor item 1", "item 2", "item 3", "item 4", "item 5"],
  "layoutNotes": "brief layout and placement guidance",
  "imagePrompt": "detailed image generation prompt for a photorealistic interior design photo of this room, wide angle, natural lighting, professionally styled, no people"
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
  enriched: EnrichedInspiration[],
  combinedStyleSummary: string,
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
Room: ${input.room.type} (${getRoomSizeDescription(input.room)})
Style inspiration (with visual analysis):
${formatEnrichedInspirationForPrompt(enriched, combinedStyleSummary)}
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
