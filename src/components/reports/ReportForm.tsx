"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import { Button, Input, Select, Textarea } from "@/components/ui";
import type { Category, Report } from "@/types";
import { reportSchema, type ReportFormData } from "@/schemas/report.schema";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";

interface ReportFormProps {
  categories: Category[];
  initialReport?: Report;
  submitLabel?: string;
  onSubmit: (data: ReportFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ReportForm({
  categories,
  initialReport,
  submitLabel = "Guardar reporte",
  onSubmit,
  onCancel,
}: ReportFormProps) {
  const [title, setTitle] = useState(initialReport?.title ?? "");
  const [description, setDescription] = useState(
    initialReport?.description ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    initialReport?.categoryId ?? ""
  );
  const [priority, setPriority] = useState<string>(
    initialReport?.priority ?? ""
  );
  const [status, setStatus] = useState<string>(
    initialReport?.status ?? "pending"
  );
  const [latitude, setLatitude] = useState(
    initialReport ? String(initialReport.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    initialReport ? String(initialReport.longitude) : ""
  );
  const [image, setImage] = useState<string | undefined>(initialReport?.image);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setFormError(null);

    // Validación con Zod antes de persistir
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
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Ej. Acumulación de basura en área verde"
        />

        <Select
          label="Categoría *"
          name="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
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
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        placeholder="Describe la situación, el lugar exacto y los detalles relevantes."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Prioridad *"
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
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
          onChange={(e) => setStatus(e.target.value)}
          error={errors.status}
        >
          {REPORT_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Latitud *"
          name="latitude"
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          error={errors.latitude}
          placeholder="Ej. 13.4833"
        />

        <Input
          label="Longitud *"
          name="longitude"
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          error={errors.longitude}
          placeholder="Ej. -88.1833"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          Imagen (opcional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100"
        />
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="Vista previa del reporte"
            className="mt-2 h-28 w-28 rounded-lg object-cover border border-slate-200"
          />
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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
