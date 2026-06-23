"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CheckCheck,
  FileText,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";
import type { AppNotification, NotificationType } from "@/types";
import { cn } from "@/utils";

function getInitials(name?: string): string {
  if (!name) {
    return "GP";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function formatRelativeDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Hace un momento";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Hace un momento";
  }

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `Hace ${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `Hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;
  }

  return date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getNotificationIcon(type: NotificationType) {
  if (type.startsWith("lesson")) {
    return BookOpen;
  }

  if (type === "badge_earned") {
    return Award;
  }

  if (type === "report_comment") {
    return MessageSquare;
  }

  return FileText;
}

function getNotificationTone(type: NotificationType): string {
  if (type.includes("hidden") || type.includes("deleted")) {
    return "bg-orange-50 text-orange-700";
  }

  if (type.includes("published") || type.includes("badge")) {
    return "bg-green-50 text-green-700";
  }

  if (type.includes("high_priority")) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

interface NotificationItemProps {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({
  notification,
  onOpen,
  onDelete,
}: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const initials = getInitials(notification.actorName);

  return (
    <article
      className={cn(
        "group flex gap-2 border-b border-slate-100 px-3 py-3 transition last:border-b-0 hover:bg-slate-50 sm:gap-3",
        !notification.isRead && "bg-green-50/60"
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="flex min-w-0 flex-1 gap-2 text-left sm:gap-3"
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {notification.actorProfileImage ? (
            <Image
              src={notification.actorProfileImage}
              alt={notification.actorName ?? "Usuario"}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 object-cover"
            />
          ) : notification.actorName ? (
            <span className="flex h-9 w-9 items-center justify-center bg-green-100 text-xs font-bold text-green-700">
              {initials}
            </span>
          ) : (
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center",
                getNotificationTone(notification.type)
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}

          {!notification.isRead ? (
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-white bg-green-600" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
            <p className="min-w-0 break-words text-sm font-semibold leading-5 text-slate-900">
              {notification.title}
            </p>
            <span className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
              {formatRelativeDate(notification.createdAt)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-slate-600">
            {notification.message}
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onDelete(notification.id)}
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:mt-1 sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Eliminar notificación"
        title="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </article>
  );
}

export function NotificationBell() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const recentNotifications = useMemo(
    () => notifications.slice(0, 40),
    [notifications]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handleExternalClose() {
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("greenpulse:close-notifications", handleExternalClose);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("greenpulse:close-notifications", handleExternalClose);
    };
  }, []);

  const handleOpenNotification = async (notification: AppNotification) => {
    await markAsRead(notification.id);
    setIsOpen(false);

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new Event("greenpulse:close-sidebar"));
          setIsOpen((value) => !value);
        }}
        className="relative rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="fixed inset-x-3 top-16 z-50 max-h-[calc(100dvh-5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl lg:absolute lg:inset-x-auto lg:right-0 lg:top-12 lg:w-[min(92vw,390px)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900">
                Notificaciones
              </h2>
              <p className="text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} sin leer`
                  : "Todo al día"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={() => void markAllAsRead()}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-green-50 hover:text-green-700"
                  title="Marcar todas como leídas"
                  aria-label="Marcar todas como leídas"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                title="Cerrar"
                aria-label="Cerrar notificaciones"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Cargando notificaciones...
            </div>
          ) : recentNotifications.length > 0 ? (
            <div className="max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain lg:max-h-96">
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onOpen={handleOpenNotification}
                  onDelete={(id) => void removeNotification(id)}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                <Bell className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">
                Sin notificaciones
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Aquí verás avisos sobre reportes, lecciones e insignias.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
