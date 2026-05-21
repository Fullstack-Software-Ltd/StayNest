'use client'

import { useSettings } from '@/context/SettingsContext'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function HostModeGuard({ children }: { children: React.ReactNode }) {
  const { isHostMode } = useSettings()
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If in host mode and trying to access guest pages
    const isOwner = session?.user?.role === 'owner'
    const isGuestPage = !pathname.startsWith('/owner') && 
                       !pathname.startsWith('/host') && 
                       !pathname.startsWith('/api') &&
                       !pathname.startsWith('/notifications') &&
                       pathname !== '/profile'

    if (isHostMode && isOwner && isGuestPage) {
      router.replace('/owner/dashboard')
    }
  }, [isHostMode, session, pathname, router])

  return <>{children}</>
}
