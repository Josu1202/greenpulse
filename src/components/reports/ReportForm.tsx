"use client";

import { useEffect, useMemo, useState } from "react";

import { Button, ConfirmDialog, Input, Select, Textarea } from "@/components/ui";
import type { Category, Report, ReportStatus } from "@/types";
import { reportSchema, type ReportFormData } from "@/schemas/report.schema";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";
import { LocationPicker } from "./LocationPicker";
import { ImageDropzone } from "./ImageDropzone";
import { CategoryChips } from "./CategoryChips";

interface ReportFormProps {
  categories: Category[];
  initialReport?: Report;
  initialData?: Partial<ReportFormData>;
  existingReports?: Report[];
  submitLabel?: string;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onCancel?: () => void;
}

const TITLE_MIN = 3;
const DESCRIPTION_MIN = 10;
const DRAFT_KEY = "greenpulse:report-draft";
const DUPLICATE_RADIUS_M = 50;

interface DraftShape {
  title: string;
  description: string;
  categoryId: string;
  priority: string;
  latitude: string;
  longitude: string;
  images: string[];
}

// Distancia aproximada en metros entre dos coordenadas (haversine).
function distanceMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function ReportForm({
  categories,
  initialReport,
  initialData,
  existingReports = [],
  submitLabel = "Guardar reporte",
  onSubmit,
  onCancel,
}: ReportFormProps) {
  const isEditing = Boolean(initialReport);

  const initial = useMemo(() => {
    const lat = initialReport
      ? String(initialReport.latitude)
      : initialData?.latitude != null
        ? String(initialData.latitude)
        : "";
    const lng = initialReport
      ? String(initialReport.longitude)
      : initialData?.longitude != null
        ? String(initialData.longitude)
        : "";
    const images =
      initialReport?.images ??
      (initialReport?.image
        ? [initialReport.image]
        : initialData?.image
          ? [initialData.image]
          : []);

    return {
      title: initialReport?.title ?? initialData?.title ?? "",
      description: initialReport?.description ?? initialData?.description ?? "",
      categoryId: initialReport?.categoryId ?? initialData?.categoryId ?? "",
      priority: (initialReport?.priority ??
        initialData?.priority ??
        "") as string,
      // Al crear, el estado siempre es "pending" (no se puede elegir).
      status: (initialReport?.status ?? "pending") as ReportStatus,
      latitude: lat,
      longitude: lng,
      images,
    };
  }, [initialReport, initialData]);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [priority, setPriority] = useState<string>(initial.priority);
  const [status, setStatus] = useState<ReportStatus>(initial.status);
  const [latitude, setLatitude] = useState(initial.latitude);
  const [longitude, setLongitude] = useState(initial.longitude);
  const [images, setImages] = useState<string[]>(initial.images);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [draftAvailable, setDraftAvailable] = useState(false);

  // --- Autoguardado de borrador (solo para reportes nuevos sin prefill) ---
  // Si el formulario viene prellenado desde el reconocimiento de residuos
  // (initialData), no mostramos el banner de restaurar para no competir con él.
  const allowDraft = !isEditing && !initialData;

  useEffect(() => {
    if (!allowDraft || typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        setDraftAvailable(true);
      }
    } catch {
      // localStorage no disponible.
    }
  }, [allowDraft]);

  useEffect(() => {
    if (isEditing || typeof window === "undefined") {
      return;
    }

    const draft: DraftShape = {
      title,
      description,
      categoryId,
      priority,
      latitude,
      longitude,
      images,
    };

    const isEmpty =
      !title && !description && !categoryId && !priority && !latitude;

    try {
      if (isEmpty) {
        window.localStorage.removeItem(DRAFT_KEY);
      } else {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }
    } catch {
      // Se ignora.
    }
  }, [
    isEditing,
    title,
    description,
    categoryId,
    priority,
    latitude,
    longitude,
    images,
  ]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Se ignora.
    }
    setDraftAvailable(false);
  };

  const restoreDraft = () => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as DraftShape;
        setTitle(draft.title ?? "");
        setDescription(draft.description ?? "");
        setCategoryId(draft.categoryId ?? "");
        setPriority(draft.priority ?? "");
        setLatitude(draft.latitude ?? "");
        setLongitude(draft.longitude ?? "");
        setImages(Array.isArray(draft.images) ? draft.images : []);
      }
    } catch {
      // Se ignora.
    }
    setDraftAvailable(false);
  };

  // --- Validación en vivo ---
  const liveErrors = useMemo(() => {
    const result = reportSchema.safeParse({
      title,
      description,
      categoryId,
      priority,
      status,
      latitude,
      longitude,
      image: images[0],
      images,
    });

    if (result.success) {
      return {} as Record<string, string>;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return errors;
  }, [
    title,
    description,
    categoryId,
    priority,
    status,
    latitude,
    longitude,
    images,
  ]);

  const errorFor = (field: string): string | undefined =>
    touched[field] || submitted ? liveErrors[field] : undefined;

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // --- Aviso de posible duplicado ---
  const duplicate = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!categoryId || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return existingReports.find((report) => {
      if (initialReport && report.id === initialReport.id) {
        return false;
      }
      if (report.categoryId !== categoryId) {
        return false;
      }
      return (
        distanceMeters(lat, lng, report.latitude, report.longitude) <=
        DUPLICATE_RADIUS_M
      );
    });
  }, [categoryId, latitude, longitude, existingReports, initialReport]);

  const isDirty =
    title !== initial.title ||
    description !== initial.description ||
    categoryId !== initial.categoryId ||
    priority !== initial.priority ||
    status !== initial.status ||
    latitude !== initial.latitude ||
    longitude !== initial.longitude ||
    JSON.stringify(images) !== JSON.stringify(initial.images);

  const handleLocationChange = (
    nextLatitude: string,
    nextLongitude: string
  ) => {
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
    setTouched((prev) => ({ ...prev, latitude: true, longitude: true }));
  };

  const handleSubmit = async () => {
    setFormError(null);
    setSubmitted(true);

    const result = reportSchema.safeParse({
      title,
      description,
      categoryId,
      priority,
      status,
      latitude,
      longitude,
      image: images[0],
      images,
    });

    if (!result.success) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
      if (!isEditing) {
        clearDraft();
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el reporte."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (!onCancel) {
      return;
    }
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      onCancel();
    }
  };

  const titleCount = title.trim().length;
  const descriptionCount = description.trim().length;

  return (
    <div className="space-y-4">
      {draftAvailable ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Tienes un borrador sin terminar. ¿Quieres restaurarlo?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearDraft}>
              Descartar
            </Button>
            <Button variant="primary" size="sm" onClick={restoreDraft}>
              Restaurar
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Input
            label="Título *"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => markTouched("title")}
            error={errorFor("title")}
            placeholder="Ej. Acumulación de basura en área verde"
          />
          <p
            className={`mt-1 text-xs ${
              titleCount < TITLE_MIN ? "text-slate-400" : "text-green-600"
            }`}
          >
            {titleCount} caracteres (mínimo {TITLE_MIN})
          </p>
        </div>

        <Select
          label="Prioridad *"
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          onBlur={() => markTouched("priority")}
          error={errorFor("priority")}
        >
          <option value="">Selecciona prioridad</option>
          {REPORT_PRIORITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      <CategoryChips
        categories={categories}
        selectedCategoryId={categoryId}
        onSelect={(id) => {
          setCategoryId(id);
          markTouched("categoryId");
        }}
        error={errorFor("categoryId")}
      />

      <div>
        <Textarea
          label="Descripción *"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={() => markTouched("description")}
          error={errorFor("description")}
          placeholder="Describe la situación, el lugar exacto y los detalles relevantes."
        />
        <p
          className={`mt-1 text-xs ${
            descriptionCount < DESCRIPTION_MIN
              ? "text-slate-400"
              : "text-green-600"
          }`}
        >
          {descriptionCount} caracteres (mínimo {DESCRIPTION_MIN})
        </p>
      </div>

      {/* El estado solo se puede elegir al editar. Al crear queda en "Pendiente". */}
      {isEditing ? (
        <Select
          label="Estado"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ReportStatus)}
          error={errorFor("status")}
        >
          {REPORT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      ) : null}

      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onChange={handleLocationChange}
        latitudeError={errorFor("latitude")}
        longitudeError={errorFor("longitude")}
      />

      {duplicate ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Ya existe un reporte de la misma categoría muy cerca de esta ubicación
          (“{duplicate.title}”). Verifica que no sea un duplicado.
        </p>
      ) : null}

      <ImageDropzone
        images={images}
        onImagesChange={setImages}
        onProcessingChange={setIsReadingImage}
      />

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        {onCancel ? (
          <Button
            variant="outline"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        ) : null}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || isReadingImage}
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>

      <ConfirmDialog
        open={showCancelDialog}
        title="¿Descartar los cambios?"
        description="Tienes cambios sin guardar en el reporte. Si sales ahora, se perderán."
        confirmLabel="Descartar"
        cancelLabel="Seguir editando"
        variant="danger"
        onConfirm={() => {
          setShowCancelDialog(false);
          onCancel?.();
        }}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
}
