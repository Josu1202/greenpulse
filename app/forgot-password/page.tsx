"use client";

import { AuthLayout } from "@/components/layout";
import {
  ForgotPasswordForm,
  type ForgotPasswordFormValues,
} from "@/features/auth";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { resetPasswordByEmail, error } = useAuth();

  const handleResetPassword = async ({
    email,
    password,
  }: ForgotPasswordFormValues) => {
    await resetPasswordByEmail(email, password);
  };

  return (
    <AuthLayout>
      <ForgotPasswordForm onSubmit={handleResetPassword} error={error} />
    </AuthLayout>
  );
}