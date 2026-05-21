import { prisma } from '@/lib/prisma'

export async function getPropertyReviews(propertyId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { property_id: propertyId },
      include: {
        user: {
          select: {
            full_name: true,
            avatar_url: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return reviews
  } catch (error) {
    console.error('getPropertyReviews ERROR:', error)
    throw error
  }
}
