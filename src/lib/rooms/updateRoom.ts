'use server'

import { prisma } from '@/lib/prisma'
import { UpdateRoomInput } from '@/types/room'
import { roomSchema } from '@/lib/validation'
import { verifyRoomOwnership } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function updateRoom(id: string, input: UpdateRoomInput) {
  // 1. Ownership Check
  const { authorized, error: authError } = await verifyRoomOwnership(id)
  if (!authorized) throw new Error(authError || 'Unauthorized to update this room')

  // 2. Validation (Partial Zod)
  const validation = roomSchema.partial().safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 3. Business Logic
  if (input.images !== undefined && input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  try {
    // 4. Execution
    const room = await prisma.room.update({
      where: { id },
      data: input
    })

    revalidatePath(`/owner/properties/${room.property_id}/edit`)
    revalidatePath(`/properties/${room.property_id}`)
    
    return sanitizePrismaObject(room)
  } catch (error) {
    console.error('UPDATE ROOM ERROR:', error)
    throw new Error('Failed to update room listing')
  }
}
