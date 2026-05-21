import { prisma } from '@/lib/prisma'

export async function calculateAverageRating(propertyId: string) {
  try {
    const aggregation = await prisma.review.aggregate({
      where: {
        property_id: propertyId
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    })

    const average = aggregation._avg.rating || 0
    const count = aggregation._count.rating || 0

    return { 
      average: parseFloat(average.toFixed(1)), 
      count 
    }
  } catch (error) {
    console.error('Error calculating average rating:', error)
    return { average: 0, count: 0 }
  }
}
