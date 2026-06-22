import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

// Layout reutilizable para pantallas de autenticación (login / registro).
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}