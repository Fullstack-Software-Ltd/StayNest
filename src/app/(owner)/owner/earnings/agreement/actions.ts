'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function acceptHostCommissionAgreement() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // Using executeRaw to bypass Prisma Client schema cache issues on Windows 
    // when the dev server is running and locking the generated client files.
    await prisma.$executeRaw`
      UPDATE "Profile" 
      SET 
        "hostCommissionAccepted" = true, 
        "hostCommissionRate" = 10.00, 
        "hostCommissionAcceptedAt" = NOW() 
      WHERE id = ${session.user.id}::uuid
    `

    revalidatePath('/owner/dashboard')
    revalidatePath('/owner/earnings')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error accepting commission agreement:', error)
    return { success: false, error: 'Failed to save agreement. Please try again.' }
  }
}
