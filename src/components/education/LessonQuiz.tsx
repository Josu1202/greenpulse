"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

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

  const score = useMemo(() => {
    return lesson.questions.reduce((total, question) => {
      const selectedOptionId = selectedAnswers[question.id];

      return selectedOptionId === question.correctOptionId ? total + 1 : total;
    }, 0);
  }, [lesson.questions, selectedAnswers]);

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
    <Card>
      <CardHeader>
        <CardTitle>Preguntas de retroalimentación</CardTitle>
        <CardDescription>
          Responde las preguntas para completar la lección y registrar tu
          avance.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {lesson.questions.map((question, questionIndex) => {
          const selectedOptionId = selectedAnswers[question.id];
          const isCorrect = selectedOptionId === question.correctOptionId;

          return (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <h3 className="font-semibold text-slate-950">
                {questionIndex + 1}. {question.question}
              </h3>

              <div className="mt-4 space-y-3">
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
          <div className="rounded-2xl bg-green-50 p-5 text-green-800">
            <p className="text-lg font-semibold">
              Resultado: {score} de {totalQuestions}
            </p>
            <p className="mt-1 text-sm">
              Tu progreso fue guardado. Esta lección cuenta para tus medallas
              educativas.
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