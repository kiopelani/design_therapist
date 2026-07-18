import type { ShoppingListItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface ShoppingListProps {
  items: ShoppingListItem[];
}

function groupByCategory(items: ShoppingListItem[]) {
  return items.reduce<Record<string, ShoppingListItem[]>>((groups, item) => {
    const category = item.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

export function ShoppingList({ items }: ShoppingListProps) {
  const grouped = groupByCategory(items);

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
        Curated for you
      </p>
      <h2 className="text-display mt-2 text-3xl text-stone-900">Shopping list</h2>
      <p className="mt-3 text-stone-600">
        Everything you need to bring this design to life.
      </p>

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-900">
                {category}
              </h3>
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-xs text-stone-400">{categoryItems.length}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {categoryItems.map((item, index) => {
                const displayPrice = item.productPrice ?? item.estPrice;

                return (
                  <li
                    key={`${category}-${index}`}
                    className="flex items-start gap-4 rounded-2xl border border-stone-200/60 bg-white/50 px-4 py-4"
                  >
                    {item.productUrl && item.productImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImageUrl}
                        alt={item.item}
                        className="h-20 w-20 shrink-0 rounded-xl bg-stone-100 object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-900">{item.item}</p>
                      {item.notes && (
                        <p className="mt-1 text-sm text-stone-500">{item.notes}</p>
                      )}
                      {item.retailer && item.productUrl && (
                        <p className="mt-2 text-sm text-stone-500">
                          via {item.retailer}
                        </p>
                      )}
                      {item.productUrl && (
                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex text-sm font-medium text-stone-900 underline-offset-2 hover:underline"
                        >
                          Shop
                        </a>
                      )}
                    </div>
                    {displayPrice && (
                      <span className="shrink-0 rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white">
                        {displayPrice}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
