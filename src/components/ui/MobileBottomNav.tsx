'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User, Bell, LayoutDashboard, Building2, CalendarCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

export function MobileBottomNav({ 
  role = 'guest', 
  dashboardLink = '/dashboard' 
}: { 
  role?: string, 
  dashboardLink?: string 
}) {
  const pathname = usePathname()
  const { t, isHostMode } = useSettings()

  const guestItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    ...(role === 'admin' 
      ? [{ href: dashboardLink, icon: LayoutDashboard, label: 'Control' }]
      : [{ href: '/wishlist', icon: Heart, label: 'Saved' }]
    ),
    { href: '/notifications', icon: Bell, label: 'Alerts' },
    { href: '/settings', icon: User, label: 'Profile' },
  ]

  const hostItems = [
    { href: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/owner/properties', icon: Building2, label: 'Listings' },
    { href: '/owner/reservations', icon: CalendarCheck, label: 'Bookings' },
    { href: '/notifications', icon: Bell, label: 'Alerts' },
    { href: '/settings', icon: User, label: 'Profile' },
  ]

  const navItems = isHostMode ? hostItems : guestItems

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6 safe-bottom">
      <nav className="bg-white/90 backdrop-blur-2xl border border-white shadow-architectural rounded-[2.5rem] flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 min-w-0',
                isActive 
                  ? 'text-[var(--primary)]' 
                  : 'text-gray-400 active:text-gray-900 active:scale-95'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-11 h-11 rounded-[1.25rem] transition-all duration-400 group',
                isActive && 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
              )}>
                <item.icon className={cn(
                  'w-5 h-5 transition-transform duration-400',
                  isActive && 'scale-110'
                )} />
                {isActive && (
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--accent)] border-2 border-white rounded-full animate-pulse shadow-sm" />
                )}
              </div>
              <span className={cn(
                'text-[8px] font-black uppercase tracking-[0.2em] truncate mt-2',
                isActive ? 'text-[var(--primary)]' : 'text-gray-300'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
