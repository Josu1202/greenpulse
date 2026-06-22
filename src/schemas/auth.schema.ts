import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingrese un correo válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingrese un correo válido."),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres."),
  profileImage: z.string().optional(),
});

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "El correo es obligatorio.")
      .email("Ingrese un correo válido."),
    password: z
      .string()
      .min(4, "La nueva contraseña debe tener al menos 4 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Debe confirmar la nueva contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio.")
    .email("Ingrese un correo válido."),
  profileImage: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: z
      .string()
      .min(4, "La nueva contraseña debe tener al menos 4 caracteres."),
    confirmPassword: z.string().min(1, "Debe confirmar la nueva contraseña."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
