"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { UserCheck, UserX } from "lucide-react";

import { AdminTabs } from "@/components/admin";
import { AdminRoute, DashboardLayout } from "@/components/layout";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { useAdminUsers } from "@/hooks";
import type { User } from "@/types";

function formatDate(isoDate?: string): string {
  if (!isoDate) {
    return "-";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("es-SV", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function UserAvatar({ user }: { user: User }) {
  const initials = getInitials(user.name) || "GP";

  if (user.profileImage) {
    return (
      <Image
        src={user.profileImage}
        alt={`Foto de perfil de ${user.name}`}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
      {initials}
    </span>
  );
}

function AdminUsersContent() {
  const {
    users,
    reportsByUser,
    activitiesByUser,
    lessonsByUser,
    progressByUser,
    currentUser,
    isLoading,
    error,
    setActiveStatus,
  } = useAdminUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const visibleUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const isActive = user.isActive !== false;
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, users]);

  const handleDeactivate = async (user: User) => {
    const confirmed = window.confirm(
      `¿Desactivar a ${user.name}? No podrá iniciar sesión hasta ser reactivado.`
    );

    if (!confirmed) {
      return;
    }

    await setActiveStatus(user.id, false);
  };

  const handleReactivate = async (user: User) => {
    const confirmed = window.confirm(`¿Reactivar a ${user.name}?`);

    if (!confirmed) {
      return;
    }

    await setActiveStatus(user.id, true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Administración
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            Control de usuarios
          </h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            Consulta usuarios registrados, su participación y su progreso sin
            modificar roles desde esta pantalla.
          </p>
        </div>

        <AdminTabs active="users" />

        <Card className="grid gap-4 md:grid-cols-[1fr_220px]">
          <Input
            label="Buscar"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Nombre o correo"
          />

          <Select
            label="Estado"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </Select>
        </Card>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Cargando usuarios...
          </p>
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-600">Usuario</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Estado</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Reportes</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Comentarios/avances</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Lecciones creadas</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Lecciones completadas</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Último acceso</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {visibleUsers.map((user) => {
                    const isActive = user.isActive !== false;
                    const isCurrentUser = currentUser?.id === user.id;

                    return (
                      <tr key={user.id} className="align-top hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} />
                            <div>
                              <p className="font-medium text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                              {user.role === "admin" ? (
                                <p className="mt-1 text-xs font-medium text-green-700">
                                  Administrador
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant={isActive ? "success" : "outline"}>
                            {isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          {reportsByUser[user.id] ?? 0}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {activitiesByUser[user.id] ?? 0}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {lessonsByUser[user.id] ?? 0}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {progressByUser[user.id] ?? 0}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(user.lastLoginAt)}
                        </td>
                        <td className="px-4 py-3">
                          {isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isCurrentUser}
                              onClick={() => void handleDeactivate(user)}
                              className="gap-2"
                            >
                              <UserX className="h-4 w-4" />
                              Desactivar
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => void handleReactivate(user)}
                              className="gap-2"
                            >
                              <UserCheck className="h-4 w-4" />
                              Reactivar
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <AdminUsersContent />
    </AdminRoute>
  );
}
