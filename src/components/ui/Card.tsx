import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("mb-4 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-slate-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={cn("text-sm text-slate-500", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}