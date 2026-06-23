"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { trackAdminEvent } from "@/db/repositories";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils";
import { AdminSidebar } from "@/components/admin";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Rutas donde el sidebar inicia COLAPSADO (riel de íconos) al entrar,
 * para dar más espacio al contenido (mapa, lecciones, cámara).
 * En el resto (Dashboard, Reportes) inicia desplegado.
 */
const COLLAPSED_BY_DEFAULT = ["/map", "/education", "/recognition"];

function isAdminRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function shouldCollapse(pathname: string): boolean {
  return COLLAPSED_BY_DEFAULT.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const shouldUseAdminSidebar = isAdminRoute(pathname) || user?.role === "admin";
  const SidebarComponent = shouldUseAdminSidebar ? AdminSidebar : Sidebar;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // drawer móvil
  const [isCollapsed, setIsCollapsed] = useState(() =>
    shouldCollapse(pathname)
  );

  // Al cambiar de página, aplica el estado por defecto de esa ruta
  // (patrón recomendado de React: ajustar estado durante el render).
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    setIsCollapsed(shouldCollapse(pathname));
  }


  useEffect(() => {
    if (!user) {
      return;
    }

    void trackAdminEvent({
      userId: user.id,
      userName: user.name,
      type: "page_view",
      path: pathname,
      entityType: "page",
      description: `Visita local a ${pathname}.`,
    }).catch(() => undefined);
  }, [pathname, user]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar fijo en escritorio (colapsable) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <SidebarComponent
          collapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((value) => !value)}
        />
      </aside>

      {/* Drawer en móvil (siempre desplegado) */}
      {isSidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0">
            <SidebarComponent onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      {/* Contenido principal; el padding se ajusta al ancho del sidebar */}
      <div
        className={cn(
          "transition-[padding] duration-200",
          isCollapsed ? "md:pl-16" : shouldUseAdminSidebar ? "md:pl-72" : "md:pl-64"
        )}
      >
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}