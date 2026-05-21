'use server'

import { prisma } from '@/lib/prisma'

export async function ensureWholeUnitRoom(propertyId: string) {
  try {
    // 1. Check if an "Entire Unit" room already exists for this property
    const existingRoom = await prisma.room.findFirst({
      where: {
        property_id: propertyId,
        name: {
          contains: 'Entire Unit',
          mode: 'insensitive'
        }
      }
    })

    if (existingRoom) {
      return existingRoom.id
    }

    // 2. Fetch property details to populate the room
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) throw new Error('Property not found')

    // 3. Create the room
    const newRoom = await prisma.room.create({
      data: {
        property_id: propertyId,
        name: `${property.name} (Entire Unit)`,
        description: `Full access to the entire ${property.type?.toLowerCase() || 'property'}.`,
        price_per_night: property.daily_price || 0,
        capacity: property.max_guests || 4,
        available_rooms: 1,
        bed_type: 'Default',
        size_sqm: 0,
        facilities: property.amenities || []
      }
    })

    return newRoom.id
  } catch (error) {
    console.error('ensureWholeUnitRoom ERROR:', error)
    throw error
  }
}
