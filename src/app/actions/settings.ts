'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'

export async function getProfileSettings() {
  const session = await auth()
  if (!session?.user?.id) return null

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id },
      select: {
        language: true,
        currency: true
      } as any
    })
    return profile as any
  } catch (error) {
    console.error('getProfileSettings ERROR:', error)
    return null
  }
}

export async function updateProfileSettings(data: { language?: string, currency?: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  try {
    await prisma.profile.update({
      where: { id: session.user.id },
      data: data as any
    })
    return { success: true }
  } catch (error) {
    console.error('updateProfileSettings ERROR:', error)
    throw error
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Not authenticated')

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      throw new Error('User record or password not found')
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      throw new Error('Incorrect current password')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return { success: true }
  } catch (error: any) {
    console.error('changePassword ERROR:', error)
    throw new Error(error.message || 'Failed to change password')
  }
}
