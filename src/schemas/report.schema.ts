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
  status: z
    .enum(["pending", "in_review", "resolved"])
    .optional(),
  priority: z.enum(["low", "medium", "high"], {
    message: "Debe seleccionar una prioridad válida.",
  }),
  latitude: z.coerce
    .number()
    .min(-90, "La latitud mínima es -90.")
    .max(90, "La latitud máxima es 90."),
  longitude: z.coerce
    .number()
    .min(-180, "La longitud mínima es -180.")
    .max(180, "La longitud máxima es 180."),
  image: z
    .string()
    .optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;