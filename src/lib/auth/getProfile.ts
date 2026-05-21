import { prisma } from '@/lib/prisma'
import { cache } from 'react'

export const getProfile = cache(async (userId: string) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId }
    })

    if (!profile) return null

    return {
      ...profile,
      created_at: profile.created_at.toISOString()
    } as any
  } catch (error) {
    console.error('getProfile ERROR:', error)
    return null
  }
})
