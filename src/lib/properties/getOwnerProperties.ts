'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Property } from '@/types/property'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function getOwnerProperties() {
  const session = await auth()
  const userId = session?.user?.id
  
  if (!userId) return []

  try {
    const properties = await prisma.property.findMany({
      where: {
        owner_id: userId
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return properties.map(p => sanitizePrismaObject(p)) as any
  } catch (error) {
    console.error('Error fetching owner properties:', error)
    return []
  }
}
