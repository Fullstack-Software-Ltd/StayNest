'use server'

import { prisma } from '@/lib/prisma'

export async function getBookingInitialData(roomId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        property: {
          include: {
            owner: {
              select: {
                full_name: true,
                avatar_url: true,
                created_at: true
              }
            }
          }
        }
      }
    })

    if (!room) return null

    // Map to expected format
    return {
      room: {
        ...room,
        price_per_night: Number(room.price_per_night),
      },
      property: {
        ...room.property,
        daily_price: Number(room.property.daily_price),
        monthly_price: room.property.monthly_price ? Number(room.property.monthly_price) : null,
        latitude: room.property.latitude ? Number(room.property.latitude) : null,
        longitude: room.property.longitude ? Number(room.property.longitude) : null,
        host: room.property.owner
      }
    } as any
  } catch (error) {
    console.error('getBookingInitialData ERROR:', error)
    return null
  }
}
