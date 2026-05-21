import { prisma } from '@/lib/prisma'
import { RWANDAN_LANDMARKS } from './landmarks'
import { sanitizePrismaObject } from '@/utils/sanitize'

/**
 * Advanced search tool for the AI Assistant.
 * Allows filtering by type, city, price range, capacity, and proximity to landmarks.
 */
export async function searchPropertiesForAI(params: {
  query?: string;
  type?: string;
  city?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  nearby_to?: string; // Slug or Name of landmark
  radius_km?: number;
  amenities?: string[];
  exclude_amenities?: string[];
}) {
  try {
    const where: any = {
      status: 'approved'
    }

    // Apply filters
    if (params.type) {
      where.type = { contains: params.type, mode: 'insensitive' }
    }

    if (params.city) {
      if (Array.isArray(params.city)) {
        where.city = { in: params.city }
      } else {
        where.city = { contains: params.city, mode: 'insensitive' }
      }
    }

    if (params.minPrice) {
      where.daily_price = { gte: params.minPrice }
    }

    if (params.maxPrice) {
      where.daily_price = { ...where.daily_price, lte: params.maxPrice }
    }

    if (params.capacity) {
      where.max_guests = { gte: params.capacity }
    }

    if (params.amenities && params.amenities.length > 0) {
      where.amenities = {
        hasEvery: params.amenities
      }
    }

    if (params.exclude_amenities && params.exclude_amenities.length > 0) {
      // Prisma doesn't have 'hasNone' for string[], we might need to filter manually or use NOT + hasSome
      // But for small lists, NOT + hasSome works
      where.NOT = [
        ...(where.NOT || []),
        {
          amenities: {
            hasSome: params.exclude_amenities
          }
        }
      ]
    }

    // Handle Proximity Search (Landmarks)
    if (params.nearby_to) {
      const landmark = RWANDAN_LANDMARKS.find(l => 
        l.slug === params.nearby_to?.toLowerCase() || 
        l.name.toLowerCase().includes(params.nearby_to?.toLowerCase() || '')
      )

      if (landmark) {
        const radius = params.radius_km || 3 // Default 3km radius
        const latRange = radius / 111
        const lonRange = radius / (111 * Math.cos(landmark.lat * (Math.PI / 180)))

        where.latitude = {
          gte: landmark.lat - latRange,
          lte: landmark.lat + latRange
        }
        where.longitude = {
          gte: landmark.lng - lonRange,
          lte: landmark.lng + lonRange
        }
      }
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: { full_name: true, avatar_url: true }
        }
      },
      take: 5
    })

    return properties.map(p => {
      const sanitized = sanitizePrismaObject(p)
      return {
        ...sanitized,
        host: sanitized.owner
      }
    })
  } catch (error) {
    console.error('[AI SEARCH ERROR]', error)
    return []
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
