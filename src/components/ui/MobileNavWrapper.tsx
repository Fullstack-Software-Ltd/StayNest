'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from './MobileBottomNav'
import { cn } from '@/utils/cn'

export function MobileNavWrapper({ 
  children,
  role = 'guest',
  dashboardLink = '/dashboard'
}: { 
  children: React.ReactNode,
  role?: string,
  dashboardLink?: string
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAuth = pathname === '/login' || pathname === '/register'
  const isExcludedFromGlobalNav = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/owner') || 
    pathname.startsWith('/host')
  
    return (
      <>
        <main className={cn(
          'min-h-screen',
          /* Add top padding for the floating navbar on all non-home, non-auth, non-dashboard-admin pages */
          !isHome && !isAuth && !isExcludedFromGlobalNav && 'pt-24 sm:pt-28',
        /* Bottom padding for mobile bottom nav on home */
        isHome && 'pb-20 lg:pb-0'
      )}>
        {children}
      </main>
      {isHome && <MobileBottomNav role={role} dashboardLink={dashboardLink} />}
    </>
  )
}
