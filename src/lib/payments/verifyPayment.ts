'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { stripe } from './stripe'
import { revalidatePath } from 'next/cache'

export async function verifyPayment(sessionId: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('Unauthorized')

  try {
    // Stripe Verification (Retrieve Session)
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (stripeSession.payment_status === 'paid' && stripeSession.metadata?.booking_id) {
        const bookingId = stripeSession.metadata.booking_id

        // Update Payment and Booking status in a transaction
        await prisma.$transaction([
          prisma.payment.update({
            where: { booking_id: bookingId },
            data: {
              status: 'paid',
              transaction_reference: stripeSession.payment_intent as string || sessionId,
            }
          }),
          prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'confirmed' }
          })
        ])

        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
            property: {
              include: {
                owner: { select: { phone: true } }
              }
            }
          }
        })

        revalidatePath(`/bookings/${bookingId}`)
        revalidatePath('/bookings')

        return { 
          success: true, 
          bookingId, 
          hostPhone: booking?.property?.owner?.phone 
        }
    }

    return { success: false, status: stripeSession.payment_status }
  } catch (error: any) {
    console.error('STRIPE_VERIFY_ERROR:', error)
    throw new Error(error.message || 'Verification process failed')
  }
}
