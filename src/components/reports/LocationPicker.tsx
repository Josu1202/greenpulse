"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { Button, Input } from "@/components/ui";
import {
  createGoogleMapsUrl,
  parseGoogleMapsCoordinates,
} from "@/utils/googleMaps";

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
  latitudeError?: string;
  longitudeError?: string;
  label?: string;
}

export function LocationPicker({
  latitude,
  longitude,
  onChange,
  latitudeError,
  longitudeError,
  label = "Ubicación",
}: LocationPickerProps) {
  const [mapsLink, setMapsLink] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const hasCoordinates = Boolean(latitude && longitude);

  const handleParseLink = () => {
    const coordinates = parseGoogleMapsCoordinates(mapsLink);

    if (!coordinates) {
      setMessage(
        "No se pudieron leer coordenadas. Pega un enlace de Google Maps con coordenadas o un texto como 13.4833,-88.1833."
      );
      return;
    }

    onChange(String(coordinates.latitude), String(coordinates.longitude));
    setMessage("Ubicación seleccionada correctamente.");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Tu navegador no permite obtener la ubicación actual.");
      return;
    }

    setIsLocating(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(
          String(position.coords.latitude),
          String(position.coords.longitude)
        );
        setMessage("Ubicación actual seleccionada correctamente.");
        setIsLocating(false);
      },
      () => {
        setMessage("No se pudo obtener la ubicación actual.");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label} *</p>
        <p className="text-xs text-slate-500">
          Pega un enlace de Google Maps, pega coordenadas o usa tu ubicación
          actual.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          name="googleMapsLink"
          value={mapsLink}
          onChange={(event) => setMapsLink(event.target.value)}
          placeholder="Pega enlace de Google Maps o 13.4833,-88.1833"
        />

        <Button type="button" variant="secondary" onClick={handleParseLink}>
          Usar enlace
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="gap-2"
        >
          <MapPin className="h-4 w-4" />
          {isLocating ? "Obteniendo..." : "Usar mi ubicación"}
        </Button>

        {hasCoordinates ? (
          <a
            href={createGoogleMapsUrl(Number(latitude), Number(longitude))}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver en Google Maps
          </a>
        ) : null}
      </div>

      {hasCoordinates ? (
        <p className="text-xs text-slate-600">
          Coordenadas seleccionadas: {Number(latitude).toFixed(5)}, {" "}
          {Number(longitude).toFixed(5)}
        </p>
      ) : (
        <p className="text-xs text-slate-500">Aún no has seleccionado ubicación.</p>
      )}

      {latitudeError || longitudeError ? (
        <p className="text-sm text-red-600">
          {latitudeError ?? longitudeError}
        </p>
      ) : null}

      {message ? (
        <p
          className={
            message.includes("correctamente")
              ? "text-xs text-green-700"
              : "text-xs text-red-600"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
