"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search } from "lucide-react";

import { Button, Input } from "@/components/ui";
import {
  createGoogleMapsUrl,
  parseGoogleMapsCoordinates,
} from "@/utils/googleMaps";
import { DEFAULT_MAP_CENTER } from "@/utils/constants";
import {
  reverseGeocode,
  searchAddress,
  type GeocodeResult,
} from "@/utils/geocoding";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
      Cargando mapa...
    </div>
  ),
});

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const hasCoordinates = Boolean(latitude && longitude);

  const latNumber = latitude ? Number(latitude) : null;
  const lngNumber = longitude ? Number(longitude) : null;
  const validLat =
    latNumber !== null && Number.isFinite(latNumber) ? latNumber : null;
  const validLng =
    lngNumber !== null && Number.isFinite(lngNumber) ? lngNumber : null;

  // Dirección aproximada (reverse geocoding) cuando cambian las coordenadas.
  const reverseTimer = useRef<number | null>(null);
  useEffect(() => {
    if (validLat === null || validLng === null) {
      setAddress(null);
      return;
    }

    if (reverseTimer.current) {
      window.clearTimeout(reverseTimer.current);
    }

    reverseTimer.current = window.setTimeout(() => {
      void reverseGeocode(validLat, validLng).then((label) =>
        setAddress(label)
      );
    }, 700);

    return () => {
      if (reverseTimer.current) {
        window.clearTimeout(reverseTimer.current);
      }
    };
  }, [validLat, validLng]);

  const handlePickFromMap = (lat: number, lng: number) => {
    onChange(lat.toFixed(6), lng.toFixed(6));
    setMessage("Ubicación seleccionada en el mapa.");
    setResults([]);
  };

  const handleSearchAddress = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      setMessage(null);
      const encontrados = await searchAddress(query);
      setResults(encontrados);

      if (encontrados.length === 0) {
        setMessage("No se encontraron resultados para esa dirección.");
      }
    } catch {
      setMessage("No se pudo buscar la dirección. Intenta de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: GeocodeResult) => {
    onChange(result.latitude.toFixed(6), result.longitude.toFixed(6));
    setResults([]);
    setQuery(result.label);
    setMessage("Ubicación seleccionada correctamente.");
  };

  const handleParseLink = () => {
    const coordinates = parseGoogleMapsCoordinates(query);

    if (!coordinates) {
      setMessage(
        "No se reconoció una dirección ni coordenadas. Prueba con un nombre de lugar, un enlace de Google Maps o 13.4833,-88.1833."
      );
      return;
    }

    onChange(String(coordinates.latitude), String(coordinates.longitude));
    setResults([]);
    setMessage("Coordenadas seleccionadas correctamente.");
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
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-medium text-slate-800">{label} *</p>
        <p className="text-xs text-slate-500">
          Busca una dirección, haz clic en el mapa o arrastra el marcador para
          fijar la ubicación.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSearchAddress();
              }
            }}
            placeholder="Dirección, lugar o 13.4833,-88.1833"
            className="pl-9"
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleSearchAddress}
          disabled={isSearching}
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>

        <Button type="button" variant="outline" onClick={handleParseLink}>
          Usar coordenadas
        </Button>
      </div>

      {results.length > 0 ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {results.map((result) => (
            <li key={`${result.latitude},${result.longitude}`}>
              <button
                type="button"
                onClick={() => handleSelectResult(result)}
                className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="h-72 w-full overflow-hidden rounded-xl border border-slate-200">
        <LocationMap
          latitude={validLat}
          longitude={validLng}
          center={DEFAULT_MAP_CENTER}
          onPick={handlePickFromMap}
        />
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
        <div className="text-xs text-slate-600">
          <p>
            Coordenadas: {Number(latitude).toFixed(5)},{" "}
            {Number(longitude).toFixed(5)}
          </p>
          {address ? (
            <p className="mt-0.5 text-slate-500">≈ {address}</p>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Aún no has seleccionado ubicación.
        </p>
      )}

      {latitudeError || longitudeError ? (
        <p className="text-sm text-red-600">
          {latitudeError ?? longitudeError}
        </p>
      ) : null}

      {message ? (
        <p
          className={
            message.includes("correctamente") || message.includes("en el mapa")
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
