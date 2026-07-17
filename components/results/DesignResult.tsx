import Image from "next/image";
import type { DesignSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";

interface DesignResultProps {
  imageUrl: string;
  summary: DesignSummary;
}

export function DesignResult({ imageUrl, summary }: DesignResultProps) {
  return (
    <div className="space-y-6">
      <Card padding="lg" className="overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100 sm:aspect-[4/3]">
          <Image
            src={imageUrl}
            alt={summary.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-stone-900">{summary.title}</h2>
        <p className="mt-3 text-stone-600 leading-relaxed">{summary.description}</p>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-800">Color palette</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {summary.palette.map((color) => (
              <span
                key={color}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-800">Key pieces</h3>
          <ul className="mt-3 space-y-2">
            {summary.keyPieces.map((piece) => (
              <li key={piece} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-700" />
                {piece}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
