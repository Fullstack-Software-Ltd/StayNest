'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, Sparkles } from 'lucide-react'
import { AirbnbNavMenu } from '@/components/ui/AirbnbNavMenu'
import { HostingNavbar } from '@/components/ui/HostingNavbar'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface ScrollNavbarProps {
  user: { 
    id: string; 
    name: string; 
    initial: string; 
    role: string; 
    isHostOnboarded?: boolean;
    avatarUrl?: string | null;
    isVerified?: boolean;
  } | null
  dashboardLink: string
  isHome?: boolean
}

export function ScrollNavbar({ user, dashboardLink, isHome = false }: ScrollNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const { t, isHostMode, setHostMode } = useSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150)
    window.addEventListener('scroll', onScroll, { passive: true })
    
    // Safety Sync: If the user is an admin or guest, force host mode to off
    // This prevents "Switch to Guest" from showing for people who shouldn't be in hosting mode.
    if ((user?.role === 'guest' || user?.role === 'admin') && isHostMode) {
      setHostMode(false)
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [user?.role, isHostMode, setHostMode])

  const transparent = isHome && !scrolled

  if (isHostMode && user?.role === 'owner') {
    return <HostingNavbar user={user} />
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        transparent
          ? 'bg-transparent border-transparent py-8 sm:py-10'
          : 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-3 sm:py-4 shadow-sm'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-10 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-1 flex items-center">
            {isHostMode ? (
              <div className="flex items-center space-x-2">
                <span 
                  className={cn(
                    'text-2xl font-serif tracking-tight transition-colors duration-300',
                    transparent ? 'text-white' : 'text-[var(--luxury-green)]'
                  )}
                  style={{ fontFamily: 'var(--font-serif), serif' }}
                >
                  Urugo<span className={cn(transparent ? 'text-white/80' : 'text-gray-400', "font-light")}>stay</span>
                </span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-1">Hosting Mode</span>
              </div>
            ) : (
              <Link href="/" className="group">
                <span 
                  className={cn(
                    'text-2xl font-serif tracking-tight transition-colors duration-300',
                    transparent ? 'text-white' : 'text-[var(--luxury-green)]'
                  )}
                  style={{ fontFamily: 'var(--font-serif), serif' }}
                >
                  Urugo<span className={cn(transparent ? 'text-white/80' : 'text-gray-400', "font-light")}>stay</span>
                </span>
              </Link>
            )}
          </div>

          {/* Center Links - Editorial Focus (Hidden in Host Mode) */}
          <div className={cn(
            "hidden lg:flex flex-[2] items-center justify-center space-x-12",
            isHostMode && "lg:hidden"
          )}>
            {[
              { label: 'Guesthouses', href: '/search?type=Guesthouse' },
              { label: 'Hotels', href: '/search?type=Hotel' }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300',
                  transparent ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-[var(--luxury-green)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={() => {
                const event = new CustomEvent('open-urugo-assistant');
                window.dispatchEvent(event);
              }}
              className={cn(
                'flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-300 px-4 py-2 rounded-full border',
                transparent 
                  ? 'text-white/70 border-white/20 hover:bg-white/10' 
                  : 'text-gray-400 border-gray-100 hover:text-[var(--luxury-green)] hover:bg-gray-50'
              )}
            >
              <Sparkles className="w-3 h-3" />
              Urugo AI
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex-1 flex items-center justify-end gap-6 sm:gap-8">
            {(!isHostMode && user?.role !== 'admin') && (
              <>
                <Link
                  href={user?.role === 'owner' ? "/owner/dashboard" : "/become-a-host"}
                  onClick={() => {
                    if (user?.role === 'owner') {
                      setHostMode(true)
                    }
                  }}
                  className={cn(
                    'hidden md:block text-[10px] font-black uppercase tracking-[0.2em] transition-all',
                    transparent ? 'text-white/80 hover:text-white' : 'text-[var(--luxury-green)] hover:opacity-70'
                  )}
                >
                  {user?.role === 'owner' ? 'Switch to Host' : t('nav.become_host')}
                </Link>

                <Link href="/wishlist">
                  <Heart className={cn(
                    'w-5 h-5 transition-colors',
                    transparent ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-red-500'
                  )} />
                </Link>
              </>
            )}

            <AirbnbNavMenu 
              user={user} 
              dashboardLink={dashboardLink} 
              isTransparent={transparent}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
