"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Button, Select, Textarea } from "@/components/ui";
import type { ReportActivityFormData } from "@/schemas/report.schema";
import { reportActivitySchema } from "@/schemas/report.schema";
import type { ReportPriority, ReportStatus } from "@/types";
import { REPORT_PRIORITIES, REPORT_STATUSES } from "@/utils/constants";
import { fileToDataUrl } from "@/utils/image";

interface ReportActivityFormProps {
  currentStatus: ReportStatus;
  currentPriority: ReportPriority;
  onSubmit: (data: ReportActivityFormData) => Promise<void>;
}

export function ReportActivityForm({
  currentStatus,
  currentPriority,
  onSubmit,
}: ReportActivityFormProps) {
  const [activityType, setActivityType] = useState<
    ReportActivityFormData["activityType"]
  >("comment");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [priority, setPriority] = useState<ReportPriority>(currentPriority);
  const [image, setImage] = useState<string | undefined>();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError(null);
      setIsReadingImage(true);

      const imageDataUrl = await fileToDataUrl(file);
      setImage(imageDataUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo procesar la imagen."
      );
    } finally {
      setIsReadingImage(false);
    }
  };

  const handleActivityTypeChange = (
    nextActivityType: ReportActivityFormData["activityType"]
  ) => {
    setActivityType(nextActivityType);
    setError(null);
    setMessage(null);

    if (nextActivityType === "progress_update") {
      setStatus(currentStatus);
      setPriority(currentPriority);
    }
  };

  const handleRemoveImage = () => {
    setImage(undefined);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const payload =
      activityType === "comment"
        ? {
            activityType,
            comment,
            image,
          }
        : {
            activityType,
            comment,
            status,
            priority,
            image,
          };

    const result = reportActivitySchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Datos inválidos.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(result.data);
      setComment("");
      setImage(undefined);
      setStatus(currentStatus);
      setPriority(currentPriority);
      setMessage(
        activityType === "comment"
          ? "Comentario agregado correctamente."
          : "Avance agregado correctamente."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la actividad."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Agregar actividad al reporte
        </p>
        <p className="text-xs text-slate-500">
          Agrega un comentario simple o registra un avance con estado y
          prioridad obligatorios.
        </p>
      </div>

      <Select
        label="Tipo de actividad"
        value={activityType}
        onChange={(event) =>
          handleActivityTypeChange(
            event.target.value as ReportActivityFormData["activityType"]
          )
        }
      >
        <option value="comment">Comentario</option>
        <option value="progress_update">Avance</option>
      </Select>

      <Textarea
        label={
          activityType === "comment" ? "Comentario *" : "Comentario del avance *"
        }
        name="activityComment"
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={
          activityType === "comment"
            ? "Escribe un comentario sobre este reporte."
            : "Describe qué avance hubo, qué se revisó o qué falta por hacer."
        }
      />

      {activityType === "progress_update" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Estado actual del reporte *"
            value={status}
            onChange={(event) => setStatus(event.target.value as ReportStatus)}
          >
            {REPORT_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>

          <Select
            label="Prioridad actual del reporte *"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as ReportPriority)
            }
          >
            {REPORT_PRIORITIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {activityType === "comment"
            ? "Imagen del comentario (opcional)"
            : "Imagen del avance (opcional)"}
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
              alt={
                activityType === "comment"
                  ? "Vista previa del comentario"
                  : "Vista previa del avance"
              }
              className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
            >
              Quitar imagen
            </Button>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {message ? <p className="text-sm text-green-700">{message}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || isReadingImage}>
          {isSubmitting
            ? "Guardando..."
            : activityType === "comment"
              ? "Agregar comentario"
              : "Agregar avance"}
        </Button>
      </div>
    </form>
  );
}
