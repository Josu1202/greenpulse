"use client";

import { Bell, ChevronDown, Menu } from "lucide-react";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
}

export function Topbar({
  title,
  subtitle,
  userName = "María López",
  userRole = "Analista ambiental",
  onMenuClick,
}: TopbarProps) {
  // Iniciales para el avatar (placeholder visual; luego vendrá del usuario real).
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {title ? (
          <div>
            <h1 className="text-base font-semibold text-slate-900 md:text-lg">
              {title}
            </h1>
            {subtitle ? (
              <p className="hidden text-xs text-slate-500 sm:block">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-600" />
        </button>

        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none text-slate-900">
              {userName}
            </p>
            <p className="text-xs text-slate-500">{userRole}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
}