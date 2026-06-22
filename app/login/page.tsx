"use client";

import { useRouter } from "next/navigation";

import { AuthLayout } from "@/components/layout";
import { LoginForm, type LoginFormValues } from "@/features/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useAuth();

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    // login() y su validación viven en useAuth (Persona 2). Aquí solo se conecta.
    await login(email, password);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} error={error} />
    </AuthLayout>
  );
}