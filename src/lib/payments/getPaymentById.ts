'use server'

import { prisma } from '@/lib/prisma'
import { Payment } from '@/types/payment'

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    })

    if (!payment) return null

    return {
      ...payment,
      amount: Number(payment.amount)
    } as any
  } catch (error: any) {
    console.error('GET PAYMENT ERROR:', error.message || error)
    return null
  }
}
