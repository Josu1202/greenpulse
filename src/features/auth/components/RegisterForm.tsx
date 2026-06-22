"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, UserCircle } from "lucide-react";


import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import { registerSchema, type RegisterFormData } from "@/schemas";
import { cn } from "@/utils";
import { fileToDataUrl } from "@/utils/image";

interface RegisterFormProps {
  onSubmit?: (values: RegisterFormData) => void | Promise<void>;
  error?: string | null;
}

type FieldErrors = Partial<Record<keyof RegisterFormData, string>>;

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [imageError, setImageError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfileImage(undefined);
      setImageError(null);
      return;
    }

    try {
      setImageError(null);

      const imageDataUrl = await fileToDataUrl(file);

      setProfileImage(imageDataUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar la imagen.";

      setProfileImage(undefined);
      setImageError(message);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = registerSchema.safeParse({
      name,
      email,
      password,
      profileImage,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;

      setFieldErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
        profileImage: flat.profileImage?.[0],
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
        <h1 className="mt-2 text-xl font-bold text-slate-900">Crear cuenta</h1>
        <p className="text-sm text-slate-500">
          Únete y ayuda a cuidar nuestro entorno
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Vista previa de foto de perfil"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <UserCircle className="h-14 w-14 text-slate-400" />
              )}
            </div>

            <div className="w-full space-y-1.5">
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-slate-700"
              >
                Foto de perfil opcional
              </label>

              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className={cn(
                  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700",
                  "file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-green-700",
                  "hover:file:bg-green-100",
                  "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100",
                  (imageError || fieldErrors.profileImage) &&
                    "border-red-500 focus:border-red-500 focus:ring-red-100"
                )}
              />

              {imageError || fieldErrors.profileImage ? (
                <p className="text-sm text-red-600">
                  {imageError ?? fieldErrors.profileImage}
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Formatos permitidos: JPG, PNG o WEBP. Máximo 2 MB.
                </p>
              )}
            </div>
          </div>

          <Input
            label="Nombre completo"
            name="name"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={fieldErrors.name}
            autoComplete="name"
          />

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
                placeholder="Mínimo 4 caracteres"
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

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-green-700 hover:text-green-800"
          >
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}