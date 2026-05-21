'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { isAdmin } from '@/lib/auth/access'

export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  const isSystemAdmin = await isAdmin()

  try {
    // 1. Fetch current status and property ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          select: { owner_id: true, name: true }
        }
      }
    })

    if (!booking) throw new Error('Booking not found')
    
    // 2. Authorization Check
    const isOwner = booking.property?.owner_id === userId
    
    if (!isOwner && !isSystemAdmin) {
      throw new Error('Unauthorized to update this booking status')
    }

    // 3. Status Transition Logic (Hardening)
    const currentStatus = booking.status
    const allowedTransitions: Record<string, string[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['completed', 'cancelled'],
      'completed': [], // Terminal state
      'cancelled': []  // Terminal state
    }

    if (!allowedTransitions[currentStatus]?.includes(status) && !isSystemAdmin) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${status}`)
    }

    // 4. Update status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status,
        updated_at: new Date()
      }
    })

    // 5. Notifications
    try {
      await createNotification({
        user_id: booking.user_id, // Always notify the guest
        type: 'booking_status_updated' as any,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `The host has updated your booking for ${booking.property?.name} to ${status}.`,
        link: `/bookings`
      })
    } catch (notifErr) {
      console.error('[NOTIFICATION ERROR] Flow continued but guest was not notified:', notifErr)
    }

    // 6. Robust Cache Revalidation
    revalidatePath('/bookings')
    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/owner/reservations')
    revalidatePath(`/owner/reservations/${bookingId}`)
    revalidatePath('/owner/dashboard')
  } catch (error: any) {
    console.error(`[STATUS UPDATE ERROR] Failed for booking ${bookingId}:`, error)
    throw new Error(error.message || 'Failed to update booking status')
  }
}
