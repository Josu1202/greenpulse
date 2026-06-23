"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, Menu } from "lucide-react";

import { NotificationBell } from "@/components/notifications";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  userProfileImage?: string;
  onMenuClick?: () => void;
}

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

export function Topbar({
  title,
  subtitle,
  userName,
  userRole,
  userProfileImage,
  onMenuClick,
}: TopbarProps) {
  const { user, logout } = useAuth();

  const displayName = userName ?? user?.name ?? "Invitado";
  const displayRole = userRole ?? (user ? ROLE_LABELS[user.role] : "Sin sesión");
  const displayImage = userProfileImage ?? user?.profileImage;
  const initials = getInitials(displayName) || "GP";
  const profileHref = user?.role === "admin" ? "/admin/users" : "/profile";

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
        {user ? <NotificationBell /> : null}

        <Link
          href={profileHref}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
        >
          {displayImage ? (
            <Image
              src={displayImage}
              alt={`Foto de perfil de ${displayName}`}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
              {initials}
            </span>
          )}

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none text-slate-900">
              {displayName}
            </p>
            <p className="text-xs text-slate-500">{displayRole}</p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </Link>

        {user ? (
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </header>
  );
}
