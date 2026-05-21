import { differenceInDays, parseISO } from 'date-fns'

export interface PriceBreakdown {
  nights: number
  subtotal: number
  serviceFee: number
  tax: number
  total: number
}

export const SERVICE_FEE_PERCENT = 0.05 // 5%
export const TAX_PERCENT = 0.18 // 18% VAT

export function calculateBookingTotal(pricePerNight: number, checkIn: string | Date, checkOut: string | Date): PriceBreakdown {
  if (!checkIn || !checkOut) {
    return { nights: 0, subtotal: 0, serviceFee: 0, tax: 0, total: 0 }
  }
  
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
  const nights = Math.max(0, differenceInDays(end, start))
  
  const subtotal = nights * pricePerNight
  const serviceFee = subtotal * SERVICE_FEE_PERCENT
  const tax = (subtotal + serviceFee) * TAX_PERCENT
  const total = subtotal + serviceFee + tax
  
  return {
    nights,
    subtotal,
    serviceFee: Math.round(serviceFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export function getNightsCount(checkIn: string | Date, checkOut: string | Date): number {
  if (!checkIn || !checkOut) return 0
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
  return Math.max(0, differenceInDays(end, start))
}
