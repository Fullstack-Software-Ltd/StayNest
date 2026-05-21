'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import { Star, ChevronDown, Plus, Minus, Users, X, Sparkles } from 'lucide-react'
import { startOfToday, addDays, format, differenceInDays } from 'date-fns'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { ensureWholeUnitRoom } from '@/lib/rooms/ensureWholeUnitRoom'
import { toast } from 'sonner'

interface PropertyStickyBookingProps {
  property: Property
  rooms: Room[]
  averageRating: number
  reviewCount: number
}

export function PropertyStickyBooking({ property, rooms, averageRating, reviewCount }: PropertyStickyBookingProps) {
  const { data: session } = useSession()
  const currentUser = session?.user
  const { formatPrice, t } = useSettings()
  const router = useRouter()

  // For whole-unit properties with no rooms, we'll create a virtual room on-the-fly
  const isWholeUnitNoRoom = property.is_whole_unit && rooms.length === 0
  
  // Robust price lookup: prioritize daily_price, then starting_price
  const effectiveDailyPrice = Number(property.daily_price) || Number(property.starting_price) || 0
  
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '')
  
  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId])
  
  const monthlyPrice = useMemo(() => {
    return selectedRoom?.monthly_price || property.monthly_price
  }, [selectedRoom, property.monthly_price])

  const [showCalendar, setShowCalendar] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [showRoomPicker, setShowRoomPicker] = useState(false)
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: addDays(startOfToday(), 1),
    to: addDays(startOfToday(), 3)
  })
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const [rateType, setRateType] = useState<'daily' | 'monthly'>(
    property.offers_monthly && !property.offers_daily ? 'monthly' : 'daily'
  )
  
  const calendarRef = useRef<HTMLDivElement>(null)
  const guestRef = useRef<HTMLDivElement>(null)
  const roomRef = useRef<HTMLDivElement>(null)
  
  const totalGuests = guests.adults + guests.children
  const maxCapacity = selectedRoom?.capacity || property.max_guests || 10
  
  const displayPrice = useMemo(() => {
    if (rateType === 'monthly' && monthlyPrice) {
      return Math.round(monthlyPrice / 30)
    }
    return Number(selectedRoom?.price_per_night) || effectiveDailyPrice || 0
  }, [rateType, monthlyPrice, selectedRoom, effectiveDailyPrice])


  const nights = useMemo(() => {
    if (dateRange.from && dateRange.to) {
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from))
    }
    return 0
  }, [dateRange])
  
  const isMonthlyMode = rateType === 'monthly' && monthlyPrice
  
  const basePrice = useMemo(() => {
    if (nights === 0) return 0
    
    if (isMonthlyMode && monthlyPrice) {
      const proRataDailyRate = monthlyPrice / 30
      return Math.round(nights * proRataDailyRate)
    }
    
    return displayPrice * nights
  }, [displayPrice, monthlyPrice, nights, isMonthlyMode])

  const serviceFee = Math.round(basePrice * 0.1)
  const total = basePrice + serviceFee

  // Sync selected room if empty and rooms load
  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id)
    }
  }, [rooms, selectedRoomId])

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) setShowCalendar(false)
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestPicker(false)
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) setShowRoomPicker(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => {
      const newVal = prev[type] + delta
      if (type === 'adults' && newVal < 1) return prev
      if (newVal < 0) return prev
      const newGuests = { ...prev, [type]: newVal }
      if (newGuests.adults + newGuests.children > maxCapacity) return prev
      return newGuests
    })
  }

  const handleReserve = async () => {
    if (!dateRange.from || !dateRange.to) return

    if (!currentUser) {
      toast.error('Please sign in to continue with your booking.')
      const params = new URLSearchParams()
      params.set('redirect', `/properties/${property.id}`)
      router.push(`/login?${params.toString()}`)
      return
    }

    // If there's a room already selected, go straight to checkout
    if (selectedRoomId) {
      const params = new URLSearchParams()
      params.set('checkIn', dateRange.from.toISOString())
      params.set('checkOut', dateRange.to.toISOString())
      params.set('guests', totalGuests.toString())
      router.push(`/bookings/confirm/${selectedRoomId}?${params.toString()}`)
      return
    }

    // Whole-unit property with no rooms — auto-create one on-the-fly
    if (isWholeUnitNoRoom) {
      setCreatingRoom(true)
      try {
        const targetRoomId = await ensureWholeUnitRoom(property.id)

        const params = new URLSearchParams()
        params.set('checkIn', dateRange.from!.toISOString())
        params.set('checkOut', dateRange.to!.toISOString())
        params.set('guests', totalGuests.toString())
        router.push(`/bookings/confirm/${targetRoomId}?${params.toString()}`)
      } catch (err) {
        console.error('Auto room creation failed:', err)
        toast.error('Something went wrong. Please try again.')
      } finally {
        setCreatingRoom(false)
      }
      return
    }

    toast.error('Please select a room to continue.')
  }

  return (
    <Card className="rounded-[2rem] border border-gray-100 shadow-xl shadow-black/[0.04] p-6 lg:p-8 bg-white sticky top-28">
      <CardContent className="p-0">
        {/* Price + Rating Header */}
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {formatPrice(displayPrice)}
            </span>
            <span className="text-sm font-medium text-gray-500 mb-1">/ night</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
            <Star className="w-4 h-4 text-[var(--accent)] fill-current" />
            {averageRating > 0 ? averageRating.toFixed(1) : 'New'} 
            <span className="text-gray-400 font-medium font-normal underline decoration-gray-300">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>

        {/* ─── Booking Inputs ──────────────────────── */}
        <div className="border border-gray-300 rounded-2xl overflow-visible mb-6 relative">
          {/* Date Row */}
          <div className="flex w-full divide-x divide-gray-300 border-b border-gray-300 relative" ref={calendarRef}>
            <button 
              onClick={() => { setShowCalendar(!showCalendar); setShowGuestPicker(false); setShowRoomPicker(false) }}
              className="flex-1 p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Check-in</div>
              <div className="text-sm text-gray-500 font-medium">
                {dateRange.from ? format(dateRange.from, 'MMM dd, yyyy') : 'Add date'}
              </div>
            </button>
            <button 
               onClick={() => { setShowCalendar(!showCalendar); setShowGuestPicker(false); setShowRoomPicker(false) }}
               className="flex-1 p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Checkout</div>
              <div className="text-sm text-gray-500 font-medium">
                 {dateRange.to ? format(dateRange.to, 'MMM dd, yyyy') : 'Add date'}
              </div>
            </button>

            {/* Calendar Popover */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl p-2"
                >
                  <CalendarUI
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (rateType === 'monthly' && range?.from && !range?.to) {
                        // If monthly mode, suggest a 30 day stay automatically
                        setDateRange({ from: range.from, to: addDays(range.from, 30) })
                      } else {
                        setDateRange({ from: range?.from, to: range?.to })
                      }
                    }}
                    numberOfMonths={1}
                    disabled={(date) => date < startOfToday()}
                    className="mx-auto"
                  />
                  
                  {rateType === 'monthly' && dateRange.from && (
                    <div className="flex gap-2 p-2 border-t border-gray-100 overflow-x-auto no-scrollbar">
                      {[1, 2, 3].map(m => (
                        <button
                          key={m}
                          onClick={() => setDateRange({ from: dateRange.from, to: addDays(dateRange.from!, m * 30) })}
                          className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 hover:bg-[var(--primary)] hover:text-white transition-all"
                        >
                          {m} Month{m > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400">
                        {nights > 0 && `${nights} night${nights > 1 ? 's' : ''} selected`}
                      </span>
                      {rateType === 'monthly' && nights < 30 && nights > 0 && (
                        <span className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-wider">
                          Short stays use pro-rata rate
                        </span>
                      )}
                    </div>
                    <button onClick={() => setShowCalendar(false)} className="text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline">Close</button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guest Row */}
          <div className="relative border-b border-gray-300" ref={guestRef}>
            <button 
              onClick={() => { setShowGuestPicker(!showGuestPicker); setShowCalendar(false); setShowRoomPicker(false) }}
              className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Guests</div>
                <div className="text-sm text-gray-500 font-medium">
                  {guests.adults} adult{guests.adults > 1 ? 's' : ''}
                  {guests.children > 0 && `, ${guests.children} child${guests.children > 1 ? 'ren' : ''}`}
                  {guests.infants > 0 && `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} />
            </button>

            {/* Guest Picker Popover */}
            <AnimatePresence>
              {showGuestPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl p-5 space-y-4"
                >
                  {[
                    { key: 'adults' as const, label: 'Adults', sub: 'Ages 13+' },
                    { key: 'children' as const, label: 'Children', sub: 'Ages 2–12' },
                    { key: 'infants' as const, label: 'Infants', sub: 'Under 2' },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateGuest(key, -1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 active:scale-90"
                          disabled={guests[key] <= (key === 'adults' ? 1 : 0)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-black text-gray-900 tabular-nums text-sm">
                          {guests[key]}
                        </span>
                        <button
                          onClick={() => updateGuest(key, 1)}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-gray-400 hover:text-[var(--primary)] active:scale-90"
                          disabled={key !== 'infants' && totalGuests >= maxCapacity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-gray-400 font-medium pt-1">
                    This place accommodates up to {maxCapacity} guest{maxCapacity > 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => setShowGuestPicker(false)}
                    className="w-full py-2.5 text-sm font-bold text-[var(--primary)] underline-offset-4 hover:underline transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Room Selector Row — hide for whole-unit properties */}
          {!property.is_whole_unit && (
            <div className="relative border-b border-gray-300" ref={roomRef}>
              <button 
                onClick={() => { setShowRoomPicker(!showRoomPicker); setShowCalendar(false); setShowGuestPicker(false) }}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-900 tracking-widest mb-0.5">Room</div>
                  <div className="text-sm text-gray-500 font-medium">
                    {selectedRoom?.name || 'Select a room'} {selectedRoom && `· ${selectedRoom.capacity} guests`}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showRoomPicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Room Picker Popover */}
              <AnimatePresence>
                {showRoomPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 space-y-1 max-h-60 overflow-y-auto"
                  >
                    {rooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => { setSelectedRoomId(room.id); setShowRoomPicker(false) }}
                        className={`w-full p-3 text-left rounded-xl transition-all flex items-center justify-between ${
                          selectedRoomId === room.id
                            ? 'bg-[var(--primary)]/5 border border-[var(--primary)]/20'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">{room.name}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{room.capacity} guests · {room.bed_type}</p>
                        </div>
                        <span className="text-sm font-bold text-[var(--primary)]">{formatPrice(room.price_per_night)}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Rate Selection Toggle (If both daily and monthly are offered) */}
          {property.offers_daily && property.offers_monthly && (
            <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-2xl mb-6">
              <button
                onClick={() => setRateType('daily')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  rateType === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Daily Rate
              </button>
              <button
                onClick={() => setRateType('monthly')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  rateType === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Monthly Rate
              </button>
            </div>
          )}
        </div>

        {/* Reserve Button */}
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleReserve}
          disabled={creatingRoom || (!selectedRoomId && !isWholeUnitNoRoom)}
          className="w-full py-6 rounded-xl font-black uppercase tracking-widest shadow-md shadow-[var(--primary)]/10 text-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingRoom ? 'Preparing...' : 'Reserve'}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4 mb-6 leading-relaxed text-balance">
          You won't be charged yet
        </p>

          {/* Price Breakdown */}
          <AnimatePresence>
            {basePrice > 0 && nights > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 text-gray-600">
                  {isMonthlyMode ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Monthly Rate Applied</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="underline decoration-gray-300 underline-offset-2">
                          {formatPrice(monthlyPrice || 0)} × {nights} nights (pro-rata)
                        </span>
                        <span>{formatPrice(basePrice)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-medium">
                      <span className="underline decoration-gray-300 underline-offset-2">{formatPrice(displayPrice)} × {nights} nights</span>
                      <span>{formatPrice(basePrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="underline decoration-gray-300 underline-offset-2">StayNest service fee</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-lg">
                  <span>Total before taxes</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
