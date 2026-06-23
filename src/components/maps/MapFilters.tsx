"use client";

import { Input, Select } from "@/components/ui";
import type { Category, ReportPriority, ReportStatus } from "@/types";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";

interface MapFiltersProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedStatus: ReportStatus | "all";
  selectedPriority: ReportPriority | "all";
  searchText: string;
  hideResolved: boolean;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ReportStatus | "all") => void;
  onPriorityChange: (value: ReportPriority | "all") => void;
  onSearchTextChange: (value: string) => void;
  onHideResolvedChange: (value: boolean) => void;
  totalVisibles: number;
}

export function MapFilters({
  categories,
  selectedCategoryId,
  selectedStatus,
  selectedPriority,
  searchText,
  hideResolved,
  onCategoryChange,
  onStatusChange,
  onPriorityChange,
  onSearchTextChange,
  onHideResolvedChange,
  totalVisibles,
}: MapFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
        <p className="text-sm text-slate-500">
          Filtra los reportes que se muestran en el mapa.
        </p>
      </div>

      <Input
        label="Buscar"
        placeholder="Título o descripción..."
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
      />

      <Select
        label="Categoría"
        value={selectedCategoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Select
        label="Estado"
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as ReportStatus | "all")}
      >
        <option value="all">Todos los estados</option>
        {REPORT_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </Select>

      <Select
        label="Prioridad"
        value={selectedPriority}
        onChange={(e) =>
          onPriorityChange(e.target.value as ReportPriority | "all")
        }
      >
        <option value="all">Todas las prioridades</option>
        {REPORT_PRIORITIES.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={hideResolved}
          onChange={(e) => onHideResolvedChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
        />
        Ocultar reportes resueltos
      </label>

      <p className="text-xs text-slate-500">
        Mostrando {totalVisibles} reporte(s) en el mapa.
      </p>

      {/* Leyenda de colores por categoría */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        <p className="text-xs font-medium text-slate-600">Categorías</p>
        <ul className="space-y-1.5">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <span
                aria-hidden
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
