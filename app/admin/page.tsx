"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  Clock3,
  EyeOff,
  FileText,
  Gauge,
  MessageSquare,
  Star,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";

import { AdminRoute, DashboardLayout } from "@/components/layout";
import {
  AdminBarList,
  AdminRecentActivity,
  AdminStatCard,
  AdminTabs,
} from "@/components/admin";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { useAdminStats } from "@/hooks";
import type { AdminChartDatum } from "@/types";

type AdminDashboardSection = "users" | "reports" | "lessons" | "general";

interface AdminSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

function AdminSection({ title, description, children }: AdminSectionProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
          {title}
        </p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {children}
    </section>
  );
}

interface AdminRatioCardProps {
  title: string;
  value: number;
  label: string;
  helper: string;
}

function AdminRatioCard({ title, value, label, helper }: AdminRatioCardProps) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <div className="space-y-3">
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold text-slate-950">{safeValue}%</p>
          <p className="pb-1 text-sm text-slate-500">{label}</p>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${safeValue}%` }}
          />
        </div>

        <p className="text-xs text-slate-500">{helper}</p>
      </div>
    </Card>
  );
}

interface AdminCompactListProps {
  title: string;
  data: AdminChartDatum[];
  emptyMessage: string;
}

function AdminCompactList({ title, data, emptyMessage }: AdminCompactListProps) {
  const shouldScroll = data.length > 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          {emptyMessage}
        </p>
      ) : (
        <div
          className={
            shouldScroll
              ? "max-h-[460px] space-y-3 overflow-y-auto pr-2"
              : "space-y-3"
          }
        >
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {index + 1}
                </span>
                <span className="truncate text-sm font-medium text-slate-700">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

interface AdminSectionMenuProps {
  activeSection: AdminDashboardSection;
  onSectionChange: (section: AdminDashboardSection) => void;
}

const ADMIN_DASHBOARD_SECTIONS: Array<{
  id: AdminDashboardSection;
  label: string;
  description: string;
}> = [
  {
    id: "users",
    label: "Usuarios",
    description: "Comunidad y participación",
  },
  {
    id: "reports",
    label: "Reportes",
    description: "Incidencias y resolución",
  },
  {
    id: "lessons",
    label: "Lecciones",
    description: "Educación ambiental",
  },
  {
    id: "general",
    label: "General",
    description: "Tráfico y actividad",
  },
];

function AdminSectionMenu({
  activeSection,
  onSectionChange,
}: AdminSectionMenuProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {ADMIN_DASHBOARD_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={
                isActive
                  ? "rounded-2xl bg-green-600 px-4 py-3 text-left text-white shadow-sm transition"
                  : "rounded-2xl px-4 py-3 text-left text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              }
            >
              <span className="block text-sm font-semibold">
                {section.label}
              </span>
              <span
                className={
                  isActive
                    ? "mt-0.5 block text-xs text-green-50"
                    : "mt-0.5 block text-xs text-slate-400"
                }
              >
                {section.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const { stats, isLoading, error } = useAdminStats();
  const [activeSection, setActiveSection] =
    useState<AdminDashboardSection>("users");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Administración
          </p>
          <h1 className="text-3xl font-bold text-slate-950">
            Panel administrativo
          </h1>
          <p className="mt-1 max-w-3xl text-slate-600">
            Control local separado por usuarios, reportes, lecciones y actividad
            general del MVP.
          </p>
        </div>

        <AdminTabs active="dashboard" />

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {isLoading || !stats ? (
          <p className="py-10 text-center text-sm text-slate-500">
            Cargando indicadores administrativos...
          </p>
        ) : (
          <>
            <AdminSectionMenu
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            {activeSection === "users" ? (
              <AdminSection
                title="Usuarios"
                description="Mide el tamaño de la comunidad, actividad básica, estado de cuentas y participación por usuario."
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard
                    label="Usuarios registrados"
                    value={stats.totalUsers}
                    description="Cuentas creadas en IndexedDB local"
                    icon={<Users className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="Usuarios activos"
                    value={stats.activeUsers}
                    description={`${stats.inactiveUsers} inactivos o desactivados`}
                    icon={<UserCheck className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminStatCard
                    label="Nuevos últimos 7 días"
                    value={stats.newUsersLast7Days}
                    description="Registros recientes del entorno local"
                    icon={<UserPlus className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="Usuarios inactivos"
                    value={stats.inactiveUsers}
                    description="Usuarios bloqueados para iniciar sesión"
                    icon={<UserX className="h-5 w-5" />}
                    accent="slate"
                  />

                  <AdminStatCard
                    label="Promedio de reportes"
                    value={stats.averageReportsPerUser}
                    description="Reportes creados por usuario no admin"
                    icon={<Gauge className="h-5 w-5" />}
                    accent="purple"
                  />

                  <AdminStatCard
                    label="Interacción por usuario"
                    value={stats.averageActivitiesPerUser}
                    description="Comentarios y avances promedio por usuario"
                    icon={<MessageSquare className="h-5 w-5" />}
                    accent="purple"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <AdminBarList
                    title="Estado de usuarios"
                    data={stats.userStatusChart}
                    emptyMessage="Aún no hay usuarios registrados."
                  />

                  <AdminCompactList
                    title="Usuarios con más participación"
                    data={stats.userContributionChart}
                    emptyMessage="Aún no hay aportes de usuarios."
                  />
                </div>
              </AdminSection>
            ) : null}

            {activeSection === "reports" ? (
              <AdminSection
                title="Reportes"
                description="Resume la carga de incidencias, resolución, prioridad, categorías y moderación de reportes ambientales."
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard
                    label="Reportes registrados"
                    value={stats.totalReports}
                    description={`${stats.visibleReportsCount} visibles · ${stats.hiddenReportsCount} ocultos`}
                    icon={<FileText className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminStatCard
                    label="Reportes resueltos"
                    value={stats.resolvedReportsCount}
                    description="Incidencias cerradas por la comunidad"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="Alta prioridad"
                    value={stats.highPriorityReportsCount}
                    description="Reportes que requieren atención inmediata"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    accent="amber"
                  />

                  <AdminStatCard
                    label="Reportes ocultos"
                    value={stats.hiddenReportsCount}
                    description="Contenido moderado por administración"
                    icon={<EyeOff className="h-5 w-5" />}
                    accent="slate"
                  />

                  <AdminStatCard
                    label="Pendientes"
                    value={stats.pendingReportsCount}
                    description="Aún no han iniciado seguimiento"
                    icon={<Clock3 className="h-5 w-5" />}
                    accent="amber"
                  />

                  <AdminStatCard
                    label="En revisión"
                    value={stats.inReviewReportsCount}
                    description="Con seguimiento activo"
                    icon={<Activity className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminStatCard
                    label="Comentarios y avances"
                    value={stats.totalActivities}
                    description={`${stats.commentsCount} comentarios · ${stats.progressUpdatesCount} avances`}
                    icon={<MessageSquare className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminRatioCard
                    title="Tasa de resolución"
                    value={stats.reportResolutionRate}
                    label="reportes resueltos"
                    helper={`${stats.resolvedReportsCount} de ${stats.totalReports} reportes cerrados.`}
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <AdminBarList
                    title="Reportes por estado"
                    data={stats.reportStatusChart}
                    emptyMessage="Aún no hay reportes registrados."
                  />

                  <AdminBarList
                    title="Reportes por prioridad"
                    data={stats.reportPriorityChart}
                    emptyMessage="Aún no hay reportes registrados."
                  />

                  <AdminBarList
                    title="Reportes por categoría"
                    data={stats.reportCategoryChart}
                    emptyMessage="Aún no hay reportes con categoría."
                  />

                  <AdminBarList
                    title="Visibilidad de reportes"
                    data={stats.reportVisibilityChart}
                    emptyMessage="Aún no hay reportes para moderar."
                  />

                  <AdminBarList
                    title="Participación en reportes"
                    data={stats.forumActivityChart}
                    emptyMessage="Aún no hay comentarios ni avances."
                  />
                </div>
              </AdminSection>
            ) : null}

            {activeSection === "lessons" ? (
              <AdminSection
                title="Lecciones ambientales"
                description="Controla creación, revisión, publicación, contenido destacado y resultados del módulo educativo."
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard
                    label="Lecciones totales"
                    value={stats.totalLessonsCount}
                    description={`${stats.baseLessonsCount} base · ${stats.userLessonsCount} de usuarios`}
                    icon={<BookOpen className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="En revisión"
                    value={stats.pendingReviewLessonsCount}
                    description="Contenidos esperando aprobación admin"
                    icon={<BookOpenCheck className="h-5 w-5" />}
                    accent="amber"
                  />

                  <AdminStatCard
                    label="Publicadas"
                    value={stats.publishedLessonsCount}
                    description="Disponibles para estudiantes"
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="Destacadas"
                    value={stats.featuredLessonsCount}
                    description="Lecciones promovidas en educación"
                    icon={<Star className="h-5 w-5" />}
                    accent="purple"
                  />

                  <AdminStatCard
                    label="Lecciones ocultas"
                    value={stats.hiddenLessonsCount}
                    description="Retiradas por moderación"
                    icon={<EyeOff className="h-5 w-5" />}
                    accent="slate"
                  />

                  <AdminStatCard
                    label="Lecciones completadas"
                    value={stats.completedLessonsCount}
                    description="Intentos completados por usuarios"
                    icon={<BarChart3 className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminRatioCard
                    title="Cobertura educativa"
                    value={stats.lessonCompletionCoverageRate}
                    label="lecciones con al menos un intento"
                    helper="Mide cuántas lecciones ya tuvieron participación real."
                  />

                  <AdminStatCard
                    label="Lecciones de usuarios"
                    value={stats.userLessonsCount}
                    description="Contenidos enviados por la comunidad"
                    icon={<BookOpenCheck className="h-5 w-5" />}
                    accent="amber"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <AdminBarList
                    title="Lecciones por estado"
                    data={stats.lessonStatusChart}
                    emptyMessage="Aún no hay lecciones registradas."
                  />

                  <AdminBarList
                    title="Origen de lecciones"
                    data={stats.lessonSourceChart}
                    emptyMessage="Aún no hay lecciones registradas."
                  />

                  <AdminCompactList
                    title="Lecciones más completadas"
                    data={stats.topCompletedLessons}
                    emptyMessage="Aún no hay lecciones completadas."
                  />

                  <AdminBarList
                    title="Participación educativa"
                    data={[
                      {
                        name: "Completadas",
                        value: stats.completedLessonsCount,
                      },
                      {
                        name: "Destacadas",
                        value: stats.featuredLessonsCount,
                      },
                      {
                        name: "En revisión",
                        value: stats.pendingReviewLessonsCount,
                      },
                    ]}
                    emptyMessage="Aún no hay participación educativa."
                  />
                </div>
              </AdminSection>
            ) : null}

            {activeSection === "general" ? (
              <AdminSection
                title="General del sitio"
                description="Concentra tráfico local, uso de reconocimiento IA, visitas administrativas y actividad reciente del sistema."
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard
                    label="Visitas locales"
                    value={stats.pageViewsCount}
                    description="Tráfico registrado en este navegador"
                    icon={<Activity className="h-5 w-5" />}
                    accent="slate"
                  />

                  <AdminStatCard
                    label="Visitas admin"
                    value={stats.adminViewsCount}
                    description="Uso del módulo administrativo"
                    icon={<TrendingUp className="h-5 w-5" />}
                    accent="blue"
                  />

                  <AdminStatCard
                    label="Reconocimiento IA"
                    value={stats.recognitionViewsCount}
                    description="Visitas a la pantalla de reconocimiento"
                    icon={<Bot className="h-5 w-5" />}
                    accent="green"
                  />

                  <AdminStatCard
                    label="Interacción por reporte"
                    value={stats.averageActivitiesPerReport}
                    description="Comentarios y avances promedio por reporte"
                    icon={<MessageSquare className="h-5 w-5" />}
                    accent="purple"
                  />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  <AdminBarList
                    title="Tráfico local por sección"
                    data={stats.pageViewsChart}
                    emptyMessage="Las visitas se empezarán a registrar desde esta versión."
                  />

                  <AdminRecentActivity events={stats.recentEvents} />
                </div>
              </AdminSection>
            ) : null}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
