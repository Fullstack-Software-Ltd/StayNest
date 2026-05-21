'use server'

import { prisma } from '@/lib/prisma'
import { verifyOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function deleteProperty(id: string) {
  // 1. Verify Ownership (or Admin)
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyOwnership('properties', id, 'owner_id')
  
  if (!authorized && !isSystemAdmin) {
    throw new Error(authError || 'Unauthorized to delete this property')
  }

  try {
    // 2. Prevent deletion if there are active bookings
    const activeBookingsCount = await prisma.booking.count({
      where: {
        property_id: id,
        status: { in: ['confirmed', 'pending'] }
      }
    })

    if (activeBookingsCount > 0) {
      throw new Error('Cannot delete a property with active or pending bookings. Please cancel them first.')
    }

    // 3. Delete
    await prisma.property.delete({
      where: { id }
    })

    revalidatePath('/owner/properties')
    return true
  } catch (error: any) {
    console.error('DELETE PROPERTY ERROR:', error)
    throw new Error(error.message || 'Failed to delete property listing')
  }
}
