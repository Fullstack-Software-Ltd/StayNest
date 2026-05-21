'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { CreateReviewInput } from '@/types/review'
import { canUserReviewBooking } from './canUserReviewBooking'
import { reviewSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications/createNotification'
import { revalidatePath } from 'next/cache'

export async function createReview(input: CreateReviewInput) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  // 1. Validation (Zod)
  const validation = reviewSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(i => i.message).join('. '))
  }

  // 2. Eligibility & Ownership Check
  const { canReview, error, property } = await canUserReviewBooking(input.booking_id)
  if (!canReview) throw new Error(error || 'You are not eligible to review this stay')

  try {
    // 3. Execution
    const review = await prisma.review.create({
      data: {
        user_id: userId,
        property_id: input.property_id,
        booking_id: input.booking_id,
        rating: input.rating,
        comment: input.comment
      }
    })

    // 4. Notifications
    const propertyName = (property as any)?.name || 'the property'
    
    await createNotification({
      user_id: userId,
      title: 'Review Posted!',
      message: `Your review for ${propertyName} has been successfully posted.`,
      type: 'review'
    })

    const propertyData = await prisma.property.findUnique({
      where: { id: input.property_id },
      select: { owner_id: true }
    })

    if (propertyData?.owner_id) {
      await createNotification({
        user_id: propertyData.owner_id,
        title: 'New Review Received',
        message: `A guest left a ${input.rating}-star review for ${propertyName}.`,
        type: 'review'
      })
    }

    revalidatePath(`/properties/${input.property_id}`)
    revalidatePath('/dashboard')
    
    return review
  } catch (error: any) {
    if (error.code === 'P2002') {
       throw new Error('You have already reviewed this stay.')
    }
    console.error('CREATE REVIEW ERROR:', error)
    throw new Error('Failed to post review')
  }
}
