"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  center: { lat: number; lng: number };
  onPick: (latitude: number, longitude: number) => void;
}

// Pin con divIcon para evitar el problema de los iconos por defecto de Leaflet
// con los bundlers (mismo enfoque que EnvironmentalMap).
const pinIcon = L.divIcon({
  className: "greenpulse-location-pin",
  html: `<span style="display:block;width:20px;height:20px;border-radius:9999px;background:#16a34a;border:3px solid #ffffff;box-shadow:0 0 0 1.5px rgba(15,23,42,0.3)"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Captura los clics en el mapa y reporta la coordenada elegida.
function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

// Recentra el mapa cuando las coordenadas cambian desde fuera
// (por ejemplo, al usar "mi ubicación" o pegar un enlace).
function Recenter({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], Math.max(map.getZoom(), 15));
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationMap({
  latitude,
  longitude,
  center,
  onPick,
}: LocationMapProps) {
  const hasMarker = latitude !== null && longitude !== null;

  const initialCenter: [number, number] = hasMarker
    ? [latitude as number, longitude as number]
    : [center.lat, center.lng];

  return (
    <MapContainer
      center={initialCenter}
      zoom={hasMarker ? 15 : 13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onPick={onPick} />

      {hasMarker ? (
        <Marker
          position={[latitude as number, longitude as number]}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target as L.Marker;
              const position = marker.getLatLng();
              onPick(position.lat, position.lng);
            },
          }}
        />
      ) : null}

      <Recenter latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
}
