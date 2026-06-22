"use client";

import { Card, Select } from "@/components/ui";
import type { Category } from "@/types";

export type DashboardRange = "7" | "30" | "90" | "all";

export const DASHBOARD_RANGES: { value: DashboardRange; label: string }[] = [
  { value: "7", label: "Últimos 7 días" },
  { value: "30", label: "Últimos 30 días" },
  { value: "90", label: "Últimos 90 días" },
  { value: "all", label: "Todo el historial" },
];

// Convierte el rango seleccionado en un número de días (o null para "todo").
export function rangeToDays(range: DashboardRange): number | null {
  return range === "all" ? null : Number(range);
}

interface DashboardFiltersProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedRange: DashboardRange;
  totalVisibles: number;
  onCategoryChange: (categoryId: string) => void;
  onRangeChange: (range: DashboardRange) => void;
}

export function DashboardFilters({
  categories,
  selectedCategoryId,
  selectedRange,
  totalVisibles,
  onCategoryChange,
  onRangeChange,
}: DashboardFiltersProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 md:max-w-xl">
          <Select
            label="Categoría"
            value={selectedCategoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select
            label="Periodo"
            value={selectedRange}
            onChange={(event) =>
              onRangeChange(event.target.value as DashboardRange)
            }
          >
            {DASHBOARD_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>
        </div>

        <p className="text-sm text-slate-500">
          {totalVisibles} reporte(s) en el periodo seleccionado
        </p>
      </div>
    </Card>
  );
}
