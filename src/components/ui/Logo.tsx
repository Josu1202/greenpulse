import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/utils";
import { APP_NAME } from "@/utils/constants";

type LogoSize = "sm" | "md" | "lg";
type LogoTone = "dark" | "light";

interface LogoProps {
  /** Tamaño del ícono y del texto. */
  size?: LogoSize;
  /**
   * Tono del texto según el fondo:
   * - "dark": texto oscuro (para fondos claros, ej. navbar).
   * - "light": texto blanco (para fondos oscuros, ej. sidebar verde).
   */
  tone?: LogoTone;
  /** Muestra el nombre "GreenPulse" junto al ícono. */
  withText?: boolean;
  /** Texto secundario opcional debajo del nombre (ej. "Monitoreo ambiental"). */
  subtitle?: ReactNode;
  /**
   * Envuelve el ícono en un recuadro blanco para dar contraste.
   * Por defecto se activa cuando tone = "light" (fondos oscuros).
   */
  badge?: boolean;
  className?: string;
}

const iconSizes: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 44,
};

const titleSizes: Record<LogoSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export function Logo({
  size = "md",
  tone = "dark",
  withText = true,
  subtitle,
  badge,
  className,
}: LogoProps) {
  const iconSize = iconSizes[size];
  const showBadge = badge ?? tone === "light";
  const titleColor = tone === "light" ? "text-white" : "text-slate-900";
  const subtitleColor = tone === "light" ? "text-white/70" : "text-slate-500";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          showBadge && "rounded-xl bg-white p-1.5 shadow-sm"
        )}
      >
        <Image
          src="/logo.png"
          alt={`Logo de ${APP_NAME}`}
          width={iconSize}
          height={iconSize}
          priority
          className="object-contain"
        />
      </span>

      {withText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-bold tracking-tight",
              titleSizes[size],
              titleColor
            )}
          >
            {APP_NAME}
          </span>

          {subtitle ? (
            <span className={cn("mt-1 text-xs font-medium", subtitleColor)}>
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}