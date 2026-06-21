"use client";

import Link from "next/link";

import { Button, Select } from "@/components/ui";
import type { Category, Report, ReportStatus } from "@/types";
import { REPORT_STATUSES } from "@/utils/constants";
import {
  formatReportDate,
  getCategoryName,
} from "@/features/reports/reportPresentation";
import { PriorityBadge, StatusBadge } from "./ReportBadges";

interface ReportTableProps {
  reports: Report[];
  categories: Category[];
  onChangeStatus: (id: string, status: ReportStatus) => void;
  onDelete: (id: string) => void;
}

export function ReportTable({
  reports,
  categories,
  onChangeStatus,
  onDelete,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-slate-500">
          No hay reportes que coincidan con los filtros seleccionados.
        </p>
        <Link
          href="/reports/new"
          className="mt-3 inline-block text-sm font-medium text-green-700 hover:underline"
        >
          Crear el primer reporte →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[780px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-600">Título</th>
            <th className="px-4 py-3 font-medium text-slate-600">Categoría</th>
            <th className="px-4 py-3 font-medium text-slate-600">Prioridad</th>
            <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
            <th className="px-4 py-3 font-medium text-slate-600">Fecha</th>
            <th className="px-4 py-3 font-medium text-slate-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reports.map((report) => (
            <tr
              key={report.id}
              className="align-top text-slate-700 hover:bg-slate-50"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{report.title}</p>
                <p className="line-clamp-1 max-w-xs text-xs text-slate-500">
                  {report.description}
                </p>
              </td>

              <td className="px-4 py-3 text-slate-700">
                {getCategoryName(categories, report.categoryId)}
              </td>

              <td className="px-4 py-3">
                <PriorityBadge priority={report.priority} />
              </td>

              <td className="px-4 py-3">
                <StatusBadge status={report.status} />
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {formatReportDate(report.createdAt)}
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Cambio rápido de estado directo desde la tabla */}
                  <Select
                    aria-label="Cambiar estado del reporte"
                    className="h-8 w-36 text-xs"
                    value={report.status}
                    onChange={(e) =>
                      onChangeStatus(report.id, e.target.value as ReportStatus)
                    }
                  >
                    {REPORT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Select>

                  <Link href={`/reports/new?id=${report.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(report.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
