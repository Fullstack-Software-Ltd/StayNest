'use server'

import { prisma } from '@/lib/prisma'
import { UpdatePropertyInput } from '@/types/property'
import { propertySchema } from '@/lib/validation'
import { verifyOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'
import { notifyAdmins } from '../notifications/notifyAdmins'

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  // 1. Verify Ownership (or Admin)
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyOwnership('properties', id, 'owner_id')
  
  if (!authorized && !isSystemAdmin) {
    throw new Error(authError || 'Unauthorized to update this property')
  }

  // 2. Fetch current state
  const currentProperty = await prisma.property.findUnique({
    where: { id },
    select: { status: true, images: true, name: true }
  })

  if (!currentProperty) throw new Error('Property not found')

  // 3. Validation
  const validation = propertySchema.partial().safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(e => e.message).join('. '))
  }

  // 4. Status & Permission Checks
  const targetStatus = input.status
  const currentStatus = currentProperty.status

  if (targetStatus && targetStatus !== currentStatus) {
    if ((targetStatus === 'rejected' || targetStatus === 'approved') && !isSystemAdmin) {
      throw new Error(`Only administrators can set property status to ${targetStatus}.`)
    }

    if (targetStatus === 'pending') {
      const totalImages = (input.images || currentProperty.images)?.length || 0
      if (totalImages < 2) {
        throw new Error('Please upload at least 2 photos before submitting for review.')
      }
    }
  }

  try {
    // 5. Execute Update
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...input,
        status: input.status || currentStatus
      }
    })

    // 6. Synchronize Unit Pricing/Capacity if Whole Unit
    if (updatedProperty.is_whole_unit) {
      const room = await prisma.room.findFirst({
        where: { property_id: id }
      })

      if (room) {
        await prisma.room.update({
          where: { id: room.id },
          data: {
            name: `${updatedProperty.name} (Entire Unit)`,
            price_per_night: updatedProperty.daily_price || 0,
            capacity: updatedProperty.max_guests || 1,
            facilities: updatedProperty.amenities || []
          }
        })
      }
    }

    revalidatePath('/owner/properties')
    revalidatePath(`/properties/${id}`)
    revalidatePath('/admin/dashboard')

    // 7. Notify Admins if submitted for review
    if (updatedProperty.status === 'pending' && currentStatus !== 'pending') {
      await notifyAdmins({
        title: 'Property Submission Updated',
        message: `The property "${updatedProperty.name}" has been updated and is ready for review.`,
        type: 'system',
        link: `/admin/properties`
      })
    }

    const plain = JSON.parse(JSON.stringify(updatedProperty))
    return {
      ...plain,
      daily_price: updatedProperty.daily_price ? Number(updatedProperty.daily_price) : null,
      monthly_price: updatedProperty.monthly_price ? Number(updatedProperty.monthly_price) : null,
      latitude: updatedProperty.latitude ? Number(updatedProperty.latitude) : null,
      longitude: updatedProperty.longitude ? Number(updatedProperty.longitude) : null,
    } as any
  } catch (error) {
    console.error('UPDATE PROPERTY ERROR:', error)
    throw new Error('Failed to update property listing')
  }
}
