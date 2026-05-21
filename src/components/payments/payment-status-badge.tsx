import { PaymentStatus } from '@/types/payment'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      classes: 'bg-yellow-50 text-yellow-700 border-yellow-100'
    },
    paid: {
      label: 'Paid',
      classes: 'bg-green-50 text-green-700 border-green-100'
    },
    failed: {
      label: 'Failed',
      classes: 'bg-red-50 text-red-700 border-red-100'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={twMerge(
      'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
      config.classes,
      className
    )}>
      {config.label}
    </span>
  )
}
