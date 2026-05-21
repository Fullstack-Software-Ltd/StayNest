'use server'

import { prisma } from '@/lib/prisma'
import { verifyRoomOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function deleteRoom(roomId: string) {
  // 1. Ownership Check
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyRoomOwnership(roomId)
  if (!authorized && !isSystemAdmin) throw new Error(authError || 'Unauthorized to delete this room')

  try {
    // 2. Fetch parent property for revalidation
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { property_id: true }
    })

    if (!room) throw new Error('Room not found')

    // 3. Prevent deletion if there are active bookings for this room
    const activeBookingsCount = await prisma.booking.count({
      where: {
        room_id: roomId,
        status: { in: ['confirmed', 'pending'] }
      }
    })

    if (activeBookingsCount > 0) {
      throw new Error('Cannot delete a room with active or pending bookings. Please reconcile bookings first.')
    }

    // 4. Delete
    await prisma.room.delete({
      where: { id: roomId }
    })

    revalidatePath(`/owner/properties/${room.property_id}/edit`)
    revalidatePath(`/properties/${room.property_id}`)
    
    return true
  } catch (error: any) {
    console.error('DELETE ROOM ERROR:', error)
    throw new Error(error.message || 'Failed to delete room listing')
  }
}
