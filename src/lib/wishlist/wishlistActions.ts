'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { PropertySearchResult } from '@/types/search'

export async function toggleWishlist(propertyId: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Please sign in to wishlist properties.')

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        user_id_property_id: {
          user_id: userId,
          property_id: propertyId
        }
      }
    })

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id }
      })
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          user_id: userId,
          property_id: propertyId
        }
      })
    }

    revalidatePath('/')
    revalidatePath('/search')
    revalidatePath('/wishlist')
    revalidatePath(`/properties/${propertyId}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('[WISHLIST ACTION ERROR]:', error.message || error)
    throw new Error(error.message || 'Something went wrong. Please try again.')
  }
}

export async function getUserWishlist() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return []

  try {
    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        user_id: userId
      },
      include: {
        property: {
          include: {
            rooms: {
              select: {
                price_per_night: true,
                capacity: true
              }
            },
            reviews: {
              select: {
                rating: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Map to PropertySearchResult format
    return wishlistItems.map((w: any) => {
      const p = w.property
      if (!p) return null
      
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
        is_wishlisted: true
      } as PropertySearchResult
    }).filter((p): p is PropertySearchResult => p !== null)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }
}

export async function getIsWishlisted(propertyId: string) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return false

  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        user_id_property_id: {
          user_id: userId,
          property_id: propertyId
        }
      }
    })
    return !!wishlist
  } catch (error) {
    return false
  }
}
