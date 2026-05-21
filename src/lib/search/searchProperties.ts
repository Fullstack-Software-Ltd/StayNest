import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { SearchFilters, PropertySearchResult } from '@/types/search'
import { isHighQualityProperty } from '@/lib/utils/qualityFilter'

export async function searchProperties(filters: SearchFilters): Promise<PropertySearchResult[]> {
  const session = await auth()
  const userId = session?.user?.id

  // Build Prisma query
  const where: any = {
    status: 'approved'
  }

  // Destination filter
  if (filters.destination && typeof filters.destination === 'string' && filters.destination.trim() !== '') {
    const dest = filters.destination.trim()
    where.OR = [
      { city: { contains: dest, mode: 'insensitive' } },
      { country: { contains: dest, mode: 'insensitive' } },
      { address: { contains: dest, mode: 'insensitive' } },
      { name: { contains: dest, mode: 'insensitive' } }
    ]
  }

  // Type filter
  if (filters.type && filters.type !== 'All') {
    where.type = { equals: filters.type, mode: 'insensitive' }
  }

  try {
    const properties = await prisma.property.findMany({
      where,
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
    })

    // Fetch user favorites if logged in
    const favoritePropertyIds = new Set<string>()
    if (userId) {
      const favs = await prisma.favorite.findMany({
        where: { user_id: userId },
        select: { property_id: true }
      })
      favs.forEach(f => favoritePropertyIds.add(f.property_id))
    }

    // Map results and apply post-query filters
    const results: PropertySearchResult[] = properties
      .map((p: any) => {
        const roomPrices = p.rooms?.map((r: any) => Number(r.price_per_night)) || []
        const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
        const ratings = p.reviews?.map((r: any) => r.rating) || []
        
        const reviewCount = ratings.length
        const avgRating = reviewCount > 0 
          ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / reviewCount).toFixed(1))
          : null

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
          amenities: p.amenities,
          is_favorited: favoritePropertyIds.has(p.id)
        }
      })
      .filter((p) => {
        if (p.starting_price === null) return false
        
        if (filters.minPrice && p.starting_price < filters.minPrice) return false
        if (filters.maxPrice && p.starting_price > filters.maxPrice) return false
        
        const requiredCapacity = filters.capacity || filters.guests
        if (requiredCapacity && p.capacity < requiredCapacity) return false
        
        if (filters.amenities && filters.amenities.length > 0) {
          const propertyAmenities = p.amenities || []
          const hasAllRequested = filters.amenities.every(a => propertyAmenities.includes(a))
          if (!hasAllRequested) return false
        }
        
        if (!isHighQualityProperty(p.name, p.description)) return false

        return true
      })

    // Sorting
    if (filters.sort) {
      results.sort((a, b) => {
        switch (filters.sort) {
          case 'price_asc':
            return (a.starting_price || 0) - (b.starting_price || 0)
          case 'price_desc':
            return (b.starting_price || 0) - (a.starting_price || 0)
          case 'rating_desc':
            return (b.average_rating || 0) - (a.average_rating || 0)
          case 'newest':
            return b.id.localeCompare(a.id)
          default:
            return 0
        }
      })
    }

    return results
  } catch (error) {
    console.error('Error searching properties:', error)
    return []
  }
}
