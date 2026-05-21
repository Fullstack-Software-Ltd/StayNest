'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, CalendarCheck, BarChart3, MessageSquare, ArrowLeftRight, Bell } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'
import { AirbnbNavMenu } from '@/components/ui/AirbnbNavMenu'

interface HostingNavbarProps {
  user: {
    id: string
    name: string
    initial: string
    role: string
    avatarUrl?: string | null
    isVerified?: boolean
  } | null
}

export function HostingNavbar({ user }: HostingNavbarProps) {
  const pathname = usePathname()
  const { t, setHostMode } = useSettings()

  const navLinks = [
    { href: '/owner/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/owner/properties', label: t('owner.my_properties'), icon: Building2 },
    { href: '/owner/reservations', label: t('owner.reservations'), icon: CalendarCheck },
    { href: '/owner/reviews', label: 'Reviews', icon: MessageSquare },
    { href: '/owner/earnings', label: 'Earnings', icon: BarChart3 },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <nav className="fixed top-0 left-0 lg:left-64 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex lg:hidden items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-gray-900 leading-none tracking-tight">Urugo<span className="text-[var(--accent)] underline decoration-2 underline-offset-4 ml-0.5">Stay</span></span>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Hosting Mode</span>
              </div>
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-4">
            {/* Mode Switcher */}
            <button
              onClick={() => {
                setHostMode(false)
                window.location.href = '/'
              }}
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-95 group"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[var(--accent)] group-hover:rotate-180 transition-transform duration-500" />
              <span>Switch to Guest</span>
            </button>

            <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />
            
            <AirbnbNavMenu 
              user={user} 
              dashboardLink="/owner/dashboard" 
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

// Missing import recovery
import { Home } from 'lucide-react'
