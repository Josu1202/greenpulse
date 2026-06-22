"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schemas";
import { cn } from "@/utils";

export type ForgotPasswordFormValues = ForgotPasswordFormData;

interface ForgotPasswordFormProps {
  onSubmit?: (values: ForgotPasswordFormValues) => void | Promise<void>;
  error?: string | null;
}

type FieldErrors = Partial<Record<keyof ForgotPasswordFormValues, string>>;

export function ForgotPasswordForm({
  onSubmit,
  error,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = forgotPasswordSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });

      return;
    }

    setFieldErrors({});

    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          Recuperar contraseña
        </h1>

        <p className="text-sm text-slate-500">
          {isSubmitted
            ? "Tu contraseña fue actualizada correctamente."
            : "Ingresa tu correo y define una nueva contraseña."}
        </p>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </span>

            <p className="text-sm text-slate-600">
              La contraseña del usuario{" "}
              <span className="font-medium text-slate-900">{email}</span> fue
              restablecida localmente.
            </p>

            <Link
              href="/login"
              className="block text-sm font-medium text-green-700 hover:text-green-800"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              placeholder="ejemplo@universidad.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Nueva contraseña
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className={cn(
                    "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900",
                    "placeholder:text-slate-400",
                    "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100",
                    fieldErrors.password &&
                      "border-red-500 focus:border-red-500 focus:ring-red-100"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {fieldErrors.password ? (
                <p className="text-sm text-red-600">{fieldErrors.password}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirmar contraseña
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className={cn(
                    "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-900",
                    "placeholder:text-slate-400",
                    "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100",
                    fieldErrors.confirmPassword &&
                      "border-red-500 focus:border-red-500 focus:ring-red-100"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {fieldErrors.confirmPassword ? (
                <p className="text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </Button>

            <p className="text-center text-sm text-slate-500">
              <Link
                href="/login"
                className="font-medium text-green-700 hover:text-green-800"
              >
                Volver a iniciar sesión
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}