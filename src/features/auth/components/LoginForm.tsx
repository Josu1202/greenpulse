"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Activity, Eye, EyeOff } from "lucide-react";

import { Button, Card, CardContent, CardHeader, Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/schemas";
import { APP_NAME } from "@/utils/constants";
import { cn } from "@/utils";

export type LoginFormValues = LoginFormData;

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
  error?: string | null;
}

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      });

      return;
    }

    setFieldErrors({});

    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
            <Activity className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold text-slate-900">{APP_NAME}</span>
        </div>

        <h1 className="mt-2 text-xl font-bold text-slate-900">
          Iniciar sesión
        </h1>

        <p className="text-sm text-slate-500">
          Accede a tu cuenta para continuar
        </p>
      </CardHeader>

      <CardContent>
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
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-green-700 hover:text-green-800"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-green-700 hover:text-green-800"
          >
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}