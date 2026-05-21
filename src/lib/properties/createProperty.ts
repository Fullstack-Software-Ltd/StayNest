'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { CreatePropertyInput } from '@/types/property'
import { propertySchema } from '@/lib/validation'
import { revalidatePath } from 'next/cache'
import { notifyAdmins } from '../notifications/notifyAdmins'

export async function createProperty(input: CreatePropertyInput) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error('Unauthorized')

  // 1. Validation (Zod)
  const validation = propertySchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(e => e.message).join('. '))
  }

  // 2. Photo Requirement for non-drafts
  const inputWithStatus = input as any
  const imagesCount = inputWithStatus.images?.length || 0
  
  if (inputWithStatus.status !== 'draft' && imagesCount < 2) {
    throw new Error('Please upload at least 2 photos for your property before submitting for review.')
  }

  // 3. Security: Enforce initial status as 'pending' for admin review
  const status = 'pending'

  try {
    const property = await prisma.$transaction(async (tx) => {
      // 3. Create Property
      const newProperty = await tx.property.create({
        data: {
          ...input,
          owner_id: userId,
          status: status,
        }
      })

      // 4. Automated Unit Management for Whole units
      if (newProperty.is_whole_unit) {
        await tx.room.create({
          data: {
            property_id: newProperty.id,
            name: `${newProperty.name} (Entire Unit)`,
            description: `Full access to the entire ${newProperty.type.toLowerCase()}.`,
            price_per_night: newProperty.daily_price || 0,
            capacity: newProperty.max_guests || 1,
            available_rooms: 1,
            bed_type: 'Default',
            size_sqm: 0,
            facilities: newProperty.amenities || []
          }
        })
      }

      return newProperty
    })

    // 5. Notify Admins for Review
    await notifyAdmins({
      title: 'New Property Submission',
      message: `A new property "${property.name}" has been submitted and requires your review.`,
      type: 'system',
      link: `/admin/properties`
    })

    revalidatePath('/owner/properties')
    revalidatePath('/admin/dashboard')
    revalidatePath('/')
    
    const plain = JSON.parse(JSON.stringify(property))
    return {
      ...plain,
      daily_price: Number(property.daily_price),
      monthly_price: property.monthly_price ? Number(property.monthly_price) : null,
      latitude: property.latitude ? Number(property.latitude) : null,
      longitude: property.longitude ? Number(property.longitude) : null,
    } as any
  } catch (error: any) {
    console.error('CREATE PROPERTY ERROR:', error)
    throw new Error(error.message || 'Failed to create property listing')
  }
}
