"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui";
import type { UserRole } from "@/types";

interface MainLayoutProps {
  children: ReactNode;
}

const basePublicNavItems = [
  { label: "Inicio", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reportes", href: "/reports" },
  { label: "Mapa", href: "/map" },
  { label: "Educación", href: "/education" },
  { label: "Reconocimiento", href: "/recognition" },
];

const adminNavItems = [{ label: "Panel admin", href: "/admin" }];

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Usuario ambiental",
  admin: "Administrador",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const initials = user ? getInitials(user.name) || "GP" : "GP";
  const navItems = user?.role === "admin" ? adminNavItems : basePublicNavItems;
  const homeHref = user?.role === "admin" ? "/admin" : "/";
  const profileHref = user?.role === "admin" ? "/admin/users" : "/profile";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href={homeHref} className="flex items-center">
            <Logo size="md" subtitle="Monitoreo ambiental" />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <span className="text-sm text-slate-500">Cargando...</span>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={profileHref}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
                >
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={`Foto de perfil de ${user.name}`}
                      width={36}
                      height={36}
                      unoptimized
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                      {initials}
                    </span>
                  )}

                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold leading-none text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
                >
                  Iniciar sesión
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
