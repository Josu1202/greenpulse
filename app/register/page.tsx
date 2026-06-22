"use client";

import { useRouter } from "next/navigation";

import { AuthLayout } from "@/components/layout";
import { RegisterForm } from "@/features/auth";
import type { RegisterFormData } from "@/schemas";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error } = useAuth();

  const handleRegister = async (values: RegisterFormData) => {
    // register() crea el usuario en IndexedDB (Persona 2). Aquí solo se conecta.
    await register(values);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </AuthLayout>
  );
}