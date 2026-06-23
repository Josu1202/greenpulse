import Link from "next/link";
import type { ReactNode } from "react";

import { APP_NAME } from "@/utils/constants";

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Reportes",
    href: "/reports",
  },
  {
    label: "Mapa",
    href: "/map",
  },
];

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">
              G
            </span>
            <div>
              <p className="text-sm font-bold leading-none text-slate-900">
                {APP_NAME}
              </p>
              <p className="text-xs text-slate-500">Monitoreo ambiental</p>
            </div>
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}