// Geocodificación con Nominatim (OpenStreetMap), del lado del cliente.
// Nota: Nominatim pide un uso respetuoso (máx. ~1 petición/seg). Por eso en la UI
// se usa con "debounce" y solo cuando el usuario escribe una dirección.

export interface GeocodeResult {
  label: string;
  latitude: number;
  longitude: number;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export async function searchAddress(
  query: string,
  limit = 5
): Promise<GeocodeResult[]> {
  const q = query.trim();

  if (!q) {
    return [];
  }

  const url = `${NOMINATIM_BASE}/search?format=json&addressdetails=0&limit=${limit}&q=${encodeURIComponent(
    q
  )}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("No se pudo buscar la dirección.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => ({
      label: String((item as { display_name?: string }).display_name ?? ""),
      latitude: Number((item as { lat?: string }).lat),
      longitude: Number((item as { lon?: string }).lon),
    }))
    .filter(
      (result) =>
        result.label !== "" &&
        Number.isFinite(result.latitude) &&
        Number.isFinite(result.longitude)
    );
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    const label = (data as { display_name?: string }).display_name;

    return typeof label === "string" ? label : null;
  } catch {
    return null;
  }
}
