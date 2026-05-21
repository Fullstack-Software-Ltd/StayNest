'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'flat' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive = false,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    outline: 'bg-transparent border-2 border-gray-200/60',
    flat: 'bg-gray-50/50 border-transparent',
    glass: 'glass border-white/50',
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
    xl: 'p-12 sm:p-16',
  }

  return (
    <div
      className={cn(
        'rounded-3xl transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1)',
        variants[variant],
        paddings[padding],
        interactive && 'cursor-pointer hover:shadow-lg hover:shadow-[var(--primary)]/5 hover:-translate-y-1 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, icon, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)} {...props}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          {title && (
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-none">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 pt-5 border-t border-gray-100', className)} {...props}>
      {children}
    </div>
  )
}
