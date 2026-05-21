'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              'w-full bg-[var(--warm-gray)]/30 border-2 border-[var(--warm-gray)] rounded-2xl h-14 transition-all duration-250 outline-none appearance-none',
              'px-5 text-sm font-bold text-gray-900',
              'focus:border-[var(--primary)] focus:bg-white focus:shadow-xl focus:shadow-[var(--primary)]/5',
              icon && 'pl-12',
              error && 'border-red-500 bg-red-50/10',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[var(--primary)] transition-colors">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
