import type { Metadata } from "next";

import { DatabaseInitializer } from "@/components/layout/DatabaseInitializer";
import { AuthProvider } from "@/store";

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
      <body>
        <DatabaseInitializer />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
