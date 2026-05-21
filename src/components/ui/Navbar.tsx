'use client'

import { useSession } from 'next-auth/react'
import { NavbarSwitcher } from '@/components/ui/NavbarSwitcher'

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user
  const role = (user as any)?.role || 'guest'

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (role === 'admin') return '/admin/dashboard'
    if (role === 'owner') return '/owner/dashboard'
    return '/dashboard'
  }

  return (
    <NavbarSwitcher
      dashboardLink={getDashboardLink()}
      user={
        user
          ? {
              id: user.id!,
              name: user.name || '',
              initial: (user.name || 'U').charAt(0).toUpperCase(),
              role: role,
              isHostOnboarded: (user as any).isHostOnboarded || false,
              avatarUrl: user.image || undefined,
              isVerified: true 
            }
          : null
      }
    />
  )
}
