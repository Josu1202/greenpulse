"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MainLayout, ProtectedRoute } from "@/components/layout";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ReportForm } from "@/components/reports";
import { useCategories, useReports } from "@/hooks";
import type { ReportFormData } from "@/schemas/report.schema";

function ReportFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");

  const {
    reports,
    currentUser,
    isLoading: loadingReports,
    createNewReport,
    editReport,
  } = useReports();

  const { categories, isLoading: loadingCategories } = useCategories();

  const existingReport = useMemo(
    () => reports.find((report) => report.id === reportId),
    [reports, reportId]
  );

  const isEditing = Boolean(reportId);
  const isOwner = Boolean(
    currentUser && existingReport && existingReport.userId === currentUser.id
  );

  const handleSubmit = async (data: ReportFormData) => {
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

  if (loadingReports || loadingCategories) {
    return (
      <p className="py-8 text-center text-slate-500">
        Cargando formulario...
      </p>
    );
  }

  if (isEditing && !existingReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte no encontrado</CardTitle>
          <CardDescription>
            El reporte que intentas editar no existe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push("/reports")}>
            Volver a reportes
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isEditing && !isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No puedes editar el reporte original</CardTitle>
          <CardDescription>
            Solo el dueño puede cambiar título, descripción, categoría, imagen
            principal y ubicación original. Puedes volver a reportes para cambiar
            estado, prioridad o agregar avances al historial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push("/reports")}>
            Volver a reportes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          {isEditing ? "Editar reporte original" : "Nuevo reporte"}
        </h1>
        <p className="text-slate-600">
          {isEditing
            ? "Solo el dueño puede modificar la información original del reporte."
            : "Completa la información para registrar una incidencia ambiental."}
        </p>
      </div>

      <Card>
        <ReportForm
          categories={categories}
          initialReport={existingReport}
          submitLabel={isEditing ? "Guardar cambios" : "Crear reporte"}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/reports")}
        />
      </Card>
    </div>
  );
}

export default function ReportFormPage() {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
