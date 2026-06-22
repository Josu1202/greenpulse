import { AuthLayout } from "@/components/layout";
import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  // Página solo visual. Persona 2 conectará la lógica de restablecimiento
  // (verificar el correo en IndexedDB) pasando un onSubmit a ForgotPasswordForm.
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout> );
}