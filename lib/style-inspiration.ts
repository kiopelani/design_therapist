import type { EnrichedInspiration, SelectedInspiration } from "./types";

export interface InspirationPhoto {
  id: string;
  imageUrl: string;
  alt: string;
  label: string;
  styleDescription: string;
  credit: string;
}

export function buildDefaultSearchQuery(roomType: string): string {
  return `${roomType.toLowerCase()} interior design`;
}

export function buildSearchQuery({
  q,
  roomType,
}: {
  q?: string | null;
  roomType?: string | null;
}): string {
  if (q?.trim()) {
    return `${q.trim()} interior design room`;
  }
  if (roomType?.trim()) {
    return buildDefaultSearchQuery(roomType);
  }
  return "interior design room";
}

export function toSelectedInspiration(
  photo: InspirationPhoto,
): SelectedInspiration {
  return {
    id: photo.id,
    imageUrl: photo.imageUrl,
    label: photo.label,
    styleDescription: photo.styleDescription,
    credit: photo.credit,
  };
}

export function formatStyleInspirationForPrompt(
  inspirations: SelectedInspiration[],
): string {
  if (!inspirations.length) {
    return "None specified";
  }

  return inspirations
    .map(
      (item) => `- ${item.label}: ${item.styleDescription}`,
    )
    .join("\n");
}

export function formatEnrichedInspirationForPrompt(
  enriched: EnrichedInspiration[],
  combinedStyleSummary?: string,
): string {
  if (!enriched.length) {
    return "None specified";
  }

  const lines = enriched.map((item) => {
    const description = item.visionAnalysis || item.styleDescription;
    return `- ${item.label}: ${description}`;
  });

  if (combinedStyleSummary?.trim()) {
    lines.push(`- Combined style direction: ${combinedStyleSummary.trim()}`);
  }

  return lines.join("\n");
}
