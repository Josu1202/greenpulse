"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthLayout } from "@/components/layout";
import { LoginForm, type LoginFormValues } from "@/features/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, error, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    await login(email, password);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} error={error} />
    </AuthLayout>
  );
}
