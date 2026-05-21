'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Plus, Minus, X, ChevronRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { format, addDays, isBefore, startOfToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Calendar as CalendarUI } from '@/components/ui/calendar'

interface HeroSearchBarProps {
  variant?: 'default' | 'luxury-glass'
  className?: string
}

export function HeroSearchBar({ variant = 'default', className }: HeroSearchBarProps) {
  const router = useRouter()
  const { t } = useSettings()
  
  const isLuxury = variant === 'luxury-glass'
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'guests' | null>(null)
  
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveTab(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (startDate) params.set('checkIn', startDate.toISOString())
    if (endDate) params.set('checkOut', endDate.toISOString())
    const totalGuests = guests.adults + guests.children
    if (totalGuests > 0) params.set('guests', totalGuests.toString())
    
    router.push(`/search?${params.toString()}`)
    setActiveTab(null)
  }

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
    }))
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div ref={searchBarRef} className={cn("relative z-50 w-full max-w-2xl mx-auto px-2 sm:px-0", className)}>
      {/* ─── Mobile Search Trigger ─── */}
      <div className="md:hidden">
        <button
          onClick={() => setActiveTab('where')}
          className={cn(
            "w-full flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg border text-left transition-all active:scale-[0.98]",
            isLuxury 
              ? "bg-black/20 backdrop-blur-2xl border-white/20 text-white" 
              : "bg-white/90 backdrop-blur-xl border-white/30 text-gray-900"
          )}
        >
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md",
            isLuxury ? "bg-white text-[var(--luxury-green)]" : "bg-[var(--primary)] text-white shadow-[var(--primary)]/20"
          )}>
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className={cn("text-xs font-black leading-none mb-0.5 truncate", isLuxury ? "text-white" : "text-gray-900")}>
              {destination || t('home.search.where')}
            </span>
            <span className={cn("text-[10px] font-bold leading-none truncate", isLuxury ? "text-white/60" : "text-gray-400")}>
              {startDate ? `${format(startDate, 'MMM d')}` : t('home.search.add_dates')} · {totalGuests} {t('property.guests')}
            </span>
          </div>
        </button>
      </div>

      {/* ─── Desktop/Tablet Search Bar ─── */}
      <div 
        className={cn(
          "hidden md:flex rounded-full shadow-2xl items-stretch transition-all duration-500 border",
          isLuxury 
            ? "bg-white/5 backdrop-blur-3xl border-white/10 shadow-black/20" 
            : "bg-white/90 backdrop-blur-xl border-white/40 shadow-black/[0.08]",
          activeTab ? (isLuxury ? 'ring-2 ring-white/20' : 'ring-2 ring-[var(--accent)]/30') : ''
        )}
      >
        {/* Destination */}
        <button
          onClick={() => setActiveTab('where')}
          className={cn(
            "group flex-1 flex flex-col justify-center px-6 lg:px-7 py-2.5 text-left rounded-l-full transition-all",
            activeTab === 'where' ? (isLuxury ? 'bg-white/5' : 'bg-[var(--primary)]/[0.03]') : 'hover:bg-white/5'
          )}
        >
          <span className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 drop-shadow-md",
            isLuxury ? "text-white/80" : "text-[var(--primary)]"
          )}>
            {t('home.search.where')}
          </span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('home.search.placeholder')}
            className={cn(
              "w-full text-xs font-bold bg-transparent outline-none pointer-events-none md:pointer-events-auto",
              isLuxury ? "text-white placeholder:text-white/30" : "text-gray-900 placeholder:text-gray-300"
            )}
            onClick={(e) => { if (window.innerWidth >= 768) e.stopPropagation() }}
          />
        </button>

        <div className="w-px h-8 self-center bg-[var(--primary)]/5 shrink-0" />

        {/* Dates */}
        <button
          onClick={() => setActiveTab('dates')}
          className={cn(
            "flex-1 flex flex-col justify-center px-6 lg:px-7 py-2.5 text-left transition-all",
            activeTab === 'dates' ? 'bg-[var(--primary)]/[0.03]' : 'hover:bg-gray-50/50'
          )}
        >
          <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-0.5">
            {t('home.search.check_in')} / {t('home.search.check_out')}
          </span>
          <span className={`text-xs font-bold truncate ${startDate ? 'text-gray-900' : 'text-gray-300'}`}>
            {startDate ? `${format(startDate, 'MMM d')} – ${endDate ? format(endDate, 'MMM d') : '...'}` : t('home.search.add_dates')}
          </span>
        </button>

        <div className="w-px h-8 self-center bg-[var(--primary)]/5 shrink-0" />

        {/* Guests + Search Button */}
        <div className="flex-[1.2] flex items-center pr-1.5">
          <button
            onClick={() => setActiveTab('guests')}
            className={cn(
              "flex-1 flex flex-col items-start px-6 lg:px-7 py-2.5 transition-all text-left group rounded-none",
              activeTab === 'guests' ? (isLuxury ? 'bg-white/5' : 'bg-[var(--primary)]/[0.03]') : 'hover:bg-white/5'
            )}
          >
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] mb-0.5 drop-shadow-md",
              isLuxury ? "text-white/80" : "text-[var(--primary)]"
            )}>{t('home.search.guests')}</span>
            <div className="flex items-center gap-2">
              <Users className={cn("w-3 h-3 group-hover:scale-110 transition-transform", isLuxury ? "text-white/60" : "text-[var(--accent)]")} />
              <span className={cn("text-xs font-bold truncate", isLuxury ? "text-white" : "text-gray-900")}>
                {totalGuests} {totalGuests === 1 ? t('property.guest') : t('property.guests')}
              </span>
            </div>
          </button>

          <button
            onClick={handleSearch}
            className={cn(
              "w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 group shrink-0 hover:shadow-xl",
              isLuxury 
                ? "bg-white text-[var(--luxury-green)] hover:bg-white/90" 
                : "bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-[var(--primary)]/30"
            )}
          >
            <Search className="w-3 h-3 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* ─── Popovers ─── */}
      <AnimatePresence>
        {activeTab && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={cn(
                "z-[70] pointer-events-none",
                /* Mobile: fixed bottom sheet */
                "fixed bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto",
                /* Desktop: absolute dropdown ABOVE the bar */
                "md:absolute md:bottom-full md:mb-3 md:w-full"
              )}
            >
              <div className={cn(
                "luxury-glass shadow-2xl overflow-hidden pointer-events-auto w-full",
                /* Mobile: bottom sheet with top radius only */
                "rounded-t-[2rem] max-h-[70vh] overflow-y-auto",
                /* Desktop: full radius with smaller max-width */
                "md:rounded-[2.5rem] md:max-h-none md:max-w-md md:mx-auto border-white/20"
              )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:pt-6 sm:pb-4 border-b border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-[var(--luxury-gold)] uppercase tracking-[0.3em] mb-1">
                      {activeTab === 'where' && 'Destination'}
                      {activeTab === 'dates' && 'Timeline'}
                      {activeTab === 'guests' && 'Travelers'}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-serif italic text-[var(--luxury-green)] tracking-tight">
                      {activeTab === 'where' && t('home.search.where')}
                      {activeTab === 'dates' && 'Select Dates'}
                      {activeTab === 'guests' && t('home.search.guests')}
                    </h3>
                  </div>
                  <button onClick={() => setActiveTab(null)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:pb-8">
                  {/* Where */}
                  {activeTab === 'where' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--luxury-gold)] opacity-60" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder={t('home.search.placeholder')}
                          autoFocus
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--luxury-gold)]/5 bg-[var(--luxury-cream)]/5 text-xs font-bold text-gray-900 outline-none focus:border-[var(--luxury-gold)]/20 focus:ring-4 focus:ring-[var(--luxury-gold)]/5 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <p className="text-[8px] text-[var(--luxury-gold)] font-black uppercase tracking-[0.25em] mb-2">Popular Discoveries</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Kigali', 'Musanze', 'Gisenyi', 'Butare'].map((city) => (
                          <button
                            key={city}
                            onClick={() => { setDestination(city); setActiveTab('dates') }}
                            className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-[var(--luxury-gold)]/30 hover:bg-[var(--luxury-cream)]/10 transition-all text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors shrink-0 border border-gray-100/50">
                              <MapPin className="w-3.5 h-3.5 text-[var(--luxury-green)]" />
                            </div>
                            <span className="font-bold text-gray-900 text-xs">{city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  {activeTab === 'dates' && (
                    <div className="space-y-3">
                      <div className="flex justify-center bg-white/50 backdrop-blur-xl rounded-xl border border-[var(--luxury-gold)]/10 p-1 shadow-sm overflow-hidden scale-90 sm:scale-100">
                        <CalendarUI
                          mode="range"
                          selected={{
                            from: startDate || undefined,
                            to: endDate || undefined,
                          }}
                          onSelect={(range) => {
                            setStartDate(range?.from || null)
                            setEndDate(range?.to || null)
                          }}
                          numberOfMonths={1}
                          disabled={(date) => date < startOfToday()}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-[10px] font-black text-[var(--luxury-green)] flex gap-4 uppercase tracking-widest">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] text-gray-400">Arrive</span>
                            <span>{startDate ? format(startDate, 'MMM d') : '--'}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] text-gray-400">Depart</span>
                            <span>{endDate ? format(endDate, 'MMM d') : '--'}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('guests')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[var(--luxury-green)] text-white rounded-full font-black text-[8px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                          disabled={!startDate}
                        >
                          Guests <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  {activeTab === 'guests' && (
                    <div className="space-y-2">
                      {[
                        { key: 'adults', label: 'Adults', sub: '13+' },
                        { key: 'children', label: 'Children', sub: '2–12' },
                        { key: 'infants', label: 'Infants', sub: 'Under 2' },
                      ].map(({ key, label, sub }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="font-serif italic text-gray-900 text-sm">{label}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{sub}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateGuest(key as any, -1)}
                              className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:border-[var(--luxury-gold)]/30 hover:bg-[var(--luxury-gold)]/5 transition-all text-gray-400 hover:text-[var(--luxury-gold)] disabled:opacity-30 active:scale-90"
                              disabled={guests[key as keyof typeof guests] <= (key === 'adults' ? 1 : 0)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center font-black text-gray-900 tabular-nums text-xs">
                              {guests[key as keyof typeof guests]}
                            </span>
                            <button
                              onClick={() => updateGuest(key as any, 1)}
                              className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center hover:border-[var(--luxury-gold)]/30 hover:bg-[var(--luxury-gold)]/5 transition-all text-gray-400 hover:text-[var(--luxury-gold)] active:scale-90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4">
                        <button 
                          onClick={() => handleSearch()}
                          className="w-full px-6 py-3 bg-[var(--luxury-green)] text-white rounded-xl font-black hover:scale-[1.01] shadow-xl transition-all text-[9px] uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Search className="w-3 h-3" />
                          {t('home.search.search_btn')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
