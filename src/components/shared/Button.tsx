'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { HouseButtonLoader } from '@/components/shared/HouseLoader'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-light)] hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:-translate-y-0.5 active:translate-y-0 tap-highlight',
      secondary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] hover:shadow-lg hover:shadow-[var(--accent)]/10 hover:-translate-y-0.5 active:translate-y-0 tap-highlight',
      outline: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm tap-highlight',
      ghost: 'hover:bg-[var(--primary)]/5 text-gray-600 hover:text-[var(--primary)] tap-highlight',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/10 hover:-translate-y-0.5 active:translate-y-0 tap-highlight',
    }

    const sizes = {
      sm: 'h-10 px-4 text-xs font-black uppercase tracking-[0.1em]',
      md: 'h-12 px-6 text-sm font-black uppercase tracking-[0.1em]',
      lg: 'h-14 px-8 text-sm font-black uppercase tracking-[0.1em]',
      xl: 'h-16 px-10 text-base font-black uppercase tracking-[0.1em]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <HouseButtonLoader />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
