'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Booking } from '@/types/booking'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function getUserBookings() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return []

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        user_id: userId
      },
      include: {
        property: {
          select: {
            name: true,
            city: true,
            country: true,
            main_image_url: true
          }
        },
        room: {
          select: {
            name: true
          }
        },
        payment: true,
        review: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return bookings.map(b => {
      const sanitized = sanitizePrismaObject(b)
      return {
        ...sanitized,
        payments: sanitized.payment ? [sanitized.payment] : [],
        reviews: sanitized.review ? [sanitized.review] : []
      }
    }) as any
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return []
  }
}

export async function getBookingById(id: string) {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return null

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            owner_id: true,
            name: true,
            city: true,
            country: true,
            main_image_url: true,
            address: true,
            type: true
          }
        },
        room: {
          select: {
            name: true,
            description: true,
            price_per_night: true,
            bed_type: true
          }
        },
        payment: true,
        review: {
          select: {
            id: true
          }
        }
      }
    })

    if (!booking) return null

    // Security Check: Only the guest (user_id) or the property owner can view this booking
    const isOwner = booking.property?.owner_id === userId
    const isGuest = booking.user_id === userId

    if (!isOwner && !isGuest) {
      console.warn(`Unauthorized booking access attempt by user ${userId} on booking ${id}`)
      return null
    }

    const sanitized = sanitizePrismaObject(booking)
    return {
      ...sanitized,
      payments: sanitized.payment ? [sanitized.payment] : [],
      reviews: sanitized.review ? [sanitized.review] : []
    } as any
  } catch (error) {
    console.error('Error fetching booking by id:', error)
    return null
  }
}
