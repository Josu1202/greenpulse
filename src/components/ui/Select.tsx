import type { SelectHTMLAttributes } from "react";

import { cn } from "@/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900",
          "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}