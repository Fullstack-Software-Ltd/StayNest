'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function getCheckoutData(bookingId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          select: { name: true, main_image_url: true, city: true, country: true }
        },
        room: {
          select: { name: true }
        },
        user: {
          select: {
            full_name: true,
            email: true
          }
        },
        payment: true
      }
    })

    if (!booking) return null

    const sanitized = sanitizePrismaObject(booking)
    const b = sanitized as any

    return {
      ...b,
      payments: b.payment ? [b.payment] : []
    } as any
  } catch (error) {
    console.error('getCheckoutData ERROR:', error)
    return null
  }
}
