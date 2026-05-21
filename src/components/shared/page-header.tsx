'use client'

import { cn } from '@/utils/cn'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  action?: React.ReactNode
  className?: string
  centered?: boolean
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className, centered }: PageHeaderProps) {
  const { t } = useSettings()

  // Safely attempt translation. If it fails or returns the raw key without translation map, fall back to the original string.
  const tSafe = (str: string) => {
    if (!str) return str
    const translated = t(str)
    // t() typically returns the key if not found. We can't perfectly know if it found it, 
    // but if it returned the key but we wanted a translation, it falls back to the original string
    // In our implementation of `t`, if a key has '.' and isn't found, it might return the key.
    // If the input was 'Account Settings', it returns 'Account Settings'. 
    return translated || str
  }

  const displayTitle = title ? tSafe(title) : ''
  const displaySubtitle = subtitle ? tSafe(subtitle) : undefined

  return (
    <div className={cn('mb-10 sm:mb-14', centered && 'text-center flex flex-col items-center', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-5" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[10px] font-semibold text-gray-400 hover:text-[var(--primary)] uppercase tracking-[0.15em] transition-colors duration-200"
                >
                  {tSafe(crumb.label)}
                </Link>
              ) : (
                <span className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-[0.15em] opacity-60">
                  {tSafe(crumb.label)}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-300" />
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className={cn(
        'w-full flex flex-col gap-4',
        centered ? 'items-center' : 'sm:flex-row sm:items-end sm:justify-between'
      )}>
        <div className={cn('max-w-3xl', centered && 'text-center')}>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight text-balance leading-[1.15]">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-gray-500 font-medium mt-3 text-sm sm:text-base leading-relaxed text-balance">
              {displaySubtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
    </div>
  )
}
