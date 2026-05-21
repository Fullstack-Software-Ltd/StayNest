'use server'

import { prisma } from '@/lib/prisma'
import { CreatePaymentInput, Payment } from '@/types/payment'
import { revalidatePath } from 'next/cache'
import { verifyOwnership } from '@/lib/auth/access'

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  // 1. Verify Ownership of the booking
  const { authorized, userId, error: authError } = await verifyOwnership('bookings', input.booking_id, 'user_id')
  if (!authorized) throw new Error(authError || 'Unauthorized to pay for this booking')

  try {
    // 2. Prevent Duplicate Payment (Edge Case: double-click, refresh)
    const existingPayment = await prisma.payment.findFirst({
      where: {
        booking_id: input.booking_id,
        status: { in: ['paid', 'pending'] }
      }
    })

    if (existingPayment) {
      throw new Error('A payment for this booking is already being processed or has been completed.')
    }

    // 3. Execution
    const transactionReference = input.transaction_reference || `PAY-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

    const payment = await prisma.payment.create({
      data: {
        booking_id: input.booking_id,
        user_id: userId!,
        amount: input.amount,
        currency: input.currency || 'USD',
        method: input.method,
        status: input.method === 'pay_at_property' ? 'pending' : 'paid',
        transaction_reference: transactionReference
      }
    })

    revalidatePath(`/payments/success/${payment.id}`)
    revalidatePath(`/bookings/${input.booking_id}`)
    
    return {
      ...payment,
      amount: Number(payment.amount)
    } as any
  } catch (error: any) {
    console.error('CREATE PAYMENT ERROR:', error)
    throw new Error(error.message || 'Failed to record payment. Please contact support if the charge occurred.')
  }
}
