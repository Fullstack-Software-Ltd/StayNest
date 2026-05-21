'use client'

import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

export type StatusType = 
  | 'pending' | 'approved' | 'rejected' | 'draft' 
  | 'confirmed' | 'cancelled' | 'completed' 
  | 'paid' | 'failed' | 'refunded' 
  | 'active' | 'inactive' | 'published'

interface StatusBadgeProps {
  status: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'subtle' | 'outline'
}

const statusConfig: Record<string, { color: string; icon?: string }> = {
  pending: { color: 'amber' },
  approved: { color: 'green' },
  confirmed: { color: 'emerald' },
  active: { color: 'emerald' },
  published: { color: 'emerald' },
  completed: { color: 'blue' },
  paid: { color: 'green' },
  rejected: { color: 'red' },
  cancelled: { color: 'red' },
  failed: { color: 'red' },
  draft: { color: 'gray' },
  inactive: { color: 'gray' },
  refunded: { color: 'purple' },
}

export function StatusBadge({ status, className, size = 'md', variant = 'subtle' }: StatusBadgeProps) {
  const { t } = useSettings()
  const lowerStatus = status.toLowerCase()
  const config = statusConfig[lowerStatus] ?? { color: 'gray' }
  const color = config.color

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-3 py-1',
    lg: 'text-[11px] px-4 py-1.5',
  }

  const variants = {
    solid: `bg-${color}-600 text-white border-transparent`,
    subtle: `bg-${color}-50 text-${color}-700 border-${color}-100`,
    outline: `bg-transparent text-${color}-700 border-${color}-200`,
  }

  // Handle custom branding for Primary/Accent if needed
  const brandingStyling = lowerStatus === 'confirmed' || lowerStatus === 'active' 
    ? 'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/10'
    : ''

  return (
    <span
      className={cn(
        'inline-flex items-center border font-black uppercase tracking-[0.15em] rounded-full transition-all duration-300',
        sizes[size],
        brandingStyling || variants[variant],
        className
      )}
    >
      <span className={cn(
        'w-1 h-1 rounded-full mr-1.5 animate-pulse',
        brandingStyling ? 'bg-[var(--primary)]' : `bg-${color}-500`
      )} />
      {t(`common.status.${lowerStatus}`) || status}
    </span>
  )
}
