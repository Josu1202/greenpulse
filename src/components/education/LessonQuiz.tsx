"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { EducationLesson } from "@/types";
import { cn } from "@/utils";

interface LessonQuizProps {
  lesson: EducationLesson;
  onComplete: (score: number, totalQuestions: number) => Promise<void>;
}

export function LessonQuiz({ lesson, onComplete }: LessonQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = lesson.questions.length;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  const answerProgressPercentage =
    totalQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;

  const score = useMemo(() => {
    return lesson.questions.reduce((total, question) => {
      const selectedOptionId = selectedAnswers[question.id];

      return selectedOptionId === question.correctOptionId ? total + 1 : total;
    }, 0);
  }, [lesson.questions, selectedAnswers]);

  const scorePercentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const isComplete = lesson.questions.every(
    (question) => selectedAnswers[question.id]
  );

  const handleSubmit = async () => {
    if (!isComplete) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onComplete(score, totalQuestions);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-green-100">
              Evaluación de comprensión
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Preguntas de retroalimentación
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-green-50">
              Responde todas las preguntas para completar la lección y guardar
              tu progreso educativo.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 px-4 py-3 text-center">
            <p className="text-3xl font-bold">
              {answeredQuestions}/{totalQuestions}
            </p>
            <p className="text-xs text-green-50">respondidas</p>
          </div>
        </div>

        {!showResults ? (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-green-50">
              <span>Progreso de respuestas</span>
              <span>{answerProgressPercentage}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${answerProgressPercentage}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <CardContent className="space-y-6 p-6">
        {lesson.questions.map((question, questionIndex) => {
          const selectedOptionId = selectedAnswers[question.id];
          const isCorrect = selectedOptionId === question.correctOptionId;

          return (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {questionIndex + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-950">
                    {question.question}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Selecciona una respuesta.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrectOption = option.id === question.correctOptionId;

                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition",
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:bg-slate-50",
                        showResults &&
                          isCorrectOption &&
                          "border-green-500 bg-green-50",
                        showResults &&
                          isSelected &&
                          !isCorrect &&
                          "border-red-500 bg-red-50"
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={isSelected}
                        disabled={showResults}
                        onChange={() =>
                          setSelectedAnswers((currentAnswers) => ({
                            ...currentAnswers,
                            [question.id]: option.id,
                          }))
                        }
                        className="h-4 w-4 accent-green-600"
                      />

                      <span>{option.text}</span>
                    </label>
                  );
                })}
              </div>

              {showResults ? (
                <div
                  className={cn(
                    "mt-4 flex gap-2 rounded-xl px-3 py-3 text-sm",
                    isCorrect
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}

                  <p>{question.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}

        {showResults ? (
          <div className="rounded-3xl bg-green-50 p-6 text-green-900">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white">
                  <Trophy className="h-7 w-7" />
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    Resultado: {score} de {totalQuestions}
                  </p>
                  <p className="text-sm text-green-800">
                    Obtuviste {scorePercentage}% en esta lección.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-green-700">
                Progreso guardado
              </div>
            </div>

            <p className="mt-4 text-sm text-green-800">
              Esta lección ya cuenta para tus medallas educativas dentro del
              perfil.
            </p>
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Guardando progreso..." : "Finalizar lección"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}