import type { Metadata } from "next";
import { DatabaseInitializer } from "@/components/layout/DatabaseInitializer";

import "./globals.css";

export const metadata: Metadata = {
  title: "GreenPulse",
  description: "Plataforma inteligente de reportes y monitoreo ambiental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <DatabaseInitializer />
      <body>{children}</body>
    </html>
  );
}