import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}

      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          "placeholder:text-slate-400",
          "focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}