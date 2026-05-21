'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

export async function updateHostProfile(data: { 
  full_name: string, 
  phone: string, 
  bio: string 
}) {
  const session = await auth()
  
  const logPath = path.join(process.cwd(), 'onboarding_debug.txt')
  fs.writeFileSync(logPath, `SESSION: ${JSON.stringify(session, null, 2)}\nDATA: ${JSON.stringify(data, null, 2)}\n`)

  if (!session?.user?.id) {
    fs.appendFileSync(logPath, `ERROR: Not authenticated. Session has no user ID.\n`)
    throw new Error('Not authenticated')
  }

  try {
    const userId = session.user.id
    const userEmail = session.user.email || ''

    // 1. Ensure User exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: data.full_name,
        email: userEmail
      },
      create: {
        id: userId,
        email: userEmail,
        name: data.full_name
      }
    })

    // 2. Ensure Profile exists and is updated with host details
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        full_name: data.full_name,
        email: userEmail,
        phone: data.phone,
        bio: data.bio,
        isHostOnboarded: true,
        role: 'owner'
      },
      create: {
        id: userId,
        full_name: data.full_name,
        email: userEmail,
        phone: data.phone,
        bio: data.bio,
        isHostOnboarded: true,
        role: 'owner'
      }
    })

    revalidatePath('/')
    revalidatePath('/host/onboarding')
    revalidatePath('/owner/dashboard')

    fs.appendFileSync(logPath, `SUCCESS: User and Profile upserted.\n`)
    return { success: true }
  } catch (error: any) {
    fs.appendFileSync(logPath, `ERROR: ${error?.message || error}\nSTACK: ${error?.stack}\n`)
    console.error('updateHostProfile ERROR:', error)
    throw new Error('Failed to update host profile')
  }
}
