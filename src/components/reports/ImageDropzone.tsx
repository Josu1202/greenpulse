"use client";

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Trash2, UploadCloud } from "lucide-react";

import { fileToCompressedDataUrl } from "@/utils/image";

interface ImageDropzoneProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  maxImages?: number;
}

export function ImageDropzone({
  images,
  onImagesChange,
  onProcessingChange,
  maxImages = 5,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = images.length < maxImages;

  const setProcessing = (value: boolean) => {
    setIsProcessing(value);
    onProcessingChange?.(value);
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const disponibles = maxImages - images.length;

    if (disponibles <= 0) {
      setError(`Solo puedes subir hasta ${maxImages} imágenes.`);
      return;
    }

    const seleccionadas = files.slice(0, disponibles);

    try {
      setError(null);
      setProcessing(true);

      const nuevas: string[] = [];
      for (const file of seleccionadas) {
        nuevas.push(await fileToCompressedDataUrl(file));
      }

      onImagesChange([...images, ...nuevas]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo procesar la imagen."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void processFiles(Array.from(event.dataTransfer.files ?? []));
  };

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Imágenes del reporte (opcional, hasta {maxImages})
      </label>

      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image, index) => (
            <div
              key={`${index}-${image.slice(0, 24)}`}
              className="group relative overflow-hidden rounded-lg border border-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="aspect-square w-full object-cover"
              />

              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Portada
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow-sm transition hover:bg-white"
                aria-label="Quitar imagen"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {canAddMore ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-green-500 bg-green-50"
              : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50/50"
          }`}
        >
          <UploadCloud className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-medium text-slate-700">
            Arrastra y suelta imágenes aquí
          </p>
          <p className="text-xs text-slate-500">
            o haz clic para seleccionar · JPG, PNG o WEBP
          </p>
          {isProcessing ? (
            <p className="text-xs text-green-700">Procesando imágenes...</p>
          ) : null}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(event) => {
          void processFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
