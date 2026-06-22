"use client";

import Link from "next/link";
import { Award, BookOpen, PlusCircle } from "lucide-react";

import { EducationLessonCard } from "@/components/education";
import { DashboardLayout, ProtectedRoute } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useEducation } from "@/hooks";

export default function EducationPage() {
  const {
    baseLessons,
    userLessons,
    completedLessonsCount,
    earnedBadges,
    nextBadge,
    isLoading,
    error,
    isLessonCompleted,
  } = useEducation();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <BookOpen className="h-4 w-4" />
                Módulo educativo
              </div>

              <h1 className="text-3xl font-bold text-slate-950">
                Educación ambiental
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Lee lecciones breves sobre contaminación y medio ambiente,
                responde preguntas de retroalimentación y gana medallas por tu
                progreso.
              </p>
            </div>

            <Link
              href="/education/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <PlusCircle className="h-4 w-4" />
              Crear lectura
            </Link>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{completedLessonsCount}</CardTitle>
                <CardDescription>Lecciones completadas</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{earnedBadges.length}</CardTitle>
                <CardDescription>Medallas obtenidas</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  {nextBadge ? nextBadge.name : "Máximo nivel"}
                </CardTitle>
                <CardDescription>
                  {nextBadge
                    ? `Completa ${nextBadge.requiredLessons} lecciones para obtenerla.`
                    : "Ya obtuviste todas las medallas educativas."}
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <Card>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Cargando lecciones educativas...
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Lecciones base
                  </h2>
                  <p className="text-slate-600">
                    Lecturas preparadas por GreenPulse para aprender conceptos
                    clave sobre contaminación y sostenibilidad.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {baseLessons.map((lesson) => (
                    <EducationLessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={isLessonCompleted(lesson.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Lecciones creadas por usuarios
                  </h2>
                  <p className="text-slate-600">
                    Lecturas compartidas por la comunidad para fortalecer la
                    educación ambiental.
                  </p>
                </div>

                {userLessons.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Aún no hay lecturas creadas</CardTitle>
                      <CardDescription>
                        Sé el primero en compartir una lectura educativa con
                        preguntas de retroalimentación.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href="/education/create"
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Crear primera lectura
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {userLessons.map((lesson) => (
                      <EducationLessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={isLessonCompleted(lesson.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
