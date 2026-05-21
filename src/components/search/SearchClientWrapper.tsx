'use client'

import { useState } from 'react'
import { PropertySearchResult } from '@/types/search'
import { SearchFilters } from '@/components/search/SearchFilters'
import { PropertyResultCard } from '@/components/search/PropertyResultCard'
import { EmptyState } from '@/components/shared/empty-state'
import { MapPin, Map, List, SlidersHorizontal, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { MAP_CONFIG } from '@/lib/maps/map-config'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

// Dynamic imports for Leaflet (client-side only)
const MapView = dynamic(() => import('@/components/maps/map-view'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 animate-pulse rounded-3xl border border-gray-100 flex items-center justify-center">
      <span className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Loading Map...</span>
    </div>
  )
})

const MapMarker = dynamic(() => import('@/components/maps/map-marker'), { ssr: false })

interface SearchClientWrapperProps {
  results: (PropertySearchResult & { latitude?: number | null; longitude?: number | null })[]
  hasActiveFilters: boolean
  destination?: string
  totalCount: number
}

export function SearchClientWrapper({ results, hasActiveFilters, destination, totalCount }: SearchClientWrapperProps) {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const searchParams = useSearchParams()

  // Count active filters
  const activeFilterCount = ['type', 'minPrice', 'maxPrice', 'capacity'].filter(
    key => searchParams.get(key)
  ).length

  // Filter properties that have coordinates for the map
  const mapResults = results.filter(p => p.latitude && p.longitude)
  const defaultCenter = mapResults.length > 0 
    ? [Number(mapResults[0].latitude), Number(mapResults[0].longitude)] as [number, number]
    : MAP_CONFIG.DEFAULT_CENTER

  return (
    <>
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-8 py-6">
        
        {/* Left Column: Filters and Results */}
        <div className={`w-full lg:w-[60%] xl:w-[55%] flex flex-col gap-6 ${mobileView === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-balance">
                {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
              </h2>
              {destination ? (
                <p className="text-gray-500 font-medium mt-1 text-sm">
                  Showing results for <span className="text-[var(--primary)] font-bold italic underline underline-offset-4 decoration-[var(--accent)]/30">"{destination}"</span>
                </p>
              ) : (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] mt-1">Curated Stays</p>
              )}
            </div>

            {hasActiveFilters && totalCount === 0 && (
              <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl max-w-xs">
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  No results matched your filters. Try adjusting them or{' '}
                  <a href="/search" className="font-bold underline transition-colors hover:text-[var(--primary)]">clear all filters</a>.
                </p>
              </div>
            )}
          </div>

          {/* Filters — Desktop inline, Mobile button trigger */}
          <div className="hidden lg:block">
            <SearchFilters />
          </div>

          {/* Results List */}
          <div className="pb-24">
            {results.length === 0 ? (
              <div className="animate-fade-in-up mt-8">
                <EmptyState
                  variant="search"
                  actionLabel="Clear all filters"
                  actionHref="/search"
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 animate-fade-in mt-4">
                {results.map((property, i) => (
                  <div 
                    key={property.id} 
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                  >
                    <PropertyResultCard property={property} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Map — Desktop sticky, Mobile fullscreen */}
        <div className={`
          ${mobileView === 'map' ? 'block' : 'hidden'} lg:block 
          w-full lg:w-[40%] xl:w-[45%] 
          lg:sticky lg:top-[160px] lg:h-[calc(100vh-180px)] 
          h-[calc(100vh-200px)]
          z-10 transition-all duration-300
        `}>
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg shadow-black/[0.05] border border-gray-100/50 bg-white relative">
            <MapView center={defaultCenter} zoom={MAP_CONFIG.PROPERTY_ZOOM - 2}>
              {mapResults.map((property) => (
                <MapMarker 
                  key={property.id}
                  position={[Number(property.latitude), Number(property.longitude)]}
                  title={property.name}
                  price={property.starting_price || undefined}
                  image={property.main_image_url || undefined}
                  rating={property.average_rating || undefined}
                  isHighlighted={hoveredPropertyId === property.id}
                  onClick={() => {
                    // Scroll result into view if possible
                    const element = document.getElementById(`property-${property.id}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }}
                />
              ))}
            </MapView>
            
            {/* Legend if some items are missing coords */}
            {results.length > mapResults.length && results.length > 0 && (
              <div className="absolute bottom-6 left-6 z-[1000] animate-fade-in">
                <div className="bg-amber-50/95 backdrop-blur-xl border border-amber-200/60 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl shadow-amber-900/5">
                  <MapPin className="w-4 h-4 text-amber-600 drop-shadow-sm" />
                  <span className="text-[10px] font-bold text-amber-900 tracking-tight uppercase">
                    {results.length - mapResults.length} locations hidden
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Floating Controls ─────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 lg:hidden">
        {/* Filter Button */}
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-full shadow-xl shadow-black/10 text-sm font-bold text-gray-900 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Map/List Toggle */}
        <button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 px-5 py-3.5 bg-gray-900 text-white rounded-full shadow-xl shadow-black/20 text-sm font-bold active:scale-95 transition-all"
        >
          {mobileView === 'list' ? (
            <>
              <Map className="w-4 h-4" />
              Map
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              List
            </>
          )}
        </button>
      </div>

      {/* ─── Mobile Filter Bottom Sheet ───────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden"
            >
              <div className="bg-white rounded-t-[2rem] shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-6">
                  <SearchFilters />
                </div>
                <div className="p-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] transition-all"
                  >
                    Show {totalCount} results
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
