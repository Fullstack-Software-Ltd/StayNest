'use server'

import { prisma } from '@/lib/prisma'
import { PaymentStatus } from '@/types/payment'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth/access'
import { createNotification } from '@/lib/notifications/createNotification'

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionReference?: string) {
  // 1. Security Check: Only admins can manually update payment status via this action
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required to update payment records.')

  try {
    // 2. Execution
    const updateData: any = { 
      status,
      updated_at: new Date()
    }
    
    if (transactionReference) {
      updateData.transaction_reference = transactionReference
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData,
      include: {
        booking: {
          include: {
            property: {
              select: {
                owner_id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // 3. Notifications and Revalidation
    if (status === 'paid') {
       await createNotification({
         user_id: payment.user_id,
         title: 'Payment Successful!',
         message: `Your payment of $${payment.amount} has been processed successfully.`,
         type: 'payment'
       })

       if (payment.booking?.property?.owner_id) {
          await createNotification({
            user_id: payment.booking.property.owner_id,
            title: 'Payment Received!',
            message: `You received a payment of $${payment.amount} for ${payment.booking.property.name}.`,
            type: 'payment'
          })
       }
    }

    revalidatePath(`/payments/success/${paymentId}`)
    revalidatePath(`/bookings/${payment.booking_id}`)
    revalidatePath('/owner/dashboard')
    revalidatePath('/admin/dashboard')

    return payment
  } catch (error) {
    console.error('UPDATE PAYMENT STATUS ERROR:', error)
    throw new Error('Failed to update payment status')
  }
}
