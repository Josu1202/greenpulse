"use client";

import type { Category } from "@/types";

const IMPACT_LABEL = (factor: number): { label: string; className: string } => {
  if (factor >= 4) {
    return { label: "Impacto alto", className: "text-red-600" };
  }
  if (factor === 3) {
    return { label: "Impacto medio", className: "text-amber-600" };
  }
  return { label: "Impacto bajo", className: "text-slate-500" };
};


interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  error?: string;
}

export function CategoryChips({
  categories,
  selectedCategoryId,
  onSelect,
  error,
}: CategoryChipsProps) {
  const selected = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        Categoría *
      </label>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category.id === selectedCategoryId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                isActive
                  ? "border-transparent text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              style={
                isActive ? { backgroundColor: category.color } : undefined
              }
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "#ffffff" : category.color,
                }}
              />
              {category.name}
            </button>
          );
        })}
      </div>

      {selected ? (
        <p className={`text-xs ${IMPACT_LABEL(selected.impactFactor).className}`}>
          {IMPACT_LABEL(selected.impactFactor).label} · {selected.description}
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
