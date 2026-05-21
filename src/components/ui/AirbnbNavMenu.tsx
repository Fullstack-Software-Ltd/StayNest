'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Globe, Home, Calendar, Bell, Settings, LogOut, User, Heart, ArrowLeftRight, ShieldCheck, Star, ChevronRight, Crown, LayoutDashboard } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'
import { Notification } from '@/types/notification'
import { getNotificationUpdate } from '@/lib/notifications/getUserNotifications'
import { NotificationList } from '@/components/notifications/notification-list'

interface AirbnbNavMenuProps {
  user: {
    id: string
    name: string
    initial: string
    role: string
    isHostOnboarded?: boolean
    avatarUrl?: string | null
    isVerified?: boolean
  } | null
  dashboardLink: string
  isTransparent?: boolean
}

export function AirbnbNavMenu({ user, dashboardLink, isTransparent = false }: AirbnbNavMenuProps) {
  const { t, isHostMode, setHostMode } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotificationPreview, setShowNotificationPreview] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const isFetchingRef = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    if (!user || isFetchingRef.current) return
    isFetchingRef.current = true
    try {
      const { notifications: notifs, unreadCount: count } = await getNotificationUpdate(5)
      setNotifications(notifs)
      setUnreadCount(count)
    } catch (err) {
      console.error('Failed to sync notifications:', err)
    } finally {
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      // Optimization: Increase polling interval to 2 minutes to reduce local CPU/DB load
      const interval = setInterval(fetchNotifications, 120000) 
      return () => clearInterval(interval)
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowNotificationPreview(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const guestLinks = [
    { href: '/login', label: t('nav.login'), bold: true, icon: User },
    { href: '/register', label: t('nav.register'), bold: false, icon: null },
    { divider: true },
    { href: '/login?redirect=/host/onboarding', label: t('nav.become_host'), bold: false, icon: Home },
  ]

  const userLinks = isHostMode ? [
    { href: '/owner/dashboard', label: 'Hosting Dashboard', icon: LayoutDashboard, bold: true },
    { href: '/owner/properties', label: 'My Listings', icon: Home, bold: false },
    { href: '/owner/reservations', label: 'Reservations', icon: Calendar, bold: false },
    { href: '/owner/earnings', label: 'Earnings', icon: Star, bold: false },
    { href: '/notifications', label: 'Notifications', icon: Bell, bold: false, isNotification: true },
    { divider: true },
    { 
      action: () => { 
        setHostMode(false); 
        window.location.href = '/' 
      }, 
      label: 'Switch to Guest Mode', 
      icon: ArrowLeftRight, 
      bold: true 
    },
  ] : [
    { 
      href: dashboardLink, 
      label: user?.role === 'admin' ? 'Admin Dashboard' : (user?.role === 'owner' ? 'Hosting Dashboard' : 'My Trips'), 
      icon: user?.role === 'admin' ? ShieldCheck : Home, 
      bold: true 
    },
    { href: '/bookings', label: t('nav.my_bookings'), icon: Calendar, bold: false },
    { href: '/wishlist', label: t('nav.favorites'), icon: Heart, bold: false },
    { href: '/notifications', label: 'Notifications', icon: Bell, bold: false, isNotification: true },
    { divider: true },
    ...(user?.role === 'owner' ? [
      { 
        action: () => { 
          setHostMode(true); 
          if (!user.isHostOnboarded) {
            window.location.href = '/host/onboarding' 
          } else {
            window.location.href = '/owner/dashboard' 
          }
        }, 
        label: 'Switch to Hosting', 
        icon: ArrowLeftRight, 
        bold: true 
      }
    ] : (user?.role === 'admin' ? [] : [
      { href: '/host/onboarding', label: 'Become a Host', icon: Home, bold: false }
    ])),
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full border transition-all duration-500 relative',
          isTransparent && !isOpen
            ? 'bg-black/10 backdrop-blur-md border-white/20 hover:bg-black/20 hover:border-white/40' 
            : 'bg-white/90 backdrop-blur-md border-[var(--luxury-gold)]/20 shadow-sm hover:shadow-md',
          isOpen && 'ring-2 ring-[var(--luxury-gold)]/10 border-[var(--luxury-gold)]/50 shadow-lg bg-white/95'
        )}
        aria-label={t('nav.open_menu')}
      >
        <Menu className={cn(
          "w-4 h-4 transition-colors",
          isTransparent && !isOpen ? "text-white/80" : "text-[var(--luxury-green)] opacity-60"
        )} />
        
        <div className={cn(
          "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden relative border",
          isTransparent && !isOpen ? "bg-white/10 border-white/20" : "bg-[var(--luxury-green)] border-white/50"
        )}>
          {user?.avatarUrl ? (
            <Image 
              src={user.avatarUrl} 
              alt={user.name} 
              fill 
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <User className={cn("w-4 h-4", isTransparent && !isOpen ? "opacity-60" : "opacity-80")} />
          )}

          {user?.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md border-[0.5px] border-[var(--luxury-gold)]/20">
              <Crown className="w-2.5 h-2.5 text-[var(--luxury-gold)] fill-[var(--luxury-gold)]/20" />
            </div>
          )}
        </div>
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute right-0 top-14 w-72 sm:w-80 shadow-2xl overflow-hidden z-50 animate-scale-in rounded-[2rem] border border-[var(--luxury-gold)]/10",
            "luxury-glass p-1 shadow-black/[0.05]"
          )}
        >
          {user ? (
            <div className="flex flex-col relative">
              {/* Profile Header */}
              <div className="px-7 py-6 bg-[var(--luxury-cream)]/30 rounded-t-[1.8rem] border-b border-[var(--luxury-gold)]/5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[var(--luxury-green)] flex items-center justify-center text-white shrink-0 overflow-hidden relative border-2 border-white shadow-sm">
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                    ) : (
                      <span className="text-sm font-serif">{user.initial}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-serif italic text-gray-900 truncate leading-tight">{user.name}</h3>
                    <p className="text-[8px] font-black text-[var(--luxury-gold)] uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5 opacity-80">
                      <Star className="w-1.5 h-1.5 fill-[var(--luxury-gold)]" />
                      {t(`common.roles.${user.role}`)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-2 px-2 flex flex-col gap-0.5">
                {userLinks.map((link, i) =>
                  (link as any).divider ? (
                    <div key={i} className="border-t border-gray-50 my-1.5 mx-5" />
                  ) : (
                    (link as any).isNotification ? (
                      <div 
                        key="notifications"
                        className="relative group/notif"
                        onMouseEnter={() => setShowNotificationPreview(true)}
                        onMouseLeave={() => setShowNotificationPreview(false)}
                      >
                        <Link
                          href="/notifications"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-5 py-3.5 text-xs rounded-2xl hover:bg-[var(--luxury-cream)] transition-all duration-300 group'
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <Bell className="w-3.5 h-3.5 text-[var(--luxury-gold)] opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-gray-500 font-bold">{link.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <span className="bg-[var(--accent)] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                {unreadCount}
                              </span>
                            )}
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                          </div>
                        </Link>

                        {/* Hover Overlay - Notification Preview */}
                        {showNotificationPreview && notifications.length > 0 && (
                          <div 
                            className="absolute right-[calc(100%+0.5rem)] top-0 w-80 bg-white/95 backdrop-blur-xl border border-[var(--luxury-gold)]/10 shadow-2xl rounded-[1.5rem] overflow-hidden z-[60] animate-scale-in"
                            onMouseEnter={() => setShowNotificationPreview(true)}
                            onMouseLeave={() => setShowNotificationPreview(false)}
                          >
                            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h4>
                              <Link href="/notifications" className="text-[9px] font-black text-[var(--luxury-gold)] uppercase tracking-tighter hover:underline">See All</Link>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto scrollbar-none">
                              <NotificationList 
                                notifications={notifications} 
                                onNotificationRead={fetchNotifications} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (link.href ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-4 px-5 py-3.5 text-xs rounded-2xl hover:bg-[var(--luxury-cream)] transition-all duration-300 group',
                          link.bold ? 'font-black text-gray-900 uppercase tracking-tight' : 'text-gray-500 font-bold'
                        )}
                      >
                        {link.icon && <link.icon className="w-3.5 h-3.5 text-[var(--luxury-gold)] opacity-40 group-hover:opacity-100 transition-opacity" />}
                        <span>{link.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={link.label}
                        onClick={() => {
                          (link as any).action()
                          setIsOpen(false)
                        }}
                        className={cn(
                          'flex items-center gap-4 w-full px-5 py-3.5 text-xs rounded-2xl hover:bg-[var(--luxury-cream)] transition-all duration-300 text-left group',
                          link.bold ? 'font-black text-gray-900 uppercase tracking-tight' : 'text-gray-500 font-bold'
                        )}
                      >
                        {link.icon && <link.icon className="w-3.5 h-3.5 text-[var(--luxury-gold)] opacity-40 group-hover:opacity-100 transition-opacity" />}
                        <span>{link.label}</span>
                      </button>
                    ))
                  )
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-1 bg-black/[0.02] border-t border-gray-100/50 rounded-b-[1.8rem]">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-7 py-4 text-[11px] text-gray-500 font-bold hover:text-gray-900 transition-colors"
                >
                  <Settings className="w-4 h-4 opacity-40" />
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={async () => {
                    const { signOut } = await import('next-auth/react')
                    await signOut({ callbackUrl: '/login' })
                  }}
                  className="flex items-center gap-4 w-full px-7 py-4 text-[11px] text-red-500/70 font-black uppercase tracking-widest hover:bg-red-50/50 transition-colors rounded-b-[1.8rem] border-t border-gray-100/50"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.sign_out')}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {guestLinks.map((link, i) =>
                link.divider ? (
                  <div key={i} className="border-t border-gray-100 my-2 mx-5" />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-4 px-7 py-4 text-xs font-bold hover:bg-[var(--luxury-cream)] transition-colors',
                      link.bold ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-[var(--luxury-gold)]" />}
                    <span>{link.label}</span>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
