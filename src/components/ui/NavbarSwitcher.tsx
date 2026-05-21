'use client'

import { useSettings } from '@/context/SettingsContext'
import { ScrollNavbar } from '@/components/ui/ScrollNavbar'
import { HostingNavbar } from '@/components/ui/HostingNavbar'
import { usePathname } from 'next/navigation'

interface NavbarSwitcherProps {
  dashboardLink: string
  user: any
}

export function NavbarSwitcher({ dashboardLink, user }: NavbarSwitcherProps) {
  const { isHostMode } = useSettings()
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Force host mode navbar if we're on a host/owner route
  const isHostRoute = pathname?.startsWith('/owner') || pathname?.startsWith('/host')

  if (isHostMode || isHostRoute) {
    return <HostingNavbar user={user} />
  }

  return (
    <ScrollNavbar
      isHome={isHome}
      dashboardLink={dashboardLink}
      user={user}
    />
  )
}
