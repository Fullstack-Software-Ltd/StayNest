'use client'

import { useSettings } from '@/context/SettingsContext'

interface FormattedPriceProps {
  amount: number
  className?: string
}

export function FormattedPrice({ amount, className = "" }: FormattedPriceProps) {
  const { formatPrice } = useSettings()
  
  return (
    <span className={className}>
      {formatPrice(amount)}
    </span>
  )
}
