'use client'

import { cn } from '@/utils/cn'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  centered?: boolean
}

export function SectionHeader({
  label,
  title,
  subtitle,
  action,
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-8 sm:mb-12',
      centered && 'text-center flex flex-col items-center',
      className
    )}>
      {label && (
        <span className="inline-block text-[10px] sm:text-xs font-black text-[var(--luxury-gold)] uppercase tracking-[0.3em] mb-4 sm:mb-6">
          {label}
        </span>
      )}
      
      <div className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center' : 'sm:flex-row sm:items-end sm:justify-between'
      )}>
        <div className={cn('max-w-3xl', centered && 'text-center')}>
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[var(--luxury-green)] leading-[0.9] tracking-tight text-balance"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 font-medium text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed text-balance">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
