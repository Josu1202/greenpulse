import { z } from "zod";

export const reportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres."),
  categoryId: z
    .string()
    .trim()
    .min(1, "Debe seleccionar una categoría."),
  status: z.enum(["pending", "in_review", "resolved"]).optional(),
  priority: z.enum(["low", "medium", "high"], {
    message: "Debe seleccionar una prioridad válida.",
  }),
  latitude: z.coerce
    .number({ message: "Debe seleccionar una ubicación." })
    .min(-90, "La latitud mínima es -90.")
    .max(90, "La latitud máxima es 90."),
  longitude: z.coerce
    .number({ message: "Debe seleccionar una ubicación." })
    .min(-180, "La longitud mínima es -180.")
    .max(180, "La longitud máxima es 180."),
  image: z.string().optional(),
});

const commentActivitySchema = z.object({
  activityType: z.literal("comment"),
  comment: z
    .string()
    .trim()
    .min(2, "El comentario debe tener al menos 2 caracteres."),
  image: z.string().optional(),
});

const progressActivitySchema = z.object({
  activityType: z.literal("progress_update"),
  comment: z
    .string()
    .trim()
    .min(5, "El avance debe incluir un comentario de al menos 5 caracteres."),
  status: z.enum(["pending", "in_review", "resolved"], {
    message: "Debe definir el estado actual del reporte.",
  }),
  priority: z.enum(["low", "medium", "high"], {
    message: "Debe definir la prioridad actual del reporte.",
  }),
  image: z.string().optional(),
});

export const reportActivitySchema = z.discriminatedUnion("activityType", [
  commentActivitySchema,
  progressActivitySchema,
]);

export type ReportFormData = z.infer<typeof reportSchema>;
export type ReportActivityFormData = z.infer<typeof reportActivitySchema>;
