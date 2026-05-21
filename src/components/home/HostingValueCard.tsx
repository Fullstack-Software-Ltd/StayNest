'use client'

import { ArrowRight, Home, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { useSettings } from '@/context/SettingsContext'
import Link from 'next/link'

interface HostingValueCardProps {
  stats: {
    reviewCount: number
    hostCount: number
    propertyCount: number
    bookingCount: number
    guestCount: number
  }
}

export function HostingValueCard({ stats }: HostingValueCardProps) {
  const { t } = useSettings()

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative group overflow-hidden bg-[var(--primary-dark)] rounded-[3rem] p-8 sm:p-16 lg:p-20 shadow-2xl shadow-[var(--primary)]/20">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/40 to-transparent z-0" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[var(--accent)]/10 rounded-full blur-[100px] z-0" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                 <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">Opportunity Awaits</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter text-pretty">
                Turn your home into an <span className="text-gradient animate-gold-shimmer italic">investment.</span>
              </h2>
              
              <p className="text-lg text-white/60 leading-relaxed font-medium max-w-xl text-pretty">
                Join our elite community of Rwandan hosts. Whether it's a cozy room or a luxury villa, we provide the tools to reach global travelers and earn exceptional income.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/become-a-host">
                  <Button variant="secondary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    {t('home.cta.button')}
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline" size="xl" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20">
                    How it works
                  </Button>
                </Link>
              </div>
            </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { 
                    icon: TrendingUp, 
                    label: 'Expert Hosts', 
                    val: stats.hostCount.toString(), 
                    sub: 'Verified Community' 
                  },
                  { 
                    icon: Users, 
                    label: 'Guest Activity', 
                    val: stats.guestCount > 1000 ? `${(stats.guestCount / 1000).toFixed(1)}k+` : stats.guestCount.toString(), 
                    sub: 'Active Travelers' 
                  },
                  { 
                    icon: Home, 
                    label: 'Approved Houses', 
                    val: stats.propertyCount.toString(), 
                    sub: 'Vetted Listings' 
                  },
                  { 
                    icon: Sparkles, 
                    label: 'Total Stays', 
                    val: stats.bookingCount.toString(), 
                    sub: 'Successful Bookings' 
                  }
                ].map((stat, i) => (
                <div 
                  key={i} 
                  className="p-6 sm:p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group/stat hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <stat.icon className="w-6 h-6 text-[var(--accent)] mb-6 opacity-60 group-hover/stat:opacity-100 transition-opacity" />
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white tracking-tighter">{stat.val}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest mt-2">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
