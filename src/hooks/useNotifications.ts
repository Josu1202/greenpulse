"use client";

import { useCallback, useEffect, useState } from "react";

import {
  deleteNotification,
  getNotificationsByUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/db/repositories";
import type { AppNotification } from "@/types";

import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getNotificationsByUser(user.id);
      setNotifications(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las notificaciones.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (id: string) => {
      await markNotificationAsRead(id);
      await loadNotifications();
    },
    [loadNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) {
      return;
    }

    await markAllNotificationsAsRead(user.id);
    await loadNotifications();
  }, [loadNotifications, user]);

  const removeNotification = useCallback(
    async (id: string) => {
      await deleteNotification(id);
      await loadNotifications();
    },
    [loadNotifications]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
}
