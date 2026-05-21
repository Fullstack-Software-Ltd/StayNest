'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Booking } from '@/types/booking'

export async function getOwnerBookings() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return []

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        property: {
          owner_id: userId
        }
      },
      include: {
        property: {
          select: {
            name: true,
            city: true,
            country: true,
          }
        },
        room: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            full_name: true,
            email: true,
            avatar_url: true
          }
        },
        payment: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return bookings.map(b => ({
      ...b,
      total_price: Number(b.total_price),
      check_in: b.check_in.toISOString(),
      check_out: b.check_out.toISOString(),
      created_at: b.created_at.toISOString(),
      updated_at: b.updated_at.toISOString(),
      guest: b.user, // Mapping Prisma's 'user' relation (Profile) to 'guest'
      payments: b.payment ? [b.payment] : [] // Mapping singular payment to array if needed for legacy compatibility
    })) as any
  } catch (error) {
    console.error('Error fetching owner bookings:', error)
    return []
  }
}

export async function getBookingByIdForOwner(bookingId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        room: true,
        user: true, // guest profile
        payment: true
      }
    })

    if (!booking) throw new Error('Booking not found')
    
    // Verify ownership
    if (booking.property.owner_id !== userId) {
      throw new Error('Unauthorized')
    }

    return {
      ...booking,
      total_price: Number(booking.total_price),
      check_in: booking.check_in.toISOString(),
      check_out: booking.check_out.toISOString(),
      created_at: booking.created_at.toISOString(),
      updated_at: booking.updated_at.toISOString(),
      guest: booking.user,
      payments: booking.payment ? [booking.payment] : []
    } as any
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch booking')
  }
}
