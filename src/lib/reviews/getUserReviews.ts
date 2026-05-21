import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import type { Review } from '@/types/review'

export async function getUserReviews() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  try {
    const reviews = await prisma.review.findMany({
      where: { user_id: session.user.id },
      include: {
        property: {
          select: {
            name: true,
            city: true,
            country: true,
            main_image_url: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return reviews.map((review) => ({
      ...review,
      created_at: review.created_at.toISOString(),
      updated_at: review.updated_at.toISOString(),
    })) as Review[]
  } catch (error) {
    console.error('getUserReviews ERROR:', error)
    throw error
  }
}
