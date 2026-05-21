import * as React from "react"
import { cn } from "@/utils/cn"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "flex min-h-[120px] w-full rounded-2xl border-none bg-[var(--warm-gray)] px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all disabled:opacity-50 resize-none",
              error && "ring-2 ring-red-300",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
