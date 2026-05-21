'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { MapPin, Home, Grid, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { AnimatePresence, motion } from 'framer-motion'

interface PropertyHeaderProps {
  name: string
  address: string
  city: string
  country: string
  imageUrl: string | null
  images?: string[]
  type: string
}

export function PropertyHeader({ name, address, city, country, imageUrl, images = [], type }: PropertyHeaderProps) {
  const { t } = useSettings()
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Use main image + provided images up to 5 total for the gallery
  const displayImages = [imageUrl, ...images].filter(Boolean) as string[]
  const hasMultipleImages = displayImages.length > 1

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % displayImages.length)
  }, [displayImages.length])

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + displayImages.length) % displayImages.length)
  }, [displayImages.length])

  const openLightbox = useCallback((index: number = 0) => {
    setLightboxIndex(index)
    setShowLightbox(true)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!showLightbox) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLightbox(false)
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showLightbox, goNext, goPrev])

  return (
    <>
      <section className="bg-[var(--background)] animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2.5 flex-wrap">
                 <span className="px-3 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] border border-[var(--primary)]/10">
                  {t(`common.property_types.${type.toLowerCase()}`)}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Verified Listing</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-[0.95] text-balance">
                {name}
              </h1>
              
              <div className="flex items-center text-gray-600 text-sm sm:text-base font-medium tracking-tight">
                <MapPin className="w-4 h-4 text-[var(--accent)] mr-2 shrink-0" />
                <span className="opacity-80 underline decoration-gray-300 underline-offset-4">{address}, {city}, {country}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery Container */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
            {hasMultipleImages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[40vh] sm:h-[50vh] md:h-[60vh]">
                {/* Main Large Image */}
                <div className="relative w-full h-full cursor-pointer group" onClick={() => openLightbox(0)}>
                  <Image
                    src={displayImages[0]}
                    alt={`${name} main`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                
                {/* 4 Small Images Grid */}
                <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
                  {displayImages.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative w-full h-full cursor-pointer group" onClick={() => openLightbox(idx + 1)}>
                      <Image
                        src={img}
                        alt={`${name} photo ${idx + 2}`}
                        fill
                        sizes="25vw"
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                  ))}
                  
                  {/* Fill empty spots if less than 5 images */}
                  {Array.from({ length: Math.max(0, 4 - displayImages.slice(1, 5).length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-300">
                      <Home className="w-8 h-8 opacity-50" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full cursor-pointer group" onClick={() => openLightbox(0)}>
                {displayImages[0] ? (
                  <Image
                    src={displayImages[0]}
                    alt={name}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Home className="w-24 h-24 sm:w-32 sm:h-32 mb-4" />
                    <span className="text-xs font-semibold uppercase tracking-widest">No Image Available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
            )}
            
            {/* Show all photos button */}
            {hasMultipleImages && (
              <button 
                onClick={() => openLightbox(0)}
                className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-gray-900 border border-gray-200 shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 z-10"
              >
                <Grid className="w-4 h-4" />
                Show all photos
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Enhanced Lightbox Modal ─────────────── */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 text-white relative z-20">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold tracking-widest opacity-70">{name}</span>
                <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full">
                  {lightboxIndex + 1} / {displayImages.length}
                </span>
              </div>
              <button 
                onClick={() => setShowLightbox(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation */}
            <div className="flex-1 flex items-center justify-center relative px-4 sm:px-16">
              {/* Previous Button */}
              {displayImages.length > 1 && (
                <button
                  onClick={goPrev}
                  className="absolute left-4 sm:left-8 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Current Image */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-5xl aspect-[16/10] mx-auto"
              >
                <Image
                  src={displayImages[lightboxIndex]}
                  alt={`${name} — Photo ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>

              {/* Next Button */}
              {displayImages.length > 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-4 sm:right-8 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Strip */}
            {displayImages.length > 1 && (
              <div className="px-6 py-4 relative z-20">
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all duration-200 border-2 ${
                        idx === lightboxIndex
                          ? 'border-white scale-110 shadow-lg shadow-white/20'
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
