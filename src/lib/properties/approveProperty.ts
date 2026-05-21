'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth/access'
import { createNotification } from '@/lib/notifications/createNotification'

export async function approveProperty(propertyId: string) {
  // 1. Security check: Only admins can approve
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    // 2. Fetch owner info for notification
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { owner_id: true, name: true }
    })

    if (!property) throw new Error('Property not found')

    // 3. Update status
    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'approved' }
    })

    // 4. Notify Owner
    if (property.owner_id) {
      await createNotification({
        user_id: property.owner_id,
        title: 'Listing Approved!',
        message: `Your property "${property.name}" has been approved and is now live on StayNest.`,
        type: 'property_approved' as any,
        link: `/properties/${propertyId}`
      })
    }
    
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/owner/properties')
    revalidatePath('/admin/properties')
    revalidatePath('/')
    revalidatePath('/search')
    return { success: true }
  } catch (error: any) {
    console.error('APPROVE PROPERTY ERROR:', error)
    throw new Error(error.message || 'Failed to approve property')
  }
}
