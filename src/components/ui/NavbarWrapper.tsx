'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isHome = pathname === '/'

  // Routes where the navbar should be hidden
  const hideNavbarRoutes = ['/login', '/register', '/onboarding']
  const shouldHide = 
    hideNavbarRoutes.includes(pathname) || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/host')

  if (shouldHide) return null

  return <>{children}</>
}

export function MobileNavWrapperWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Routes where the mobile bottom navigation should be hidden
  const hideMobileNavRoutes = ['/login', '/register', '/onboarding', '/admin', '/owner']
  
  const shouldHide = hideMobileNavRoutes.some(route => pathname.startsWith(route))

  if (shouldHide) return <>{children}</>

  return <>{children}</>
}
