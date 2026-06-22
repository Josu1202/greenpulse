"use client";

import { useState } from "react";
import { Crosshair, Layers, Locate, Search } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { searchAddress, type GeocodeResult } from "@/utils/geocoding";
import type { MapBaseLayer, MapViewMode } from "./EnvironmentalMap";

interface MapControlsProps {
  viewMode: MapViewMode;
  baseLayer: MapBaseLayer;
  onViewModeChange: (mode: MapViewMode) => void;
  onBaseLayerChange: (layer: MapBaseLayer) => void;
  onFocus: (coords: { lat: number; lng: number }) => void;
  onRecenter: () => void;
}

export function MapControls({
  viewMode,
  baseLayer,
  onViewModeChange,
  onBaseLayerChange,
  onFocus,
  onRecenter,
}: MapControlsProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setIsSearching(true);
      setMessage(null);
      const encontrados = await searchAddress(query);
      setResults(encontrados);
      if (encontrados.length === 0) {
        setMessage("Sin resultados para esa dirección.");
      }
    } catch {
      setMessage("No se pudo buscar la dirección.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: GeocodeResult) => {
    onFocus({ lat: result.latitude, lng: result.longitude });
    setResults([]);
    setQuery(result.label);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Tu navegador no permite obtener la ubicación.");
      return;
    }

    setIsLocating(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onFocus({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setMessage("No se pudo obtener tu ubicación.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSearch();
                  }
                }}
                placeholder="Buscar una dirección o lugar..."
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "..." : "Buscar"}
            </Button>
          </div>

          {results.length > 0 ? (
            <ul className="absolute z-[1000] mt-1 w-full divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {results.map((result) => (
                <li key={`${result.latitude},${result.longitude}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMyLocation}
            disabled={isLocating}
            className="gap-1.5"
          >
            <Locate className="h-4 w-4" />
            {isLocating ? "..." : "Mi ubicación"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRecenter}
            className="gap-1.5"
          >
            <Crosshair className="h-4 w-4" />
            Centrar
          </Button>

          <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => onViewModeChange("markers")}
              className={`px-3 py-1.5 text-sm ${
                viewMode === "markers"
                  ? "bg-green-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Marcadores
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("heat")}
              className={`px-3 py-1.5 text-sm ${
                viewMode === "heat"
                  ? "bg-green-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Zonas críticas
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onBaseLayerChange(baseLayer === "map" ? "satellite" : "map")
            }
            className="gap-1.5"
          >
            <Layers className="h-4 w-4" />
            {baseLayer === "map" ? "Satélite" : "Mapa"}
          </Button>
        </div>
      </div>

      {message ? <p className="text-xs text-red-600">{message}</p> : null}
    </div>
  );
}
