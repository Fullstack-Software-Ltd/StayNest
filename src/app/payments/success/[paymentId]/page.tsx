import { notFound, redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth/requireRole'
import { getPaymentById } from '@/lib/payments/getPaymentById'
import { PaymentSuccessCard } from '@/components/payments/payment-success-card'
import { prisma } from '@/lib/prisma'

export default async function PaymentSuccessPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params
  const { user } = await requireRole(['guest', 'owner', 'admin'])

  const payment = await getPaymentById(paymentId)
  if (!payment) {
    notFound()
  }

  // Security: Ensure user owns this payment
  if (payment.user_id !== user.id) {
    redirect('/unauthorized')
  }

  // Fetch full booking details for the success card
  const booking = await prisma.booking.findUnique({
    where: { id: payment.booking_id },
    include: {
      property: true,
      room: true
    }
  })

  if (!booking) {
    notFound()
  }

  const mappedBooking = {
    ...booking,
    total_price: Number(booking.total_price),
    property: {
      ...booking.property,
      daily_price: Number(booking.property.daily_price),
      monthly_price: booking.property.monthly_price ? Number(booking.property.monthly_price) : null
    },
    room: {
      ...booking.room,
      price_per_night: Number(booking.room.price_per_night)
    }
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaymentSuccessCard 
          payment={payment} 
          booking={mappedBooking as any} 
        />
      </div>
    </div>
  )
}
