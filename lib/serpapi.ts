import type { ProductSearchResult } from "./types";

const MAX_RESULTS = 5;

interface SerpApiShoppingResult {
  title?: string;
  product_link?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  serpapi_thumbnail?: string;
  thumbnail?: string;
}

interface SerpApiShoppingResponse {
  shopping_results?: SerpApiShoppingResult[];
}

export function getSerpApiKey(): string | null {
  return process.env.SERPAPI_API_KEY ?? null;
}

function parseProductImageUrl(result: SerpApiShoppingResult): string | undefined {
  const url = result.serpapi_thumbnail ?? result.thumbnail;
  if (!url?.startsWith("https://")) {
    return undefined;
  }
  return url;
}

function normalizeResult(result: SerpApiShoppingResult): ProductSearchResult | null {
  if (!result.product_link || !result.title) {
    return null;
  }

  const extractedPrice = result.extracted_price;
  if (typeof extractedPrice !== "number" || extractedPrice <= 0) {
    return null;
  }

  const productImageUrl = parseProductImageUrl(result);

  return {
    productUrl: result.product_link,
    retailer: result.source?.trim() || "Google Shopping",
    productPrice: result.price?.trim() || `$${extractedPrice}`,
    productTitle: result.title.trim(),
    extractedPrice,
    ...(productImageUrl ? { productImageUrl } : {}),
  };
}

export async function searchGoogleShopping(
  query: string,
): Promise<ProductSearchResult[]> {
  const apiKey = getSerpApiKey();
  if (!apiKey) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      engine: "google_shopping",
      q: query,
      api_key: apiKey,
      gl: "us",
      hl: "en",
    });

    const response = await fetch(
      `https://serpapi.com/search.json?${params.toString()}`,
    );

    if (response.status === 429) {
      return [];
    }

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as SerpApiShoppingResponse;
    const results = data.shopping_results ?? [];

    return results
      .slice(0, MAX_RESULTS)
      .map(normalizeResult)
      .filter((result): result is ProductSearchResult => result !== null);
  } catch {
    return [];
  }
}
