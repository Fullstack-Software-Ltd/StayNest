'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { stripe } from './stripe'

interface CheckoutSessionInput {
  bookingId: string
  amount: number
  currency: string
  customerName: string
  customerEmail: string
}

export async function createCheckoutSession(input: CheckoutSessionInput) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('Unauthorized')

  // Verify booking belongs to user
  const booking = await prisma.booking.findUnique({
    where: {
      id: input.bookingId,
      user_id: userId
    },
    include: {
      property: {
        select: { name: true }
      }
    }
  })

  if (!booking) {
    throw new Error('Booking not found or access denied')
  }

  try {
    // Stripe Checkout Session Creation
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: input.currency.toLowerCase(),
            product_data: {
              name: `Booking at ${booking.property?.name}`,
            },
            unit_amount: Math.round(input.amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/checkout/${booking.id}`,
      customer_email: input.customerEmail,
      metadata: {
        booking_id: booking.id,
      },
    })

    // Update payment record with Stripe session_id for later verification
    await prisma.payment.update({
      where: { booking_id: booking.id },
      data: {
        checkout_session_id: stripeSession.id,
        gateway_provider: 'stripe',
      }
    })

    return { url: stripeSession.url }
  } catch (error: any) {
    console.error('STRIPE_INIT_ERROR:', error)
    throw new Error(error.message || 'Failed to initialize payment gateway')
  }
}
