"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";

interface ForgotPasswordFormProps {
  // Persona 2 conectará aquí la lógica real de restablecimiento.
  onSubmit?: (email: string) => void | Promise<void>;
  error?: string | null;
}

export function ForgotPasswordForm({ onSubmit, error }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    // Validación visual mínima; la verificación real la hará Persona 2.
    if (!trimmedEmail) {
      setFieldError("El correo es obligatorio.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setFieldError("Ingrese un correo válido.");
      return;
    }

    setFieldError(undefined);

    try {
      setIsSubmitting(true);
      await onSubmit?.(trimmedEmail);
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
            ? "Revisa tu correo para continuar."
            : "Ingresa tu correo y te enviaremos instrucciones para restablecerla."}
        </p>
      </CardHeader>

      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="text-sm text-slate-600">
              Si{" "}
              <span className="font-medium text-slate-900">{email}</span> está
              registrado, recibirás instrucciones para restablecer tu
              contraseña.
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
              error={fieldError}
              autoComplete="email"
            />

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
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