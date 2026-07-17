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
      <h2 className="text-2xl font-semibold text-stone-900">Shopping list</h2>
      <p className="mt-2 text-stone-600">
        Everything you need to bring this design to life.
      </p>

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
              {category}
            </h3>
            <ul className="mt-4 divide-y divide-stone-100">
              {categoryItems.map((item, index) => (
                <li
                  key={`${category}-${index}`}
                  className="flex items-start justify-between gap-4 py-4 first:pt-2"
                >
                  <div>
                    <p className="font-medium text-stone-900">{item.item}</p>
                    {item.notes && (
                      <p className="mt-1 text-sm text-stone-500">{item.notes}</p>
                    )}
                  </div>
                  {item.estPrice && (
                    <span className="shrink-0 text-sm font-medium text-stone-600">
                      {item.estPrice}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
