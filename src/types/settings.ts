export interface MapCenter {
  lat: number;
  lng: number;
}

export interface AppSettings {
  id: string;
  theme: "light" | "dark";
  defaultMapCenter: MapCenter;
  seedLoaded: boolean;
}