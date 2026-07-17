import type { InspirationPhoto } from "./style-inspiration";

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: { regular: string };
  user: { name: string; links: { html: string } };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

function getAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }
  return key;
}

function normalizePhoto(photo: UnsplashPhoto): InspirationPhoto {
  const label =
    photo.alt_description?.trim() ||
    photo.description?.trim() ||
    "Interior design inspiration";

  const styleDescription = [photo.alt_description, photo.description]
    .filter(Boolean)
    .join(". ")
    .trim() || label;

  return {
    id: photo.id,
    imageUrl: photo.urls.regular,
    alt: label,
    label,
    styleDescription,
    credit: `Photo by ${photo.user.name} on Unsplash`,
  };
}

export async function searchInspirationPhotos({
  query,
  page = 1,
  perPage = 12,
}: {
  query: string;
  page?: number;
  perPage?: number;
}): Promise<InspirationPhoto[]> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    per_page: String(perPage),
    orientation: "landscape",
  });

  const response = await fetch(
    `https://api.unsplash.com/search/photos?${params.toString()}`,
    {
      headers: {
        Authorization: `Client-ID ${getAccessKey()}`,
        "Accept-Version": "v1",
      },
      next: { revalidate: 3600 },
    },
  );

  if (response.status === 429) {
    throw new Error("Unsplash rate limit reached. Please try again in a moment.");
  }

  if (!response.ok) {
    throw new Error(`Unsplash search failed (${response.status})`);
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  return data.results.map(normalizePhoto);
}
