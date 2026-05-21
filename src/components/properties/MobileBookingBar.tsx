'use client'

import { useState, useMemo, useEffect } from 'react'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { useSettings } from '@/context/SettingsContext'
import { Star, Calendar, Users, Minus, Plus, ChevronDown, X, ArrowRight, Sparkles } from 'lucide-react'
import { startOfToday, addDays, format, differenceInDays } from 'date-fns'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { ensureWholeUnitRoom } from '@/lib/rooms/ensureWholeUnitRoom'
import { toast } from 'sonner'

interface MobileBookingBarProps {
  property: Property
  rooms: Room[]
  averageRating: number
  reviewCount: number
}

export function MobileBookingBar({ property, rooms, averageRating, reviewCount }: MobileBookingBarProps) {
  const { data: session } = useSession()
  const user = session?.user
  const { formatPrice, t } = useSettings()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '')
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(startOfToday(), 1),
    to: addDays(startOfToday(), 3),
  })
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const [step, setStep] = useState<'dates' | 'guests' | 'room' | 'summary'>('dates')
  const [rateType, setRateType] = useState<'daily' | 'monthly'>(
    property.offers_monthly && !property.offers_daily ? 'monthly' : 'daily'
  )

  const isWholeUnitNoRoom = property.is_whole_unit && rooms.length === 0
  const effectiveDailyPrice = Number(property.daily_price) || Number(property.starting_price) || 0
  
  const selectedRoom = useMemo(() => rooms.find(r => r.id === selectedRoomId), [rooms, selectedRoomId])
  
  const monthlyPrice = useMemo(() => {
    return selectedRoom?.monthly_price || property.monthly_price
  }, [selectedRoom, property.monthly_price])

  useEffect(() => {
    if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id)
    }
  }, [rooms, selectedRoomId])

  const totalGuests = guests.adults + guests.children
  const maxCapacity = selectedRoom?.capacity || property.max_guests || 10

  
  const displayPrice = useMemo(() => {
    if (rateType === 'monthly' && monthlyPrice) {
      return Math.round(monthlyPrice / 30)
    }
    return (Number(selectedRoom?.price_per_night) || effectiveDailyPrice || 0)
  }, [rateType, monthlyPrice, selectedRoom, effectiveDailyPrice])


  const nights = dateRange.from && dateRange.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : 0
  
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

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => {
      const newVal = prev[type] + delta
      if (type === 'adults' && newVal < 1) return prev
      if (newVal < 0) return prev
      const newGuests = { ...prev, [type]: newVal }
      if (type !== 'infants' && newGuests.adults + newGuests.children > maxCapacity) return prev
      return newGuests
    })
  }

  const handleReserve = async () => {
    if (!dateRange.from || !dateRange.to) return

    if (!user) {
      toast.error('Please sign in to continue with your booking.')
      const params = new URLSearchParams()
      params.set('redirect', `/properties/${property.id}`)
      router.push(`/login?${params.toString()}`)
      return
    }

    if (selectedRoomId) {
      const params = new URLSearchParams()
      params.set('checkIn', dateRange.from.toISOString())
      params.set('checkOut', dateRange.to.toISOString())
      params.set('guests', totalGuests.toString())
      router.push(`/bookings/confirm/${selectedRoomId}?${params.toString()}`)
      return
    }

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

  const openModal = () => {
    setStep('dates')
    setShowModal(true)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 safe-bottom">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-lg font-black text-gray-900 tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              <span className="text-xs font-medium text-gray-500 mb-0.5">/ night</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Star className="w-3 h-3 text-[var(--accent)] fill-current" />
              <span className="font-bold text-gray-900">{(averageRating > 0 ? averageRating : 5.0).toFixed(1)}</span>
              <span>· {reviewCount} reviews</span>
            </div>
          </div>
          <button
            onClick={openModal}
            className="px-7 py-3 bg-[var(--primary)] text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-95 transition-all"
          >
            Reserve
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] lg:hidden"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[90] lg:hidden"
            >
              <div className="bg-white rounded-t-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-[2rem]">
                  <div>
                    <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.2em]">
                      {step === 'dates' && (property.is_whole_unit ? 'Step 1 of 3' : 'Step 1 of 4')}
                      {step === 'guests' && (property.is_whole_unit ? 'Step 2 of 3' : 'Step 2 of 4')}
                      {step === 'room' && 'Step 3 of 4'}
                      {step === 'summary' && (property.is_whole_unit ? 'Step 3 of 3' : 'Step 4 of 4')}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {step === 'dates' && 'Select Dates'}
                      {step === 'guests' && 'Number of Guests'}
                      {step === 'room' && 'Choose Room'}
                      {step === 'summary' && 'Review Booking'}
                    </h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-5">
                  {step === 'dates' && (
                    <div className="space-y-5">
                      <div className="flex justify-center bg-gray-50 rounded-2xl border border-gray-100 p-2">
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
                      </div>

                      {rateType === 'monthly' && dateRange.from && (
                        <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar">
                          {[1, 2, 3].map(m => (
                            <button
                              key={m}
                              onClick={() => setDateRange({ from: dateRange.from, to: addDays(dateRange.from!, m * 30) })}
                              className="whitespace-nowrap px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500 active:bg-[var(--primary)] active:text-white transition-all"
                            >
                              {m} Month{m > 1 ? 's' : ''}
                            </button>
                          ))}
                        </div>
                      )}


                      {property.offers_daily && property.offers_monthly && (
                        <div className="flex p-1 bg-gray-100/50 border border-gray-100 rounded-2xl">
                          <button
                            onClick={() => setRateType('daily')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              rateType === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                            }`}
                          >
                            Daily Rate
                          </button>
                          <button
                            onClick={() => setRateType('monthly')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              rateType === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                            }`}
                          >
                            Monthly Rate
                          </button>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-4 text-xs font-bold text-[var(--primary)]">
                          <span>In: {dateRange.from ? format(dateRange.from, 'MMM d') : '--'}</span>
                          <span>Out: {dateRange.to ? format(dateRange.to, 'MMM d') : '--'}</span>
                        </div>
                        {nights > 0 && <span className="text-xs font-bold text-gray-400">{nights} night{nights > 1 ? 's' : ''}</span>}
                      </div>
                      <button
                        onClick={() => setStep('guests')}
                        disabled={!dateRange.from || !dateRange.to}
                        className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        Next <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {step === 'guests' && (
                    <div className="space-y-5">
                      {[
                        { key: 'adults' as const, label: 'Adults', sub: 'Ages 13+' },
                        { key: 'children' as const, label: 'Children', sub: 'Ages 2–12' },
                        { key: 'infants' as const, label: 'Infants', sub: 'Under 2' },
                      ].map(({ key, label, sub }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-bold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-400">{sub}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateGuest(key, -1)}
                              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] transition-all disabled:opacity-30 active:scale-90"
                              disabled={guests[key] <= (key === 'adults' ? 1 : 0)}
                            >
                              <Minus className="w-4 h-4 text-gray-500" />
                            </button>
                            <span className="w-6 text-center font-black text-gray-900 tabular-nums">{guests[key]}</span>
                            <button
                              onClick={() => updateGuest(key, 1)}
                              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[var(--primary)] transition-all active:scale-90"
                              disabled={key !== 'infants' && totalGuests >= maxCapacity}
                            >
                              <Plus className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => setStep('dates')} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 active:scale-[0.98] transition-all">
                          Back
                        </button>
                        <button
                          onClick={() => property.is_whole_unit ? setStep('summary') : setStep('room')}
                          className="flex-1 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          {property.is_whole_unit ? 'Review' : 'Next'} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'room' && !property.is_whole_unit && (
                    <div className="space-y-3">
                      {rooms.map(room => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`w-full p-4 text-left rounded-2xl transition-all border-2 ${
                            selectedRoomId === room.id
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-900">{room.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{room.capacity} guests · {room.bed_type}</p>
                            </div>
                            <span className="text-base font-bold text-[var(--primary)]">{formatPrice(room.price_per_night)}<span className="text-xs text-gray-400 font-medium"> /night</span></span>
                          </div>
                        </button>
                      ))}
                      <div className="flex gap-3 pt-3">
                        <button onClick={() => setStep('guests')} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 active:scale-[0.98] transition-all">
                          Back
                        </button>
                        <button
                          onClick={() => setStep('summary')}
                          className="flex-1 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          Review <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 'summary' && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Property</span>
                          <span className="font-bold text-gray-900 text-right max-w-[200px] truncate">{property.name}</span>
                        </div>
                        {!property.is_whole_unit && selectedRoom && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Room</span>
                            <span className="font-bold text-gray-900">{selectedRoom.name}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Dates</span>
                          <span className="font-bold text-gray-900">
                            {dateRange.from && format(dateRange.from, 'MMM d')} – {dateRange.to && format(dateRange.to, 'MMM d')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Guests</span>
                          <span className="font-bold text-gray-900">{totalGuests} guest{totalGuests > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        {isMonthlyMode ? (
                          <>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 mb-2">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Rate Applied</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-600">
                              <span>
                                {formatPrice(monthlyPrice || 0)} × {nights} nights (pro-rata)
                              </span>
                              <span>{formatPrice(basePrice)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-sm font-medium text-gray-600">
                            <span>{formatPrice(displayPrice)} × {nights} nights</span>
                            <span>{formatPrice(basePrice)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium text-gray-600">
                          <span>Service fee</span>
                          <span>{formatPrice(serviceFee)}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-lg">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button onClick={() => property.is_whole_unit ? setStep('guests') : setStep('room')} className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-sm text-gray-600 active:scale-[0.98] transition-all">
                          Back
                        </button>
                        <button
                          onClick={handleReserve}
                          disabled={creatingRoom}
                          className="flex-1 py-4 bg-[var(--primary)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {creatingRoom ? 'Preparing...' : 'Reserve Now'}
                        </button>
                      </div>
                      <p className="text-center text-xs text-gray-400 mt-1">You won't be charged yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
