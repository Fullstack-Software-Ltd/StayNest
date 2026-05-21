import { prisma } from '@/lib/prisma'
import { Room } from '@/types/room'

export async function getPropertyRooms(propertyId: string) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        property_id: propertyId
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return rooms.map(room => ({
      ...room,
      price_per_night: Number(room.price_per_night),
    })) as any
  } catch (error) {
    console.error('Error fetching property rooms:', error)
    return []
  }
}
