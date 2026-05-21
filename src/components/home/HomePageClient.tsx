'use client'

import { CategoryScroller } from '@/components/home/CategoryScroller'
import { HomepagePropertyCard } from '@/components/home/HomepagePropertyCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CTASection } from '@/components/home/CTASection'
import { HomeFooter } from '@/components/home/HomeFooter'
import { EmptyState } from '@/components/shared/empty-state'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { PropertySearchResult } from '@/types/search'
import { useSettings } from '@/context/SettingsContext'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { HomeHero } from '@/components/home/HomeHero'
import { AtmosphereSection } from '@/components/home/AtmosphereSection'
import { cn } from '@/utils/cn'

import { useRouter } from 'next/navigation'

interface HomePageClientProps {
  initialProperties: PropertySearchResult[]
  stats: {
    reviewCount: number
    hostCount: number
    propertyCount: number
    bookingCount: number
    guestCount: number
  }
}

export function HomePageClient({ initialProperties, stats }: HomePageClientProps) {
  const router = useRouter()
  const { t, isHostMode } = useSettings()
  const { data: session } = useSession()
  const user = session?.user

  // Separate first 4 as "featured" and the rest as regular
  const featured = initialProperties.slice(0, 4)
  const regular = initialProperties.slice(4)

  // Redirect if in host mode or if admin
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin/dashboard')
    } else if (isHostMode && user?.role === 'owner') {
      router.replace('/owner/dashboard')
    }
  }, [isHostMode, user, router])

  if (isHostMode && user?.role === 'owner') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-4 border-[var(--primary)] border-t-transparent animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Redirecting to Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">

      {/* ─── Hero ─────────────────────────────── */}
      <HomeHero stats={stats} />

      {/* ─── Categories ───────────────────────── */}
      {!isHostMode && (
        <section className="pt-6 pb-2 border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <CategoryScroller />
          </div>
        </section>
      )}

      {/* ─── Featured / Editorial Collection ─────── */}
      <section className="py-6 sm:py-10">
        <div className="max-width-luxury px-6 sm:px-12 lg:px-20">
          
          {/* Editorial Header - Asymmetric Text Layout */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-6">Handpicked Sanctuaries</span>
              <h1 
                className="text-5xl sm:text-7xl lg:text-8xl font-serif italic leading-[0.85] text-[var(--luxury-green)]"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                Discover Our <br /> Collection
              </h1>
            </div>
            
            <div className="lg:max-w-xs">
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
                A curated selection of Rwanda's most soulful stays, where heritage meets the mist-covered peaks.
              </p>
              <Link href="/search" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[var(--luxury-gold)] hover:text-[var(--luxury-green)] transition-colors">
                Explore the Archive
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Uniform Gallery Grid - 4 Columns for "Small" aesthetic */}
          {initialProperties.length === 0 ? (
            <EmptyState
              variant="search"
              title={t('home.no_results')}
              description={t('common.search.no_results_desc')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-16">
              {featured.map((property, i) => (
                <div key={property.id}>
                  <HomepagePropertyCard property={property} featured index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Atmosphere Storytelling ────────────── */}
      <AtmosphereSection />

      {/* ─── Secondary Discoveries ──────────────── */}
      {regular.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="max-width-luxury px-6 sm:px-12 lg:px-20">
            <div className="mb-20">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-6">Extended Selection</span>
               <h2 
                 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-[var(--luxury-green)]"
                 style={{ fontFamily: 'var(--font-serif), serif' }}
               >
                 Bespoke Escapes
               </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-16">
              {regular.map((property, i) => (
                <div key={property.id}>
                  <HomepagePropertyCard property={property} index={i + 4} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Share Your Sanctuary (Hosting) ─────── */}
      <section className="py-24 sm:py-32">
        <div className="max-width-luxury mx-auto px-6 sm:px-12 lg:px-20">
          <CTASection />
        </div>
      </section>

      {/* ─── Footer ───────────────────────────── */}
      <HomeFooter />
    </div>
  )
}
