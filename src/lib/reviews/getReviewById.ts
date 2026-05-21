import { prisma } from '@/lib/prisma'

export async function getReviewById(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            full_name: true,
            avatar_url: true
          }
        },
        property: {
          select: {
            name: true,
            city: true,
            country: true,
            main_image_url: true
          }
        }
      }
    })

    return review
  } catch (error) {
    console.error('getReviewById ERROR:', error)
    throw error
  }
}
