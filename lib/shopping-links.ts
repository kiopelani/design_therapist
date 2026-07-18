import { searchGoogleShopping } from "./serpapi";
import type {
  Budget,
  ProductSearchResult,
  ShoppingListItem,
} from "./types";

const CONCURRENCY = 4;

export const BUDGET_RANGES: Record<
  Budget,
  { minPrice?: number; maxPrice?: number; querySuffix: string }
> = {
  low: { maxPrice: 100, querySuffix: "affordable budget" },
  medium: { minPrice: 50, maxPrice: 400, querySuffix: "" },
  high: { minPrice: 150, querySuffix: "premium designer" },
};

export function buildProductSearchQuery(
  item: ShoppingListItem,
  budget: Budget,
): string {
  const base = item.searchQuery?.trim() || item.item.trim();
  const suffix = BUDGET_RANGES[budget].querySuffix;
  return suffix ? `${base} ${suffix}` : base;
}

function isWithinBudget(price: number, budget: Budget): boolean {
  const { minPrice, maxPrice } = BUDGET_RANGES[budget];
  if (minPrice !== undefined && price < minPrice) {
    return false;
  }
  if (maxPrice !== undefined && price > maxPrice) {
    return false;
  }
  return true;
}

export function selectBestProductForBudget(
  results: ProductSearchResult[],
  budget: Budget,
): ProductSearchResult | null {
  const inBudget = results.filter((result) =>
    isWithinBudget(result.extractedPrice, budget),
  );

  if (!inBudget.length) {
    return null;
  }

  if (budget === "high") {
    return inBudget.reduce((best, current) =>
      current.extractedPrice > best.extractedPrice ? current : best,
    );
  }

  return inBudget[0];
}

async function enrichItem(
  item: ShoppingListItem,
  budget: Budget,
): Promise<ShoppingListItem> {
  try {
    const query = buildProductSearchQuery(item, budget);
    const results = await searchGoogleShopping(query);
    const match = selectBestProductForBudget(results, budget);

    if (!match) {
      return item;
    }

    return {
      ...item,
      productUrl: match.productUrl,
      retailer: match.retailer,
      productPrice: match.productPrice,
    };
  } catch {
    return item;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

export async function enrichShoppingListWithLinks(
  items: ShoppingListItem[],
  budget: Budget,
): Promise<ShoppingListItem[]> {
  if (!process.env.SERPAPI_API_KEY) {
    return items;
  }

  return mapWithConcurrency(items, CONCURRENCY, (item) =>
    enrichItem(item, budget),
  );
}
