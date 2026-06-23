"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  PlusCircle,
  UserCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/ui";
import { cn } from "@/utils";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reportes", href: "/reports", icon: FileText },
  { label: "Nuevo reporte", href: "/reports/new", icon: PlusCircle },
  { label: "Mapa", href: "/map", icon: MapPin },
  { label: "Educación", href: "/education", icon: GraduationCap },
  { label: "Reconocimiento", href: "/recognition", icon: Camera },
  { label: "Mi perfil", href: "/profile", icon: UserCircle },
];

interface SidebarProps {
  /** Se llama al navegar (usado para cerrar el drawer en móvil). */
  onNavigate?: () => void;
  /** Modo riel de íconos (solo escritorio). */
  collapsed?: boolean;
  /** Si se provee, muestra el botón de colapsar/expandir. */
  onToggleCollapse?: () => void;
}

export function Sidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const activeHref = NAV_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-green-900 text-green-100 transition-[width] duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Encabezado: logo + botón de colapsar */}
      <div
        className={cn(
          "flex py-5",
          collapsed
            ? "flex-col items-center gap-3 px-2"
            : "items-center gap-2 px-4"
        )}
      >
        <Link
        href="/"
        onClick={onNavigate}
        className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Ir al inicio"
      >
        <Logo tone="light" withText={!collapsed} subtitle={!collapsed ? "Monitoreo ambiental" : undefined} />
      </Link>

        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "rounded-lg p-1.5 text-green-100/80 transition-colors hover:bg-white/10 hover:text-white",
              !collapsed && "ml-auto"
            )}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        ) : null}
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-green-100/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {collapsed ? null : item.label}
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión */}
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-sm font-medium text-green-100/80 transition-colors hover:bg-white/10 hover:text-white",
            collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {collapsed ? null : "Cerrar sesión"}
        </button>
      </div>
    </div>
  );
}