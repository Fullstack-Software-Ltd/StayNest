'use client'

import { Star, Shield, Headphones, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroSearchBar } from './HeroSearchBar'
import { Button } from '@/components/shared/Button'
import { useSettings } from '@/context/SettingsContext'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface HomeHeroProps {
  stats: {
    reviewCount: number
    hostCount: number
    propertyCount: number
    bookingCount: number
    guestCount: number
  }
}

export function HomeHero({ stats }: HomeHeroProps) {
  const { t, isHostMode } = useSettings()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = 0.8
      const handleCanPlay = () => setVideoLoaded(true)
      video.addEventListener('canplaythrough', handleCanPlay)
      return () => video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [])

  return (
    <section className="relative w-full min-h-screen flex flex-col">
      
      {/* ─── Background Layer (Video + Simple Background) ─── */}
      <div className="absolute inset-0 z-0 bg-[var(--luxury-green)]">
        <div className="relative w-full h-full overflow-hidden">
          {/* Looping Background Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            suppressHydrationWarning={true}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]" />
          <div className="absolute inset-0 bg-black/10 z-[1]" />
        </div>
      </div>

      {/* ─── Content Grid ─────────────────────── */}
      <div className="relative z-10 flex-1 flex items-end pb-32 px-8 sm:px-12 lg:px-20 max-w-[1440px] mx-auto w-full">
        
        {/* Left: Main Editorial Headline */}
        <div className="w-full lg:max-w-[60%] mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 
              className="text-white drop-shadow-2xl font-serif text-4xl lg:text-6xl leading-[0.9] max-w-2xl lg:max-w-3xl"
              style={{ fontFamily: 'var(--font-serif), serif' }}
            >
              {isHostMode ? (
                <>
                  Management <br />
                  <span className="hero-accent-text block sm:inline">
                    Excellence.
                  </span>
                </>
              ) : (
                <>
                  The Standard of Your Next{' '}
                  <span className="hero-accent-text block sm:inline">
                    Stay.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-8 text-base sm:text-lg text-white/90 font-medium max-w-lg leading-relaxed drop-shadow-md">
              {isHostMode 
                ? "Oversee your curated collection of sanctuaries and manage guest experiences with precision."
                : "Experience Rwanda through a curated selection of the country's most distinctive homes and resorts."}
            </p>

            <div className="mt-12 w-full">
              {isHostMode ? (
                <div className="flex flex-wrap gap-4">
                  <Link href="/owner/dashboard">
                    <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-[var(--luxury-gold)] hover:text-white border-none transition-all font-black uppercase tracking-widest text-xs">
                      Hosting Dashboard
                    </Button>
                  </Link>
                  <Link href="/owner/properties">
                    <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-white/20 text-white backdrop-blur-md hover:bg-white/10 font-black uppercase tracking-widest text-xs">
                      Manage My Listings
                    </Button>
                  </Link>
                </div>
              ) : (
                <HeroSearchBar variant="luxury-glass" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Floating PIP Image (Luxury Booking Focus) */}
        <motion.div 
          className="hidden lg:block absolute right-12 xl:right-24 top-[48%] w-52 xl:w-60 aspect-[3/4.5] z-20"
          initial={{ opacity: 0, rotate: 12, x: 50 }}
          animate={{ opacity: 1, rotate: 6, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Link href="/search?category=Luxury" className="group block relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/10 backdrop-blur-sm transition-transform hover:scale-105 duration-500">
            <Image
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=90"
              alt="Luxury suite interior"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div className="text-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">Signature Stay</p>
                <p className="text-sm font-serif italic">The Bamboo Glasshouse</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
