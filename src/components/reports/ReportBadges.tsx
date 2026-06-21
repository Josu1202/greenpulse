"use client";

import { Badge } from "@/components/ui";
import type { ReportPriority, ReportStatus } from "@/types";
import {
  getPriorityLabel,
  getPriorityVariant,
  getStatusLabel,
  getStatusVariant,
} from "@/features/reports/reportPresentation";

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
  );
}

export function PriorityBadge({ priority }: { priority: ReportPriority }) {
  return (
    <Badge variant={getPriorityVariant(priority)}>
      {getPriorityLabel(priority)}
    </Badge>
  );
}
