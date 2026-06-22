export interface ParsedMapCoordinates {
  latitude: number;
  longitude: number;
}

function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function createCoordinates(latitudeText: string, longitudeText: string) {
  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);

  if (!isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

export function parseGoogleMapsCoordinates(
  value: string
): ParsedMapCoordinates | null {
  const text = value.trim();

  if (!text) {
    return null;
  }

  const directCoordinates = text.match(
    /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
  );

  if (directCoordinates) {
    return createCoordinates(directCoordinates[1], directCoordinates[2]);
  }

  const atCoordinates = text.match(
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
  );

  if (atCoordinates) {
    return createCoordinates(atCoordinates[1], atCoordinates[2]);
  }

  const dataCoordinates = text.match(
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/
  );

  if (dataCoordinates) {
    return createCoordinates(dataCoordinates[1], dataCoordinates[2]);
  }

  try {
    const url = new URL(text);
    const query = url.searchParams.get("q") ?? url.searchParams.get("query");

    if (query) {
      return parseGoogleMapsCoordinates(query);
    }
  } catch {
    return null;
  }

  return null;
}

export function createGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
