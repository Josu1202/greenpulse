"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { Card } from "@/components/ui";
import { PriorityBadge, StatusBadge } from "@/components/reports";
import type { Category, Report } from "@/types";
import {
  formatReportDate,
  getCategoryName,
} from "@/features/reports/reportPresentation";
import { createGoogleMapsUrl } from "@/utils/googleMaps";

interface ReportDetailPanelProps {
  report: Report;
  categories: Category[];
  onClose: () => void;
}

export function ReportDetailPanel({
  report,
  categories,
  onClose,
}: ReportDetailPanelProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">
          {report.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cerrar detalle"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={report.status} />
        <PriorityBadge priority={report.priority} />
      </div>

      {report.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={report.image}
          alt={report.title}
          className="h-40 w-full rounded-lg border border-slate-200 object-cover"
        />
      ) : null}

      <p className="text-xs text-slate-500">
        {getCategoryName(categories, report.categoryId)} ·{" "}
        {formatReportDate(report.createdAt)}
      </p>

      <p className="text-sm text-slate-600">{report.description}</p>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-xs">
        <a
          href={createGoogleMapsUrl(report.latitude, report.longitude)}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-slate-600 hover:underline"
        >
          Ver ubicación en Google Maps
        </a>
        <Link
          href="/reports"
          className="font-medium text-green-700 hover:underline"
        >
          Abrir en reportes →
        </Link>
      </div>
    </Card>
  );
}
