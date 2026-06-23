"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  PlusCircle,
  UserCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { APP_NAME } from "@/utils/constants";
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
  { label: "Mi perfil", href: "/profile", icon: UserCircle },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
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
    <div className="flex h-full w-64 flex-col bg-green-900 text-green-100">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-700">
          <Activity className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-white">{APP_NAME}</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-green-100/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-100/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
