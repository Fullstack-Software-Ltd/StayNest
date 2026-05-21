'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, Home, Search, Calendar, User, LogOut } from 'lucide-react'
import { cn } from '@/utils/cn'

interface MobileNavProps {
  userName: string
  userRole: string
  dashboardLink: string
}

export function MobileNav({ userName, userRole, dashboardLink }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Find a Stay', icon: Search },
    { href: '/bookings', label: 'My Bookings', icon: Calendar },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: dashboardLink, label: 'Dashboard', icon: User },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all sm:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 sm:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <p className="font-black text-gray-900 text-sm">{userName}</p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{userRole}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={async () => {
              const { signOut } = await import('next-auth/react')
              await signOut({ callbackUrl: '/login' })
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
