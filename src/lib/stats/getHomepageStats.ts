import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export const getHomepageStats = cache(async () => {
  try {
    const [reviewCount, hostCount, propertyCount, bookingCount, guestCount] = await Promise.all([
      prisma.review.count(),
      prisma.profile.count({ where: { role: 'owner' } }),
      prisma.property.count({ where: { status: 'approved' } }),
      prisma.booking.count(),
      prisma.booking.count() // Simplified unique guest count
    ])

    return {
      reviewCount,
      hostCount,
      propertyCount,
      bookingCount,
      guestCount
    }
  } catch (error) {
    console.error('Error fetching homepage stats:', error)
    return {
      reviewCount: 0,
      hostCount: 0,
      propertyCount: 0,
      bookingCount: 0,
      guestCount: 0
    }
  }
})
