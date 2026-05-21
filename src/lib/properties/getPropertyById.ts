import { prisma } from '@/lib/prisma'
import { Property } from '@/types/property'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            full_name: true,
            avatar_url: true,
            created_at: true
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
    console.error(`--- PRISMA ERROR [getPropertyById] ---`)
    console.error(`ID: ${id}`)
    console.error(error)
    return null
  }
}
