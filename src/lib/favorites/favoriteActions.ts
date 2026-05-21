'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(propertyId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  try {
    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        user_id_property_id: {
          user_id: userId,
          property_id: propertyId
        }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      })
    } else {
      await prisma.favorite.create({
        data: {
          user_id: userId,
          property_id: propertyId
        }
      })
    }

    revalidatePath('/')
    revalidatePath('/search')
    revalidatePath('/favorites')
  } catch (error) {
    console.error('toggleFavorite ERROR:', error)
    throw error
  }
}

export async function getUserFavorites() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return []

  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        property: {
          include: {
            rooms: {
              select: { price_per_night: true, capacity: true }
            },
            reviews: {
              select: { rating: true }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Map to PropertySearchResult format
    return favorites.map((f: any) => {
      const p = f.property
      const roomPrices = p.rooms?.map((r: any) => Number(r.price_per_night)) || []
      const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
      const ratings = p.reviews?.map((r: any) => r.rating) || []
      const reviewCount = ratings.length
      const avgRating = reviewCount > 0 
        ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / reviewCount).toFixed(1))
        : 0

      return {
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        address: p.address,
        city: p.city,
        country: p.country,
        main_image_url: p.main_image_url,
        starting_price: roomPrices.length > 0 ? Math.min(...roomPrices) : null,
        capacity: roomCapacities.length > 0 ? Math.max(...roomCapacities) : 0,
        average_rating: avgRating,
        review_count: reviewCount,
        is_favorited: true
      }
    })
  } catch (error) {
    console.error('getUserFavorites ERROR:', error)
    return []
  }
}

export async function getIsFavorited(propertyId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return false

  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        user_id_property_id: {
          user_id: userId,
          property_id: propertyId
        }
      }
    })

    return !!favorite
  } catch (error) {
    console.error('getIsFavorited ERROR:', error)
    return false
  }
}
