"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import { StatusBadge } from "@/components/reports";
import type { Category, Report } from "@/types";
import {
  formatReportDate,
  getCategoryName,
} from "@/features/reports/reportPresentation";

interface RecentActivityProps {
  reports: Report[];
  categories: Category[];
}

export function RecentActivity({ reports, categories }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad reciente</CardTitle>
      </CardHeader>

      {reports.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No hay reportes recientes.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {reports.map((report) => (
            <li
              key={report.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {report.title}
                </p>
                <p className="text-xs text-slate-500">
                  {getCategoryName(categories, report.categoryId)} ·{" "}
                  {formatReportDate(report.createdAt)}
                </p>
              </div>
              <StatusBadge status={report.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
