"use client";

import { Select } from "@/components/ui";
import type { Category, ReportPriority, ReportStatus } from "@/types";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";

interface ReportFiltersProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedStatus: ReportStatus | "all";
  selectedPriority: ReportPriority | "all";
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ReportStatus | "all") => void;
  onPriorityChange: (value: ReportPriority | "all") => void;
}

export function ReportFilters({
  categories,
  selectedCategoryId,
  selectedStatus,
  selectedPriority,
  onCategoryChange,
  onStatusChange,
  onPriorityChange,
}: ReportFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
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
        onChange={(e) =>
          onStatusChange(e.target.value as ReportStatus | "all")
        }
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
    </div>
  );
}
