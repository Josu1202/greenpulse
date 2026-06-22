"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ImagePlus, PlusCircle, Trash2 } from "lucide-react";

import { DashboardLayout, ProtectedRoute } from "@/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { createEducationLessonSchema } from "@/schemas";
import type { EducationQuestion } from "@/types";
import { cn } from "@/utils";
import { useEducation } from "@/hooks";

interface QuestionDraft {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

interface FormErrors {
  title?: string;
  summary?: string;
  content?: string;
  estimatedMinutes?: string;
  questions?: string;
}

function createId() {
  return crypto.randomUUID();
}

function createEmptyQuestion(): QuestionDraft {
  const optionA = createId();
  const optionB = createId();
  const optionC = createId();

  return {
    id: createId(),
    question: "",
    options: [
      {
        id: optionA,
        text: "",
      },
      {
        id: optionB,
        text: "",
      },
      {
        id: optionC,
        text: "",
      },
    ],
    correctOptionId: "",
    explanation: "",
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(String(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("No se pudo leer la imagen."));
    };

    reader.readAsDataURL(file);
  });
}

export default function CreateEducationLessonPage() {
  const router = useRouter();
  const { createUserLesson } = useEducation();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(5);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    createEmptyQuestion(),
  ]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const coverImage = useMemo(() => referenceImages[0], [referenceImages]);

  const handleImagesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const images = await Promise.all(files.map((file) => fileToDataUrl(file)));

    setReferenceImages((currentImages) => [...currentImages, ...images]);
  };

  const removeImage = (imageIndex: number) => {
    setReferenceImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex)
    );
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Omit<QuestionDraft, "id" | "options">,
    value: string
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId
                  ? {
                      ...option,
                      text: value,
                    }
                  : option
              ),
            }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((currentQuestions) => [
      ...currentQuestions,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((currentQuestions) => {
      if (currentQuestions.length === 1) {
        return currentQuestions;
      }

      return currentQuestions.filter((question) => question.id !== questionId);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormErrors({});
    setGeneralError(null);

    const parsedQuestions: EducationQuestion[] = questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    }));

    const formData = {
      title,
      summary,
      content,
      estimatedMinutes,
      image: coverImage,
      referenceImages,
      questions: parsedQuestions,
    };

    const validation = createEducationLessonSchema.safeParse(formData);

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;

      setFormErrors({
        title: errors.title?.[0],
        summary: errors.summary?.[0],
        content: errors.content?.[0],
        estimatedMinutes: errors.estimatedMinutes?.[0],
        questions: errors.questions?.[0],
      });

      return;
    }

    try {
      setIsSaving(true);

      const lesson = await createUserLesson(validation.data);

      router.push(`/education/${lesson.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo crear la lectura educativa.";

      setGeneralError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a educación
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-950">
              Crear lectura educativa
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Comparte una lectura ambiental con imágenes de referencia y
              preguntas de retroalimentación para la comunidad.
            </p>
          </div>

          {generalError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generalError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la lectura</CardTitle>
                <CardDescription>
                  Define el contenido principal que leerán los usuarios.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input
                  label="Título"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ej. Impacto de los residuos plásticos"
                  error={formErrors.title}
                />

                <Textarea
                  label="Resumen corto"
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Escribe una breve descripción de la lectura."
                  error={formErrors.summary}
                />

                <Textarea
                  label="Texto completo de la lectura"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Escribe aquí la lectura educativa completa."
                  className="min-h-72"
                  error={formErrors.content}
                />

                <Select
                  label="Tiempo estimado"
                  value={estimatedMinutes}
                  onChange={(event) =>
                    setEstimatedMinutes(Number(event.target.value))
                  }
                  error={formErrors.estimatedMinutes}
                >
                  {[5, 6, 7, 8, 9, 10].map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} minutos
                    </option>
                  ))}
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imágenes de referencia</CardTitle>
                <CardDescription>
                  Agrega imágenes que ayuden a comprender la lectura. La primera
                  imagen se usará como portada.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:bg-slate-100">
                  <ImagePlus className="mb-2 h-8 w-8 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Seleccionar imágenes
                  </span>
                  <span className="text-xs text-slate-500">
                    JPG, PNG o WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    className="hidden"
                  />
                </label>

                {referenceImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {referenceImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                      >
                        <div
                          className="h-40 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${image})`,
                          }}
                        />

                        <div className="flex items-center justify-between p-3">
                          <span className="text-sm text-slate-600">
                            {index === 0 ? "Portada" : `Imagen ${index + 1}`}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            aria-label="Eliminar imagen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preguntas de retroalimentación</CardTitle>
                <CardDescription>
                  Crea preguntas para evaluar la comprensión de la lectura.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {formErrors.questions ? (
                  <p className="text-sm text-red-600">
                    {formErrors.questions}
                  </p>
                ) : null}

                {questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">
                        Pregunta {questionIndex + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                        className={cn(
                          "rounded-lg p-2 text-red-600 transition hover:bg-red-100",
                          questions.length === 1 &&
                            "cursor-not-allowed opacity-40"
                        )}
                        aria-label="Eliminar pregunta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Input
                      label="Texto de la pregunta"
                      value={question.question}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "question",
                          event.target.value
                        )
                      }
                      placeholder="Ej. ¿Cuál es una consecuencia de la contaminación?"
                    />

                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <Input
                          key={option.id}
                          label={`Opción ${optionIndex + 1}`}
                          value={option.text}
                          onChange={(event) =>
                            updateOption(
                              question.id,
                              option.id,
                              event.target.value
                            )
                          }
                          placeholder={`Escribe la opción ${optionIndex + 1}`}
                        />
                      ))}
                    </div>

                    <Select
                      label="Respuesta correcta"
                      value={question.correctOptionId}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "correctOptionId",
                          event.target.value
                        )
                      }
                    >
                      <option value="">Selecciona una opción</option>
                      {question.options.map((option, optionIndex) => (
                        <option key={option.id} value={option.id}>
                          Opción {optionIndex + 1}
                        </option>
                      ))}
                    </Select>

                    <Textarea
                      label="Explicación de retroalimentación"
                      value={question.explanation}
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "explanation",
                          event.target.value
                        )
                      }
                      placeholder="Explica brevemente por qué esa respuesta es correcta."
                    />
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addQuestion}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar pregunta
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/education"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Crear lectura"}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
