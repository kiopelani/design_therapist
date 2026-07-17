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
}

export interface StyleInput {
  styles: string[];
  colors: string;
  mood: string;
  budget: Budget;
}

export interface GenerateRequest {
  room: RoomInput;
  style: StyleInput;
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
  notes?: string;
  estPrice?: string;
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

export const ROOM_TYPES = [
  "Bedroom",
  "Living Room",
  "Home Office",
  "Dining Room",
  "Nursery",
  "Bathroom",
  "Kitchen",
] as const;

export const STYLE_OPTIONS = [
  "Minimal",
  "Bohemian",
  "Mid-Century Modern",
  "Scandinavian",
  "Industrial",
  "Coastal",
  "Farmhouse",
  "Art Deco",
  "Japandi",
  "Eclectic",
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
  },
  style: {
    styles: [],
    colors: "",
    mood: "",
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
