"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, BookPlus, Star, Trash2 } from "lucide-react";

import { AdminTabs } from "@/components/admin";
import { AdminRoute, DashboardLayout } from "@/components/layout";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
} from "@/components/ui";
import { useAdminLessons } from "@/hooks";
import type { EducationLesson, EducationLessonStatus } from "@/types";
import { cn } from "@/utils";

const LESSON_STATUS_LABELS: Record<EducationLessonStatus, string> = {
  pending_review: "En revisión",
  published: "Publicada",
  hidden: "Oculta",
};

function getStatusVariant(status: EducationLessonStatus) {
  if (status === "published") {
    return "success" as const;
  }

  if (status === "hidden") {
    return "outline" as const;
  }

  return "warning" as const;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

interface LessonModerationCardProps {
  lesson: EducationLesson;
  completions: number;
  onStatusChange: (status: EducationLessonStatus) => void;
  onDelete: () => void;
}

function LessonModerationCard({
  lesson,
  completions,
  onStatusChange,
  onDelete,
}: LessonModerationCardProps) {
  const status = lesson.status ?? "published";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:border-green-200 hover:shadow-md",
        lesson.isFeatured
          ? "border-green-200 ring-1 ring-green-100"
          : "border-slate-200",
      )}
    >
      <div className="space-y-5 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={lesson.source === "base" ? "info" : "outline"}>
                {lesson.source === "base" ? "Lección base" : "Creada por usuario"}
              </Badge>

              <Badge variant={getStatusVariant(status)}>
                {LESSON_STATUS_LABELS[status]}
              </Badge>

              {lesson.isFeatured ? (
                <Badge variant="success" className="gap-1">
                  <Star className="h-3.5 w-3.5" />
                  Destacada
                </Badge>
              ) : null}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {lesson.title}
              </h2>
              <p className="mt-2 line-clamp-3 max-w-4xl text-sm leading-6 text-slate-600">
                {lesson.summary}
              </p>
            </div>
          </div>

          <Link href={`/admin/lessons/${lesson.id}/edit`}>
            <Button variant="outline" size="sm">
              Editar contenido
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">Autor</p>
            <p className="truncate font-medium text-slate-800">
              {lesson.createdByUserName ?? "GreenPulse"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">Completadas</p>
            <p className="font-medium text-slate-800">{completions}</p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">Preguntas</p>
            <p className="font-medium text-slate-800">
              {lesson.questions.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-xs text-slate-500">Fecha</p>
            <p className="font-medium text-slate-800">
              {formatDate(lesson.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_auto] lg:items-end">
          <p className="text-xs leading-5 text-slate-500">
            Moderación: cambia el estado de la lectura desde el selector. Las
            lecciones en revisión u ocultas no aparecen como contenido público.
          </p>

          <Select
            label="Estado"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as EducationLessonStatus)
            }
          >
            <option value="pending_review">En revisión</option>
            <option value="published">Publicada</option>
            <option value="hidden">Oculta</option>
          </Select>

          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="gap-1 lg:mb-0.5"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </article>
  );
}

function AdminLessonsContent() {
  const {
    lessons,
    completedByLesson,
    isLoading,
    error,
    updateLesson,
    deleteLesson,
  } = useAdminLessons();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    EducationLessonStatus | "all"
  >("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "base" | "user">(
    "all",
  );

  const visibleLessons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const status = lesson.status ?? "published";
      const matchesSearch =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.summary.toLowerCase().includes(query) ||
        (lesson.createdByUserName ?? "").toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesSource =
        sourceFilter === "all" || lesson.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [lessons, searchQuery, sourceFilter, statusFilter]);

  const handleDelete = async (lessonId: string) => {
    const confirmed = window.confirm(
      "¿Eliminar esta lección? También se eliminará el progreso asociado.",
    );

    if (!confirmed) {
      return;
    }

    await deleteLesson(lessonId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Administración
            </p>
            <h1 className="text-3xl font-bold text-slate-950">
              Control de lecciones
            </h1>
            <p className="mt-1 max-w-3xl text-slate-600">
              Revisa, publica, oculta, edita o elimina lecciones ambientales
              para mantener el enfoque educativo de GreenPulse.
            </p>
          </div>

          <Link href="/admin/lessons/create">
            <Button className="gap-2">
              <BookPlus className="h-4 w-4" />
              Crear lectura admin
            </Button>
          </Link>
        </div>

        <AdminTabs active="lessons" />

        <Card className="grid gap-4 md:grid-cols-[1fr_220px_220px]">
          <Input
            label="Buscar"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Título, resumen o autor"
          />

          <Select
            label="Estado"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as typeof statusFilter)
            }
          >
            <option value="all">Todos</option>
            <option value="pending_review">En revisión</option>
            <option value="published">Publicada</option>
            <option value="hidden">Oculta</option>
          </Select>

          <Select
            label="Origen"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(event.target.value as typeof sourceFilter)
            }
          >
            <option value="all">Todos</option>
            <option value="base">Base</option>
            <option value="user">Usuario</option>
          </Select>
        </Card>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Cargando lecciones...
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">
                  Lecciones encontradas
                </h2>
                <p className="text-sm text-slate-500">
                  Vista en tarjetas para evitar scroll horizontal.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <BookOpen className="h-4 w-4" />
                {visibleLessons.length} resultado(s)
              </span>
            </div>

            {visibleLessons.length === 0 ? (
              <Card>
                <p className="text-sm text-slate-500">
                  No hay lecciones que coincidan con los filtros aplicados.
                </p>
              </Card>
            ) : (
              visibleLessons.map((lesson) => (
                <LessonModerationCard
                  key={lesson.id}
                  lesson={lesson}
                  completions={completedByLesson[lesson.id] ?? 0}
                  onStatusChange={(status) =>
                    void updateLesson(lesson.id, { status })
                  }
                  onDelete={() => void handleDelete(lesson.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminLessonsPage() {
  return (
    <AdminRoute>
      <AdminLessonsContent />
    </AdminRoute>
  );
}
