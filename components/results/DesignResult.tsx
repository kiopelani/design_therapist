import Image from "next/image";
import type { DesignSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface DesignResultProps {
  imageUrl: string;
  summary: DesignSummary;
}

export function DesignResult({ imageUrl, summary }: DesignResultProps) {
  const isDataUrl = imageUrl.startsWith("data:");

  return (
    <div className="space-y-6">
      <Card padding="sm" className="overflow-hidden p-3 sm:p-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100">
          {isDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={summary.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={summary.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
          Design summary
        </p>
        <p className="mt-4 text-base leading-relaxed text-stone-600 sm:text-lg">
          {summary.description}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
              Color palette
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {summary.palette.map((color) => (
                <span
                  key={color}
                  className="rounded-full border border-stone-200/80 bg-white/80 px-4 py-2 text-sm text-stone-700 shadow-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
              Key pieces
            </h3>
            <ul className="mt-4 space-y-3">
              {summary.keyPieces.map((piece) => (
                <li
                  key={piece}
                  className="flex items-start gap-3 text-sm text-stone-700"
                >
                  <span className="mt-2 h-1 w-4 shrink-0 bg-stone-900" />
                  {piece}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
