import { prisma } from '@/lib/prisma'
import { getUser } from './getUser'

/**
 * Verifies if the current authenticated user owns a specific record in a table.
 * Standardizes ownership checks across all Server Actions.
 */
export async function verifyOwnership(table: string, id: string, ownerField: string = 'owner_id') {
  const user = await getUser()
  if (!user) throw new Error('Authentication required')

  try {
    // Dynamic table access is not type-safe in Prisma but can be done via prisma[table]
    // However, for security, we explicitly list allowed tables or use a switch.
    let record: any = null
    if (table === 'properties') {
      record = await prisma.property.findUnique({ where: { id }, select: { [ownerField]: true } as any })
    } else if (table === 'bookings') {
      record = await prisma.booking.findUnique({ where: { id }, select: { [ownerField]: true } as any })
    }

    if (!record) return { authorized: false, error: 'Record not found' }
    
    const isOwner = record[ownerField] === user.id
    if (!isOwner) return { authorized: false, error: 'Access denied' }

    return { authorized: true, userId: user.id }
  } catch (error) {
    return { authorized: false, error: 'Authorization check failed' }
  }
}

/**
 * Special check for rooms, as they are owned via their parent property.
 */
export async function verifyRoomOwnership(roomId: string) {
  const user = await getUser()
  if (!user) throw new Error('Authentication required')

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        property: {
          select: {
            owner_id: true
          }
        }
      }
    })

    if (!room) return { authorized: false, error: 'Room not found' }
    
    const isOwner = room.property?.owner_id === user.id
    if (!isOwner) return { authorized: false, error: 'Access denied' }

    return { authorized: true, userId: user.id }
  } catch (error) {
    return { authorized: false, error: 'Room authorization check failed' }
  }
}

/**
 * Checks if the user is an admin.
 */
export async function isAdmin() {
  const user = await getUser()
  
  if (!user) {
    return false
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    return profile?.role === 'admin'
  } catch (error) {
    console.error('[isAdmin] Error:', error)
    return false
  }
}
