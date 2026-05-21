import { prisma } from '@/lib/prisma'
import { Room } from '@/types/room'

export async function getRoomById(roomId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId
      }
    })

    if (!room) return null

    return {
      ...room,
      price_per_night: Number(room.price_per_night)
    } as any
  } catch (error) {
    console.error('Error fetching room by id:', error)
    return null
  }
}
