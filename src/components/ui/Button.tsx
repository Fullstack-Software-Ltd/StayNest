import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
        primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-xl shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 active:scale-[0.98] transition-all",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/10",
        outline:
          "border-2 border-[var(--primary)]/10 bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/20",
        secondary:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] shadow-lg shadow-[var(--accent)]/10",
        ghost: "hover:bg-[var(--warm-gray)]/50 text-gray-600 hover:text-[var(--primary)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline font-black",
    }

    const sizes = {
      sm: "px-3 py-1 text-[11px]",
      md: "px-4 py-1.5 text-xs",
      lg: "px-5 py-2.5 text-sm font-semibold",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
