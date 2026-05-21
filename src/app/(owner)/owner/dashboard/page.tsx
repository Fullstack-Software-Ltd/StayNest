import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { OwnerDashboardClient } from '@/components/owner/OwnerDashboardClient'
import { prisma } from '@/lib/prisma'

export default async function OwnerDashboard() {
  const { profile } = await requireRole(['owner', 'admin'])
  
  const [properties, bookings, reviews] = await Promise.all([
    getOwnerProperties(),
    getOwnerBookings(),
    prisma.review.findMany({
      where: {
        property: {
          owner_id: profile.id
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  ])

  return (
    <OwnerDashboardClient 
      profile={JSON.parse(JSON.stringify(profile))} 
      properties={JSON.parse(JSON.stringify(properties))} 
      bookings={JSON.parse(JSON.stringify(bookings))} 
      reviews={JSON.parse(JSON.stringify(reviews))}
    />
  )
}
