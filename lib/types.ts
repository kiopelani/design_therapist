export type RoomSize = "small" | "medium" | "large";
export type SizeMode = "approximate" | "custom";
export type DimensionUnit = "ft" | "m";
export type Budget = "low" | "medium" | "high";

export interface CustomDimensions {
  length: string;
  width: string;
  unit: DimensionUnit;
}

export interface RoomInput {
  type: string;
  sizeMode: SizeMode;
  size: RoomSize;
  customDimensions: CustomDimensions;
  constraints: string;
  roomPhoto?: string | null;
}

export interface RoomAnalysisResult {
  layout: string;
  architecturalFeatures: string;
  existingFurniture: string;
  conditions: string;
  summary: string;
  hasPhoto: boolean;
}

export interface SelectedInspiration {
  id: string;
  imageUrl: string;
  label: string;
  styleDescription: string;
  credit: string;
}

export interface EnrichedInspiration extends SelectedInspiration {
  visionAnalysis?: string;
}

export interface StyleVisionResult {
  photos: { id: string; analysis: string }[];
  combinedStyleSummary: string;
}

export interface InspirationAnalysisResult {
  enriched: EnrichedInspiration[];
  combinedStyleSummary: string;
}

export interface StyleInput {
  selectedInspirations: SelectedInspiration[];
  budget: Budget;
}

export interface GenerateRequest {
  room: RoomInput;
  style: StyleInput;
}

export interface RefineDesignRequest extends GenerateRequest {
  feedback: string;
  previousDesign: DesignSummary;
}

export interface DesignSummary {
  title: string;
  description: string;
  palette: string[];
  keyPieces: string[];
}

export interface ShoppingListItem {
  category: string;
  item: string;
  searchQuery?: string;
  notes?: string;
  estPrice?: string;
  productUrl?: string;
  retailer?: string;
  productPrice?: string;
  productImageUrl?: string;
}

export interface ProductSearchResult {
  productUrl: string;
  retailer: string;
  productPrice: string;
  productTitle: string;
  extractedPrice: number;
  productImageUrl?: string;
}

export interface GenerateResponse {
  designSummary: DesignSummary;
  imageUrl: string;
  shoppingList: ShoppingListItem[];
}

export interface DesignBrief {
  title: string;
  description: string;
  palette: string[];
  keyPieces: string[];
  layoutNotes: string;
  imagePrompt: string;
}

export interface WizardData {
  room: RoomInput;
  style: StyleInput;
}

export const MAX_INSPIRATION_SELECTION = 3;
export const MAX_ROOM_PHOTO_BYTES = 2 * 1024 * 1024;

const ALLOWED_ROOM_PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const EMPTY_ROOM_ANALYSIS: RoomAnalysisResult = {
  layout: "",
  architecturalFeatures: "",
  existingFurniture: "",
  conditions: "",
  summary: "",
  hasPhoto: false,
};

export const ROOM_TYPES = [
  "Bedroom",
  "Living Room",
  "Home Office",
  "Dining Room",
  "Nursery",
  "Bathroom",
  "Kitchen",
] as const;

export const DEFAULT_WIZARD_DATA: WizardData = {
  room: {
    type: "Living Room",
    sizeMode: "approximate",
    size: "medium",
    customDimensions: {
      length: "",
      width: "",
      unit: "ft",
    },
    constraints: "",
    roomPhoto: null,
  },
  style: {
    selectedInspirations: [],
    budget: "medium",
  },
};

const APPROXIMATE_SIZE_LABELS: Record<RoomSize, string> = {
  small: "Small (under 120 sq ft)",
  medium: "Medium (120–250 sq ft)",
  large: "Large (250+ sq ft)",
};

export function getRoomSizeDescription(room: RoomInput): string {
  if (room.sizeMode === "custom") {
    const { length, width, unit } = room.customDimensions;
    if (length && width) {
      return `${length} × ${width} ${unit}`;
    }
    return "Custom dimensions";
  }

  return APPROXIMATE_SIZE_LABELS[room.size];
}

export function hasValidRoomSize(room: RoomInput): boolean {
  if (room.sizeMode === "approximate") {
    return true;
  }

  const { length, width } = room.customDimensions;
  return Boolean(length.trim() && width.trim());
}

export function hasValidStyleSelection(style: StyleInput): boolean {
  return style.selectedInspirations.length >= 1;
}

export function hasValidFeedback(feedback: string): boolean {
  const trimmed = feedback.trim();
  return trimmed.length >= 10 && trimmed.length <= 1000;
}

export function isValidRoomPhoto(dataUrl: string): boolean {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  if (!match) {
    return false;
  }

  const mimeType = match[1].toLowerCase();
  if (!ALLOWED_ROOM_PHOTO_MIME_TYPES.has(mimeType)) {
    return false;
  }

  try {
    const buffer = Buffer.from(match[2], "base64");
    return buffer.length > 0 && buffer.length <= MAX_ROOM_PHOTO_BYTES;
  } catch {
    return false;
  }
}
