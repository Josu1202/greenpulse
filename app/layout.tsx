import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}