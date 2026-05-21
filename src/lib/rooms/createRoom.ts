'use server'

import { prisma } from '@/lib/prisma'
import { CreateRoomInput } from '@/types/room'
import { roomSchema } from '@/lib/validation'
import { verifyOwnership } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function createRoom(input: CreateRoomInput) {
  // 1. Ownership Check: Verify user owns the property this room belongs to
  const { authorized, error: authError } = await verifyOwnership('properties', input.property_id, 'owner_id')
  if (!authorized) throw new Error(authError || 'Unauthorized to add rooms to this property')

  // 2. Validation (Zod)
  const validation = roomSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 3. Business Logic
  if (!input.images || input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  try {
    // 4. Execution
    const room = await prisma.room.create({
      data: input
    })

    revalidatePath(`/owner/properties/${input.property_id}/edit`)
    revalidatePath(`/properties/${input.property_id}`)
    
    return room
  } catch (error) {
    console.error('CREATE ROOM ERROR:', error)
    throw new Error('Failed to create room listing')
  }
}
