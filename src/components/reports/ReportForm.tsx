"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import { Button, Input, Select, Textarea } from "@/components/ui";
import type { Category, Report, ReportPriority, ReportStatus } from "@/types";
import { reportSchema, type ReportFormData } from "@/schemas/report.schema";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";
import { fileToDataUrl } from "@/utils/image";
import { LocationPicker } from "./LocationPicker";

interface ReportFormProps {
  categories: Category[];
  initialReport?: Report;
  initialData?: Partial<ReportFormData>;
  submitLabel?: string;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ReportForm({
  categories,
  initialReport,
  initialData,
  submitLabel = "Guardar reporte",
  onSubmit,
  onCancel,
}: ReportFormProps) {
  const [title, setTitle] = useState(
    initialReport?.title ?? initialData?.title ?? ""
  );

  const [description, setDescription] = useState(
    initialReport?.description ?? initialData?.description ?? ""
  );

  const [categoryId, setCategoryId] = useState(
    initialReport?.categoryId ?? initialData?.categoryId ?? ""
  );

  const [priority, setPriority] = useState<ReportPriority | "">(
    initialReport?.priority ?? initialData?.priority ?? ""
  );

  const [status, setStatus] = useState<ReportStatus>(
    initialReport?.status ?? initialData?.status ?? "pending"
  );

  const [latitude, setLatitude] = useState(
    initialReport ? String(initialReport.latitude) : ""
  );

  const [longitude, setLongitude] = useState(
    initialReport ? String(initialReport.longitude) : ""
  );

  const [image, setImage] = useState(initialReport?.image ?? initialData?.image);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setFormError(null);
      setIsReadingImage(true);

      const imageDataUrl = await fileToDataUrl(file);
      setImage(imageDataUrl);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudo procesar la imagen."
      );
    } finally {
      setIsReadingImage(false);
    }
  };

  const handleLocationChange = (nextLatitude: string, nextLongitude: string) => {
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
  };

  const handleRemoveImage = () => {
    setImage(undefined);
  };

  const handleSubmit = async () => {
    setFormError(null);

    const result = reportSchema.safeParse({
      title,
      description,
      categoryId,
      priority,
      status,
      latitude,
      longitude,
      image,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0];

        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Título *"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
          placeholder="Ej. Acumulación de basura en área verde"
        />

        <Select
          label="Categoría *"
          name="categoryId"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          error={errors.categoryId}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Descripción *"
        name="description"
        rows={4}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        error={errors.description}
        placeholder="Describe la situación, el lugar exacto y los detalles relevantes."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Prioridad *"
          name="priority"
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as ReportPriority | "")
          }
          error={errors.priority}
        >
          <option value="">Selecciona prioridad</option>
          {REPORT_PRIORITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        <Select
          label="Estado"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ReportStatus)}
          error={errors.status}
        >
          {REPORT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onChange={handleLocationChange}
        latitudeError={errors.latitude}
        longitudeError={errors.longitude}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Imagen principal del reporte (opcional)
        </label>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          disabled={isReadingImage}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100"
        />

        {isReadingImage ? (
          <p className="text-xs text-slate-500">Procesando imagen...</p>
        ) : null}

        {image ? (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Vista previa del reporte"
              className="h-28 w-28 rounded-lg border border-slate-200 object-cover"
            />

            <Button variant="outline" size="sm" onClick={handleRemoveImage}>
              Quitar imagen
            </Button>
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        {onCancel ? (
          <Button
            variant="outline"
            onClick={onCancel}
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
    </div>
  );
}