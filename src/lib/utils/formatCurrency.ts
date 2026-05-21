/**
 * Format a number as currency (USD by default)
 * @example formatCurrency(1234.5) → "$1,234.50"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number as a compact currency
 * @example formatCurrencyCompact(1234500) → "$1.2M"
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount)
}
