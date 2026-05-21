'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function getOwnerReviews() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return []

  try {
    // Get reviews for properties owned by this user
    const reviews = await prisma.review.findMany({
      where: {
        property: {
          owner_id: userId
        }
      },
      include: {
        property: {
          select: {
            name: true
          }
        },
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
    console.error('Error fetching owner reviews:', error)
    return []
  }
}
