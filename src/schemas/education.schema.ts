import { z } from "zod";

export const educationQuestionOptionSchema = z.object({
  id: z.string().min(1, "La opción necesita un identificador."),
  text: z.string().trim().min(1, "El texto de la opción es obligatorio."),
});

export const educationQuestionSchema = z.object({
  id: z.string().min(1, "La pregunta necesita un identificador."),
  question: z
    .string()
    .trim()
    .min(5, "La pregunta debe tener al menos 5 caracteres."),
  options: z
    .array(educationQuestionOptionSchema)
    .min(2, "Cada pregunta debe tener al menos 2 opciones."),
  correctOptionId: z
    .string()
    .min(1, "Debe seleccionar una respuesta correcta."),
  explanation: z
    .string()
    .trim()
    .min(5, "La explicación debe tener al menos 5 caracteres."),
});

export const createEducationLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres."),
  summary: z
    .string()
    .trim()
    .min(10, "El resumen debe tener al menos 10 caracteres."),
  content: z
    .string()
    .trim()
    .min(100, "La lectura debe tener al menos 100 caracteres."),
  image: z.string().optional(),
  referenceImages: z.array(z.string()).optional(),
  estimatedMinutes: z.coerce
    .number()
    .min(5, "La lectura debe durar al menos 5 minutos.")
    .max(10, "La lectura no debería superar los 10 minutos."),
  questions: z
    .array(educationQuestionSchema)
    .min(1, "La lectura debe tener al menos una pregunta."),
});

export type CreateEducationLessonFormData = z.infer<
  typeof createEducationLessonSchema
>;