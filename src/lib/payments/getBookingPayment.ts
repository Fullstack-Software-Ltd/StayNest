'use server'

import { prisma } from '@/lib/prisma'
import { Payment } from '@/types/payment'

export async function getBookingPayment(bookingId: string): Promise<Payment | null> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { booking_id: bookingId }
    })

    if (!payment) return null

    return {
      ...payment,
      amount: Number(payment.amount)
    } as any
  } catch (error: any) {
    console.error('GET BOOKING PAYMENT ERROR:', error.message || error)
    return null
  }
}
