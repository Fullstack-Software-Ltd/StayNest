import * as React from "react"
import { cn } from "@/utils/cn"
import { LucideIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
}

import { Eye, EyeOff } from "lucide-react"

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon: Icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[var(--primary)]">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex w-full rounded-2xl border-none bg-[var(--warm-gray)] px-4 py-3.5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all disabled:opacity-50",
              Icon && "pl-11",
              isPassword && "pr-12",
              error && "ring-2 ring-red-300",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary)] transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1 animate-fade-in">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
