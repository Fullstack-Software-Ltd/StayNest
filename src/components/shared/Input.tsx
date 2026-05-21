'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { Eye, EyeOff } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full bg-gray-50/50 border border-gray-100 rounded-2xl h-14 transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) outline-none',
              'px-5 text-sm font-semibold text-gray-900 placeholder:text-gray-400',
              'focus:border-[var(--primary)] focus:bg-white focus:shadow-xl focus:shadow-[var(--primary)]/5 focus:-translate-y-0.5',
              icon && 'pl-12',
              error && 'border-red-500 focus:border-red-500 bg-red-50/10',
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
        {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-400 ml-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
