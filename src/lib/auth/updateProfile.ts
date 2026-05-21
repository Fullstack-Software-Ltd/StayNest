'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/validation'

export async function updateProfile(data: any) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Not authenticated')

  // 1. Validation (Zod)
  const validation = profileSchema.partial().safeParse(data)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 2. Execution
  // Pick only allowed fields from the validated data
  const ALLOWED_PROFILE_KEYS = [
    'full_name', 'legal_name', 'preferred_name', 
    'status', 'avatar_url', 'phone', 'language', 'currency'
  ]
  
  const updateProfileData: any = {}
  ALLOWED_PROFILE_KEYS.forEach(k => {
    if (validation.data[k as keyof typeof validation.data] !== undefined) {
      updateProfileData[k] = validation.data[k as keyof typeof validation.data]
    }
  })

  try {
    // 3. Update Profile
    if (Object.keys(updateProfileData).length > 0) {
      await prisma.profile.update({
        where: { id: userId },
        data: updateProfileData
      })
    }

    // 4. Update User model for consistency (NextAuth uses User.name)
    if (updateProfileData.full_name || updateProfileData.avatar_url) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: updateProfileData.full_name || undefined,
          image: updateProfileData.avatar_url || undefined
        }
      })
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)
    throw new Error('Failed to update your profile')
  }
}
