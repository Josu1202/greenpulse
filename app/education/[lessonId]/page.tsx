"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Clock } from "lucide-react";

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

export default function EducationLessonDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;

  const { getLesson, completeLesson, isLessonCompleted } = useEducation();

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
              <Card className="overflow-hidden p-0">
                {lesson.image ? (
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-green-100 to-slate-100">
                    <BookOpen className="h-16 w-16 text-green-600" />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <Badge variant={lesson.source === "base" ? "success" : "info"}>
                      {lesson.source === "base"
                        ? "Lección base"
                        : "Creada por usuario"}
                    </Badge>

                    <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {lesson.estimatedMinutes} min
                    </span>

                    {isLessonCompleted(lesson.id) ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completada
                      </span>
                    ) : null}
                  </div>

                  <h1 className="text-3xl font-bold text-slate-950">
                    {lesson.title}
                  </h1>

                  <p className="mt-2 text-slate-600">{lesson.summary}</p>
                </div>
              </Card>

              {!isQuizMode ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Lectura</CardTitle>
                      <CardDescription>
                        Lee el contenido antes de iniciar las preguntas.
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="prose prose-slate max-w-none">
                        {lesson.content
                          .split(/\n+/)
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index} className="leading-8 text-slate-700">
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                        El asistente educativo está disponible mientras lees,
                        pero se ocultará cuando inicies la evaluación.
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button onClick={() => setIsQuizMode(true)}>
                          Iniciar preguntas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

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