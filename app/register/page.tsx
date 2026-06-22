"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AuthLayout } from "@/components/layout";
import { RegisterForm } from "@/features/auth";
import type { RegisterFormData } from "@/schemas";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRegister = async (values: RegisterFormData) => {
    await register(values);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </AuthLayout>
  );
}
