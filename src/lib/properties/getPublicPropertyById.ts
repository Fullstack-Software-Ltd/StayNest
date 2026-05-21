import { prisma } from '@/lib/prisma'
import { Property } from '@/types/property'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function getPublicPropertyById(id: string, includePending = false) {
  try {
    const where: any = { id }
    if (!includePending) {
      where.status = 'approved'
    }

    const property = await prisma.property.findUnique({
      where,
      include: {
        owner: {
          select: {
            full_name: true,
            avatar_url: true,
            created_at: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!property) return null

    const sanitized = sanitizePrismaObject(property)
    
    return {
      ...sanitized,
      host: sanitized.owner,
      owner: undefined 
    } as any
  } catch (error) {
    console.error('Error fetching public property:', error)
    return null
  }
}
