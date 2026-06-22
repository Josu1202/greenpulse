"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ImageIcon,
  ListChecks,
  PlayCircle,
  Sparkles,
  UserRound,
} from "lucide-react";

import { LessonAssistant, LessonQuiz } from "@/components/education";
import { MainLayout, ProtectedRoute } from "@/components/layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useEducation } from "@/hooks";
import type { EducationLesson } from "@/types";

function getParagraphs(content: string) {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getKeyIdeas(content: string) {
  return content
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default function EducationLessonDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;

  const {
    getLesson,
    completeLesson,
    isLessonCompleted,
    completedLessonsCount,
    nextBadge,
  } = useEducation();

  const [lesson, setLesson] = useState<EducationLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      async function loadLesson() {
        try {
          setIsLoading(true);
          setError(null);

          const data = await getLesson(lessonId);
          setLesson(data);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "No se pudo cargar la lección.";

          setError(message);
        } finally {
          setIsLoading(false);
        }
      }

      void loadLesson();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [getLesson, lessonId]);

  const paragraphs = useMemo(() => {
    return lesson ? getParagraphs(lesson.content) : [];
  }, [lesson]);

  const keyIdeas = useMemo(() => {
    return lesson ? getKeyIdeas(lesson.content) : [];
  }, [lesson]);

  const completed = lesson ? isLessonCompleted(lesson.id) : false;

  const handleComplete = async (score: number, totalQuestions: number) => {
    if (!lesson) {
      return;
    }

    await completeLesson(lesson.id, score, totalQuestions);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a educación
          </Link>

          {isLoading ? (
            <Card>
              <CardContent>
                <p className="text-sm text-slate-500">Cargando lección...</p>
              </CardContent>
            </Card>
          ) : null}

          {error ? (
            <Card>
              <CardHeader>
                <CardTitle>No se pudo cargar la lección</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {lesson ? (
            <>
              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {lesson.image ? (
                  <div
                    className="h-72 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.2)), url(${lesson.image})`,
                    }}
                  >
                    <div className="flex h-full items-end p-6 text-white">
                      <div>
                        <Badge
                          variant={
                            lesson.source === "base" ? "success" : "info"
                          }
                        >
                          {lesson.source === "base"
                            ? "Lección base"
                            : "Creada por usuario"}
                        </Badge>

                        <h1 className="mt-4 max-w-3xl text-4xl font-bold">
                          {lesson.title}
                        </h1>

                        <p className="mt-3 max-w-2xl text-green-50">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white">
                    <Badge
                      variant={lesson.source === "base" ? "success" : "info"}
                    >
                      {lesson.source === "base"
                        ? "Lección base"
                        : "Creada por usuario"}
                    </Badge>

                    <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                      <div>
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15">
                          <BookOpen className="h-8 w-8" />
                        </div>

                        <h1 className="max-w-3xl text-4xl font-bold">
                          {lesson.title}
                        </h1>

                        <p className="mt-3 max-w-2xl text-green-50">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-4 border-t border-slate-200 bg-slate-50 p-5 md:grid-cols-4">
                  <div className="rounded-2xl bg-white p-4">
                    <Clock className="mb-2 h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-900">
                      {lesson.estimatedMinutes} minutos
                    </p>
                    <p className="text-xs text-slate-500">Tiempo estimado</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <ListChecks className="mb-2 h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-900">
                      {lesson.questions.length} preguntas
                    </p>
                    <p className="text-xs text-slate-500">Retroalimentación</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <Award className="mb-2 h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-900">
                      {completed ? "Completada" : "Pendiente"}
                    </p>
                    <p className="text-xs text-slate-500">Estado</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <UserRound className="mb-2 h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-slate-900">
                      {lesson.source === "base"
                        ? "GreenPulse"
                        : lesson.createdByUserName ?? "Usuario"}
                    </p>
                    <p className="text-xs text-slate-500">Autor</p>
                  </div>
                </div>
              </section>

              {!isQuizMode ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-green-600" />
                            <CardTitle>Objetivo de la lección</CardTitle>
                          </div>
                          <CardDescription>
                            Comprender el problema ambiental presentado y
                            reconocer acciones que pueden aplicarse en una
                            comunidad.
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Lectura</CardTitle>
                          <CardDescription>
                            Lee el contenido antes de iniciar las preguntas.
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-5">
                            {paragraphs.map((paragraph, index) => (
                              <p
                                key={index}
                                className="text-base leading-8 text-slate-700"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {lesson.referenceImages &&
                          lesson.referenceImages.length > 0 ? (
                            <div className="mt-8">
                              <div className="mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-slate-950">
                                  Imágenes de referencia
                                </h3>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2">
                                {lesson.referenceImages.map((image, index) => (
                                  <div
                                    key={`${image}-${index}`}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                  >
                                    <div
                                      className="h-56 bg-cover bg-center"
                                      style={{
                                        backgroundImage: `url(${image})`,
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                            El asistente educativo está disponible mientras
                            lees, pero se ocultará cuando inicies la evaluación.
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button onClick={() => setIsQuizMode(true)}>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Iniciar preguntas
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <aside className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Ideas clave</CardTitle>
                          <CardDescription>
                            Puntos que te ayudarán a comprender mejor la
                            lectura.
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-3">
                            {keyIdeas.map((idea, index) => (
                              <div
                                key={`${idea}-${index}`}
                                className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                  {index + 1}
                                </span>
                                <p>{idea}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Progreso educativo</CardTitle>
                          <CardDescription>
                            Esta lección suma a tus medallas del perfil.
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="rounded-2xl bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
                                <Award className="h-6 w-6" />
                              </div>

                              <div>
                                <p className="font-semibold text-green-900">
                                  {completedLessonsCount} lecciones completadas
                                </p>
                                <p className="text-sm text-green-700">
                                  {nextBadge
                                    ? `Próxima medalla: ${nextBadge.name}`
                                    : "Todas las medallas desbloqueadas"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {completed ? (
                            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-green-100 p-3 text-sm font-medium text-green-800">
                              <CheckCircle2 className="h-4 w-4" />
                              Ya completaste esta lección.
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    </aside>
                  </div>

                  <LessonAssistant
                    lessonTitle={lesson.title}
                    lessonContent={lesson.content}
                    disabled={isQuizMode}
                  />
                </>
              ) : (
                <LessonQuiz lesson={lesson} onComplete={handleComplete} />
              )}
            </>
          ) : null}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}