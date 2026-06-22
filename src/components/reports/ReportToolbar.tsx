"use client";

import { Download, Search } from "lucide-react";

import { Button, Input, Select } from "@/components/ui";
import {
  REPORT_SORT_OPTIONS,
  type ReportSortOption,
} from "@/features/reports/reportPresentation";

interface ReportToolbarProps {
  searchQuery: string;
  sortOption: ReportSortOption;
  onlyMine: boolean;
  canFilterMine: boolean;
  canExport: boolean;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ReportSortOption) => void;
  onOnlyMineChange: (value: boolean) => void;
  onExport: () => void;
}

export function ReportToolbar({
  searchQuery,
  sortOption,
  onlyMine,
  canFilterMine,
  canExport,
  onSearchChange,
  onSortChange,
  onOnlyMineChange,
  onExport,
}: ReportToolbarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            label="Buscar"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          label="Ordenar por"
          value={sortOption}
          onChange={(event) =>
            onSortChange(event.target.value as ReportSortOption)
          }
        >
          {REPORT_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canFilterMine ? (
          <Button
            variant={onlyMine ? "primary" : "outline"}
            size="sm"
            onClick={() => onOnlyMineChange(!onlyMine)}
            aria-pressed={onlyMine}
          >
            {onlyMine ? "Solo mis reportes" : "Todos los reportes"}
          </Button>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={!canExport}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>
    </div>
  );
}
