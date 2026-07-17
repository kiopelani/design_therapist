import Image from "next/image";
import type { InspirationPhoto } from "@/lib/style-inspiration";

interface StyleInspirationCardProps {
  photo: InspirationPhoto;
  selected: boolean;
  onToggle: () => void;
}

export function StyleInspirationCard({
  photo,
  selected,
  onToggle,
}: StyleInspirationCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
        selected
          ? "border-stone-900 ring-2 ring-stone-900 ring-offset-2"
          : "border-stone-200/80 hover:border-stone-300"
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-stone-100">
        <Image
          src={photo.imageUrl}
          alt={photo.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {selected && (
          <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-white shadow-md">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-stone-900">
          {photo.label}
        </p>
        <p className="line-clamp-1 text-xs text-stone-500">{photo.credit}</p>
      </div>
    </button>
  );
}
