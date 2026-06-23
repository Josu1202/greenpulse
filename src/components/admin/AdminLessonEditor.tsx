"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, ImagePlus, PlusCircle, Save, Trash2 } from "lucide-react";

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
import type {
  EducationLesson,
  EducationLessonStatus,
  EducationQuestion,
} from "@/types";

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

export interface AdminLessonEditorInput {
  title: string;
  summary: string;
  content: string;
  image?: string;
  referenceImages?: string[];
  estimatedMinutes: number;
  status: EducationLessonStatus;
  isFeatured: boolean;
  questions: EducationQuestion[];
}

interface AdminLessonEditorProps {
  lesson?: EducationLesson;
  mode: "create" | "edit";
  completions?: number;
  onSave: (input: AdminLessonEditorInput) => Promise<void>;
  onCancel: () => void;
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
      { id: optionA, text: "" },
      { id: optionB, text: "" },
      { id: optionC, text: "" },
    ],
    correctOptionId: "",
    explanation: "",
  };
}

function questionsToDrafts(questions?: EducationQuestion[]): QuestionDraft[] {
  if (!questions || questions.length === 0) {
    return [createEmptyQuestion()];
  }

  return questions.map((question) => ({
    id: question.id,
    question: question.question,
    options: question.options.map((option) => ({
      id: option.id,
      text: option.text,
    })),
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));
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

export function AdminLessonEditor({
  lesson,
  mode,
  completions = 0,
  onSave,
  onCancel,
}: AdminLessonEditorProps) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [summary, setSummary] = useState(lesson?.summary ?? "");
  const [content, setContent] = useState(lesson?.content ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    lesson?.estimatedMinutes ?? 5,
  );
  const [referenceImages, setReferenceImages] = useState<string[]>(
    lesson?.referenceImages ?? (lesson?.image ? [lesson.image] : []),
  );
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    questionsToDrafts(lesson?.questions),
  );
  const [status, setStatus] = useState<EducationLessonStatus>(
    lesson?.status ?? "pending_review",
  );
  const [isFeatured, setIsFeatured] = useState(Boolean(lesson?.isFeatured));
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const coverImage = useMemo(() => referenceImages[0], [referenceImages]);

  const titleText =
    mode === "create" ? "Crear lectura administrativa" : "Editar lectura";
  const description =
    mode === "create"
      ? "Completa el contenido educativo y sus preguntas. Puedes dejarla en revisión hasta que esté lista."
      : `${completions} usuario(s) han completado esta lección.`;

  const handleImagesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const images = await Promise.all(files.map((file) => fileToDataUrl(file)));
    setReferenceImages((currentImages) => [...currentImages, ...images]);
  };

  const removeImage = (imageIndex: number) => {
    setReferenceImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex),
    );
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Omit<QuestionDraft, "id" | "options">,
    value: string,
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string,
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
                  : option,
              ),
            }
          : question,
      ),
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      await onSave({
        ...validation.data,
        status,
        isFeatured,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo guardar la lectura.";

      setGeneralError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Administración
          </p>
          <h1 className="text-3xl font-bold text-slate-950">{titleText}</h1>
          <p className="mt-1 max-w-3xl text-slate-600">{description}</p>
        </div>

        <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a lecciones
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información principal</CardTitle>
          <CardDescription>
            Define el contenido base, estado administrativo y marca destacada.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {generalError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generalError}
            </div>
          ) : null}

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

          <div className="grid gap-4 md:grid-cols-3">
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

            <Select
              label="Estado administrativo"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as EducationLessonStatus)
              }
            >
              <option value="pending_review">En revisión</option>
              <option value="published">Publicada</option>
              <option value="hidden">Oculta</option>
            </Select>

            <label className="flex items-end gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(event) => setIsFeatured(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Marcar como destacada
            </label>
          </div>
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
            <span className="text-xs text-slate-500">JPG, PNG o WEBP</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
          </label>

          {referenceImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {referenceImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
                    <span>{index === 0 ? "Portada" : `Imagen ${index + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Quitar
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
            Define preguntas para evaluar la comprensión de la lectura.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {formErrors.questions ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {formErrors.questions}
            </p>
          ) : null}

          {questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-950">
                  Pregunta {questionIndex + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="rounded-full p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Eliminar pregunta"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <Input
                label="Texto de la pregunta"
                value={question.question}
                onChange={(event) =>
                  updateQuestion(question.id, "question", event.target.value)
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
                      updateOption(question.id, option.id, event.target.value)
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
                    event.target.value,
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
                  updateQuestion(question.id, "explanation", event.target.value)
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>

        <Button type="submit" disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving
            ? "Guardando..."
            : mode === "create"
              ? "Crear lectura"
              : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
