"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MainLayout, ProtectedRoute } from "@/components/layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ReportForm } from "@/components/reports";
import { useAuth, useCategories, useReports } from "@/hooks";
import type { ReportFormData } from "@/schemas/report.schema";

function ReportFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");

  const { reports, createNewReport, editReport } = useReports();
  const { categories, isLoading: loadingCategories } = useCategories();
  const { user } = useAuth();

  const existingReport = useMemo(
    () => reports.find((report) => report.id === reportId),
    [reports, reportId]
  );

  const isEditing = Boolean(reportId);

  const handleSubmit = async (data: ReportFormData) => {
    if (!user) {
      throw new Error("Debes iniciar sesión para crear reportes.");
    }

    if (isEditing && existingReport) {
      await editReport(existingReport.id, {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        status: data.status,
        priority: data.priority,
        latitude: data.latitude,
        longitude: data.longitude,
        image: data.image,
      });
    } else {
      await createNewReport({
        userId: user.id,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        priority: data.priority,
        status: data.status ?? "pending",
        latitude: data.latitude,
        longitude: data.longitude,
        image: data.image,
      });
    }

    router.push("/reports");
  };

  if (isEditing && !existingReport && reports.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte no encontrado</CardTitle>
          <CardDescription>
            El reporte que intentas editar no existe o fue eliminado.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          {isEditing ? "Editar reporte" : "Nuevo reporte"}
        </h1>
        <p className="text-slate-600">
          Completa la información para registrar una incidencia ambiental.
        </p>
      </div>

      {loadingCategories ? (
        <p className="text-slate-500">Cargando categorías...</p>
      ) : (
        <Card>
          <ReportForm
            categories={categories}
            initialReport={existingReport}
            submitLabel={isEditing ? "Guardar cambios" : "Crear reporte"}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/reports")}
          />
        </Card>
      )}
    </div>
  );
}

function ReportFormPageContent() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <p className="py-8 text-center text-slate-500">
            Cargando formulario...
          </p>
        }
      >
        <ReportFormContent />
      </Suspense>
    </MainLayout>
  );
}

export default function ReportFormPage() {
  return (
    <ProtectedRoute>
      <ReportFormPageContent />
    </ProtectedRoute>
  );
}
