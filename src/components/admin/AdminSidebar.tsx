"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  LogOut,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Logo } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Resumen",
    href: "/admin",
    icon: BarChart3,
    description: "Indicadores y actividad",
  },
  {
    label: "Reportes",
    href: "/admin/reports",
    icon: FileText,
    description: "Moderación ambiental",
  },
  {
    label: "Lecciones",
    href: "/admin/lessons",
    icon: BookOpenCheck,
    description: "Contenido educativo",
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: Users,
    description: "Comunidad local",
  },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-slate-950 text-slate-100 transition-[width] duration-200",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div
        className={cn(
          "border-b border-white/10 py-5",
          collapsed ? "px-2" : "px-4"
        )}
      >
        <div
          className={cn(
            "flex",
            collapsed ? "flex-col items-center gap-3" : "items-center gap-3"
          )}
        >
          <Link
            href="/admin"
            onClick={onNavigate}
            className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Ir al panel administrativo"
          >
            <Logo
              tone="light"
              withText={!collapsed}
              subtitle={!collapsed ? "Administración" : undefined}
            />
          </Link>

          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={cn(
                "rounded-lg p-1.5 text-slate-100/80 transition-colors hover:bg-white/10 hover:text-white",
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

        {!collapsed ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-300">
              Panel administrativo
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Control local de contenido, usuarios y participación. Solo rutas admin.
            </p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex rounded-xl text-sm font-medium transition-colors",
                collapsed ? "justify-center px-0 py-3" : "items-start gap-3 px-3 py-2.5",
                isActive
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {collapsed ? null : (
                <span>
                  <span className="block leading-none">{item.label}</span>
                  <span
                    className={cn(
                      "mt-1 block text-xs font-normal",
                      isActive ? "text-green-50" : "text-slate-400"
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/15 hover:text-red-100",
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
