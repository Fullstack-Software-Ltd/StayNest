'use client'

import { cn } from '@/utils/cn'

interface OwnerBookingStatusBadgeProps {
  status: string
  className?: string
}

export function OwnerBookingStatusBadge({ status, className }: OwnerBookingStatusBadgeProps) {
  const statusConfig: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/20',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    completed: 'bg-green-50 text-green-700 border-green-200'
  }

  const styling = statusConfig[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
      styling,
      className
    )}>
      {status}
    </span>
  )
}
