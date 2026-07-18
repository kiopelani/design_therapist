import { formatEnrichedInspirationForPrompt } from "./style-inspiration";
import type {
  DesignBrief,
  EnrichedInspiration,
  GenerateRequest,
  RoomAnalysisResult,
  RoomInput,
  SelectedInspiration,
} from "./types";
import { getRoomSizeDescription } from "./types";

export function buildRoomVisionAnalysisPrompt(
  roomType: string,
  constraints: string,
): string {
  return `You are an expert interior designer analyzing a photo of a client's actual ${roomType}.

Study the attached room photo carefully. Identify layout, architectural features (windows, doors, ceiling height, built-ins), existing furniture and decor, wall/floor conditions, lighting, and spatial constraints.

Client constraints: ${constraints || "None specified"}

Respond with ONLY valid JSON matching this schema:
{
  "layout": "room shape, proportions, and spatial flow",
  "architecturalFeatures": "windows, doors, moldings, built-ins, and fixed elements to preserve",
  "existingFurniture": "notable furniture and decor already in the room",
  "conditions": "wall/floor condition, rental limitations visible, wear, or other practical notes",
  "summary": "concise synthesis of how to tailor a redesign to this specific room"
}`;
}

export function formatRoomAnalysisForPrompt(analysis: RoomAnalysisResult): string {
  if (!analysis.summary) {
    return "No room photo provided.";
  }

  return `Client's actual room (from photo analysis):
- Layout: ${analysis.layout}
- Architectural features to preserve: ${analysis.architecturalFeatures}
- Existing furniture: ${analysis.existingFurniture}
- Conditions: ${analysis.conditions}
- Summary: ${analysis.summary}`;
}

export function enhanceImagePromptWithRoom(
  imagePrompt: string,
  analysis: RoomAnalysisResult,
): string {
  if (!analysis.summary) {
    return imagePrompt;
  }

  return `${imagePrompt}

Tailor the room to match this actual space: ${analysis.summary}. Preserve architectural features: ${analysis.architecturalFeatures}.`;
}

export function buildRoomEditPrompt(
  brief: DesignBrief,
  analysis: RoomAnalysisResult,
  room: RoomInput,
): string {
  return `Redesign this ${room.type} in a photorealistic interior design style while preserving the room's layout, window positions, door locations, ceiling, and architectural structure.

Design direction: ${brief.title}
Overview: ${brief.description}
Color palette: ${brief.palette.join(", ")}
Key pieces to incorporate: ${brief.keyPieces.join(", ")}
Layout guidance: ${brief.layoutNotes}
Room analysis: ${analysis.summary || "Preserve the existing room structure."}
Architectural features to keep: ${analysis.architecturalFeatures || "Keep all windows, doors, and fixed elements in place."}
Existing furniture notes: ${analysis.existingFurniture || "Replace or restyle as needed."}
Client constraints: ${room.constraints || "None"}

Apply the new style through furniture, textiles, lighting, wall treatments, and decor. The result should look like a professionally styled, wide-angle interior photo with natural lighting and no people.`;
}

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
  roomAnalysis: RoomAnalysisResult,
): string {
  const { room, style } = input;
  const roomPhotoSection = formatRoomAnalysisForPrompt(roomAnalysis);

  return `You are an expert interior designer. Create a customized room design brief based on the client's inputs.

Room type: ${room.type}
Room size: ${getRoomSizeDescription(room)}
Constraints: ${room.constraints || "None specified"}

${roomPhotoSection}

Style inspiration (rooms the client selected, with visual analysis):
${formatEnrichedInspirationForPrompt(enriched, combinedStyleSummary)}
Budget: ${style.budget}

When a room photo analysis is provided, tailor layout notes and imagePrompt to the actual space — preserve windows, doors, and fixed architecture; work around or incorporate existing furniture where appropriate.

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
  roomAnalysis: RoomAnalysisResult,
): string {
  const budget = input.style.budget;
  const budgetRules = {
    low: {
      label: "Low budget",
      guidance:
        "Budget retailers (IKEA, Target, Amazon basics). Prioritize value and affordability.",
      estPriceRule: "Each item must be under $100. Use estPrice ranges like $25-$80.",
      searchHint: 'Include terms like "affordable" or "budget" in searchQuery.',
    },
    medium: {
      label: "Medium budget",
      guidance: "Mid-range brands. Balance quality and cost.",
      estPriceRule: "Each item must be $50-$400. Use estPrice ranges like $80-$250.",
      searchHint: "Use neutral product search terms without budget or luxury modifiers.",
    },
    high: {
      label: "High budget",
      guidance: "Designer and premium brands. Quality over savings.",
      estPriceRule: "Each item must be $150 or more. Use estPrice ranges like $200-$800.",
      searchHint: 'Include terms like "designer" or "premium" in searchQuery.',
    },
  }[budget];
  const roomPhotoSection = formatRoomAnalysisForPrompt(roomAnalysis);

  return `You are an expert interior designer creating a shopping list for a room makeover.

Design: ${brief.title}
Overview: ${brief.description}
Palette: ${brief.palette.join(", ")}
Key pieces: ${brief.keyPieces.join(", ")}
Layout notes: ${brief.layoutNotes}
Room: ${input.room.type} (${getRoomSizeDescription(input.room)})

${roomPhotoSection}

Style inspiration (with visual analysis):
${formatEnrichedInspirationForPrompt(enriched, combinedStyleSummary)}

Selected budget: ${budgetRules.label}
Budget guidance: ${budgetRules.guidance}
Price rule: ${budgetRules.estPriceRule}
Search query hint: ${budgetRules.searchHint}
Constraints: ${input.room.constraints || "None"}

When a room photo analysis is provided, only list items needed for the makeover — skip furniture the client should keep, and note placement relative to the actual room.

Create a practical shopping list with 10-16 items covering furniture, lighting, textiles, decor, and finishing touches. Every item must respect the selected budget tier and price rule.

Respond with ONLY valid JSON matching this schema:
{
  "shoppingList": [
    {
      "category": "Furniture | Lighting | Textiles | Decor | Paint & Finishes | Storage",
      "item": "specific product description for display",
      "searchQuery": "concise Google Shopping search string for this item",
      "notes": "optional sizing or placement note",
      "estPrice": "estimated price range that fits the selected budget tier"
    }
  ]
}`;
}
