export type RoomSize = "small" | "medium" | "large";
export type Budget = "low" | "medium" | "high";

export interface RoomInput {
  type: string;
  size: RoomSize;
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
    size: "medium",
    constraints: "",
  },
  style: {
    styles: [],
    colors: "",
    mood: "",
    budget: "medium",
  },
};
