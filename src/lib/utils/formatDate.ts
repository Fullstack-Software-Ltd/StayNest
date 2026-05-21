import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

/**
 * Format a date string as "March 26, 2026"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return format(d, 'MMMM d, yyyy')
}

/**
 * Format a date as "Mar 26, 2026"
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Invalid date'
  return format(d, 'MMM d, yyyy')
}

/**
 * Format a date as "2026-03-26"
 */
export function formatDateISO(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return format(d, 'yyyy-MM-dd')
}

/**
 * Returns relative time like "3 days ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

/**
 * Calculate duration in nights between two dates
 */
export function getNights(checkIn: string, checkOut: string): number {
  const a = parseISO(checkIn)
  const b = parseISO(checkOut)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}
/**
 * Format a date range like "Mar 26 - Mar 29"
 */
export function formatDateRange(start: string | Date, end: string | Date): string {
  const dStart = typeof start === 'string' ? parseISO(start) : start
  const dEnd = typeof end === 'string' ? parseISO(end) : end
  if (!isValid(dStart) || !isValid(dEnd)) return 'Invalid dates'
  return `${format(dStart, 'MMM d')} - ${format(dEnd, 'MMM d')}`
}
