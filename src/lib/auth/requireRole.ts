import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { UserRole } from '@/types/profile'
import { prisma } from '@/lib/prisma'

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // 1. Fetch fresh profile from Prisma to avoid stale session data
  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id }
  })

  if (!profile) {
    console.warn(`[requireRole] Profile missing for user ${session.user.email}.`)
    redirect('/unauthorized')
  }

  const userRole = profile.role as UserRole
  
  if (!allowedRoles.includes(userRole)) {
    console.warn(`[AUTH] Access DENIED for ${session.user.email}. Expected: ${allowedRoles}. Found: ${userRole}`)
    redirect('/unauthorized')
  }

  return { 
    user: {
      ...session.user,
      id: session.user.id,
      email: session.user.email
    }, 
    profile 
  }
}
