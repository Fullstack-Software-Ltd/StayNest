import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function POST() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return redirect('/login')
  }

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { role: 'owner' }
    })
  } catch (error: any) {
    console.error('Error becoming host:', error)
    return new Response('Error updating role: ' + error.message, { status: 500 })
  }

  return redirect('/owner/dashboard')
}
