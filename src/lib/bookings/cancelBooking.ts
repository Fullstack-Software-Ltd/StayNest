'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { verifyOwnership } from '@/lib/auth/access'

export async function cancelBooking(bookingId: string) {
  // 1. Verify Ownership
  const { authorized, userId, error: authError } = await verifyOwnership('bookings', bookingId, 'user_id')
  if (!authorized) throw new Error(authError || 'Unauthorized')

  try {
    // 2. Fetch specific fields for status check and notifications
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        status: true,
        property: {
          select: {
            owner_id: true,
            name: true
          }
        }
      }
    })

    if (!booking) throw new Error('Booking could not be verified')
    
    // 3. Strict Status Transition (Edge Case: double cancellation, completed stay)
    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new Error(`Cannot cancel a booking that is currently ${booking.status}`)
    }

    // 4. Update status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    })

    // 5. Notifications
    const propertyName = booking.property?.name
    const ownerId = booking.property?.owner_id

    await createNotification({
      user_id: userId as string,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `You have successfully cancelled your booking for ${propertyName || 'your stay'}.`,
      link: `/bookings/${bookingId}`
    })

    if (ownerId) {
      await createNotification({
        user_id: ownerId,
        type: 'booking_cancelled',
        title: 'Booking Cancelled by Guest',
        message: `A guest has cancelled their booking for ${propertyName}.`,
        link: `/owner/reservations/${bookingId}`
      })
    }

    revalidatePath('/bookings')
    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/owner/reservations')
  } catch (error: any) {
    console.error('CANCEL BOOKING ERROR:', error)
    throw new Error(error.message || 'Failed to cancel booking')
  }
}
