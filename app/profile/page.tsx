"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Camera, KeyRound, Save, UserCircle } from "lucide-react";

import { MainLayout, ProtectedRoute } from "@/components/layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types";
import { fileToDataUrl } from "@/utils/image";

interface ProfileFormProps {
  user: User;
}

function ProfileForm({ user }: ProfileFormProps) {
  const {
    error,
    clearError,
    updateCurrentUser,
    updateCurrentUserProfileImage,
    changeCurrentUserPassword,
  } = useAuth();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState(user.profileImage ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      clearError();
      setProfileMessage(null);
      setIsSavingImage(true);

      const imageDataUrl = await fileToDataUrl(file);
      const updatedUser = await updateCurrentUserProfileImage(imageDataUrl);

      setProfileImage(updatedUser.profileImage ?? "");
      setProfileMessage("Foto de perfil actualizada correctamente.");
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      clearError();
      setProfileMessage(null);
      setIsSavingProfile(true);

      const updatedUser = await updateCurrentUser({
        name,
        email,
      });

      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setProfileMessage("Datos personales actualizados correctamente.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      clearError();
      setPasswordMessage(null);
      setIsSavingPassword(true);

      await changeCurrentUserPassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Contraseña actualizada correctamente.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi perfil</h1>
          <p className="mt-1 text-sm text-slate-600">
            Actualiza tus datos personales y tu contraseña local.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Foto de perfil
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Esta imagen se guarda localmente en IndexedDB.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-green-100 text-green-700">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={`Foto de perfil de ${name}`}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-16 w-16" />
                )}
              </div>

              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                  <Camera className="h-4 w-4" />
                  {isSavingImage ? "Guardando..." : "Cambiar foto"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSavingImage}
                  />
                </label>

                <p className="text-xs text-slate-500">
                  Formatos permitidos: JPG, PNG o WEBP.
                </p>

                {profileMessage ? (
                  <p className="text-sm text-green-700">{profileMessage}</p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Datos personales
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Modifica tu nombre y correo de acceso.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Nombre"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. María López"
                required
              />

              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@universidad.edu"
                required
              />

              {profileMessage ? (
                <p className="text-sm text-green-700">{profileMessage}</p>
              ) : null}

              <Button
                type="submit"
                disabled={isSavingProfile}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSavingProfile ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Cambiar contraseña
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Actualiza la contraseña de tu usuario local.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Contraseña actual"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Nueva contraseña"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
              />

              {passwordMessage ? (
                <p
                  className={
                    passwordMessage.includes("correctamente")
                      ? "text-sm text-green-700"
                      : "text-sm text-red-600"
                  }
                >
                  {passwordMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSavingPassword}
                className="gap-2"
              >
                <KeyRound className="h-4 w-4" />
                {isSavingPassword ? "Actualizando..." : "Cambiar contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  return (
    <ProtectedRoute>
      {isLoading ? (
        <MainLayout>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Cargando perfil...
          </div>
        </MainLayout>
      ) : user ? (
        <ProfileForm key={user.id} user={user} />
      ) : null}
    </ProtectedRoute>
  );
}