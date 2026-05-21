'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, CalendarCheck, BarChart3, MessageSquare, Plus, Home } from 'lucide-react'
import { cn } from '@/utils/cn'

export function HostSidebar() {
  const pathname = usePathname()

  const navLinks = [
    { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/owner/properties', label: 'Listings & Rooms', icon: Building2 },
    { href: '/owner/reservations', label: 'Reservations', icon: CalendarCheck },
    { href: '/owner/earnings', label: 'Earnings', icon: BarChart3 },
    { href: '/owner/messages', label: 'Messages', icon: MessageSquare, soon: true },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed top-0 bottom-0 left-0 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 pt-6 pb-8 px-4 transition-all duration-300">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-gray-900 leading-none tracking-tight">Urugo<span className="text-[var(--accent)] underline decoration-2 underline-offset-4 ml-0.5">Stay</span></span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Hosting Mode</span>
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" 
                  : "text-gray-500 hover:bg-[var(--warm-gray)]/30 hover:text-gray-900"
              )}
            >
              <link.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="font-bold text-sm tracking-tight">{link.label}</span>
              {link.soon && (
                <span className="ml-auto text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md">
                  Soon
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <Link 
          href="/host/setup/property"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[var(--primary)]/5 text-[var(--primary)] font-black text-xs uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </Link>
      </div>
    </aside>
  )
}
