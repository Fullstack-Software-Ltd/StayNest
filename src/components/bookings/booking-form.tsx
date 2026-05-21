import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBooking } from '@/lib/bookings/createBooking'
import { getNightsCount, calculateBookingTotal } from '@/lib/bookings/calculateBookingTotal'
import { Calendar, Users as UsersIcon, Sparkles, ArrowRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface BookingFormProps {
  propertyId: string
  roomId: string
  roomPrice: number
  maxCapacity: number
  onDetailsChange: (details: { 
    checkIn: string, 
    checkOut: string, 
    guests: number, 
    nights: number, 
    subtotal: number,
    serviceFee: number,
    tax: number,
    total: number 
  }) => void
}

function BookingFormInner({ propertyId, roomId, roomPrice, maxCapacity, onDetailsChange }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, currency, exchangeRates, formatPrice } = useSettings()
  const [loading, setLoading] = useState(false)
  
  const hasUrlParams = searchParams.has('checkIn') && searchParams.has('checkOut')
  const [isEditing, setIsEditing] = useState(!hasUrlParams)

  // Default to tomorrow and the day after
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const afterTomorrow = new Date()
  afterTomorrow.setDate(afterTomorrow.getDate() + 2)

  const defaultCheckIn = searchParams.get('checkIn') ? searchParams.get('checkIn')!.split('T')[0] : tomorrow.toISOString().split('T')[0]
  const defaultCheckOut = searchParams.get('checkOut') ? searchParams.get('checkOut')!.split('T')[0] : afterTomorrow.toISOString().split('T')[0]
  const defaultGuests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : 1

  const [formData, setFormData] = useState({
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    guests: defaultGuests,
  })

  useEffect(() => {
    const price = roomPrice || 0
    const breakdown = calculateBookingTotal(price, formData.checkIn, formData.checkOut)
    onDetailsChange({ ...formData, ...breakdown })
  }, [formData, roomPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const price = roomPrice || 0
      const breakdown = calculateBookingTotal(price, formData.checkIn, formData.checkOut)
      
      if (isNaN(breakdown.total)) {
        throw new Error('Invalid calculation results')
      }

      const total = breakdown.total
      
      // Calculate converted total for precise payment record
      const rate = exchangeRates[currency] || 1
      const convertedTotal = total * rate

      const booking = await createBooking({
        property_id: propertyId,
        room_id: roomId,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: isNaN(formData.guests) ? 1 : formData.guests,
        total_price: total,
        currency: currency,
        converted_price: convertedTotal
      })
      router.push(`/payments/checkout/${booking.id}`)
    } catch (error: any) {
      console.error('Booking failed:', error)
      toast.error(error.message || t('booking.error_create') || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nights = getNightsCount(formData.checkIn, formData.checkOut)

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border-white/60 shadow-2xl shadow-black/[0.04]">
      <CardHeader 
        className="bg-[var(--warm-gray)]/30 px-8 py-8 sm:px-12 sm:py-10 border-b border-[var(--warm-gray)]/50"
        title={isEditing ? (t('confirm.details_title') || 'Reservation Details') : (t('confirm.review_title') || 'Review Selection')}
        icon={<Sparkles className="w-5 h-5 text-[var(--accent)]" />}
      />
      <CardContent className="p-8 sm:p-12">
        {!isEditing ? (
          // Review Mode UI
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-black/[0.02]">
               <div className="space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival</p>
                 <p className="text-sm font-bold text-gray-900">{formatDate(formData.checkIn)}</p>
               </div>
               <div className="space-y-1 sm:border-x border-gray-200 sm:px-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure</p>
                 <p className="text-sm font-bold text-gray-900">{formatDate(formData.checkOut)}</p>
               </div>
               <div className="space-y-1 sm:pl-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guests</p>
                 <p className="text-sm font-bold text-gray-900">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs font-black text-[var(--primary)] uppercase tracking-widest hover:underline underline-offset-8 decoration-2"
              >
                Change Dates or Guests
              </button>
              
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                Selection Confirmed
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
               <Button 
                onClick={handleSubmit}
                size="lg"
                disabled={loading || nights <= 0}
                isLoading={loading}
                className="w-full h-20 sm:h-24 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 active:scale-[0.98]"
                rightIcon={!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              >
                {t('confirm.confirm_btn') || 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        ) : (
          // Edit Mode Form
          <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                  {t('confirm.check_in')}
                </label>
                <Input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.checkIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                  icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                  className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                  {t('confirm.check_out')}
                </label>
                <Input
                  type="date"
                  required
                  min={formData.checkIn}
                  value={formData.checkOut}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                  icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                  className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                  {t('confirm.num_guests')}
                </label>
                <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/5 px-2 py-0.5 rounded-md">
                  {t('confirm.max_capacity')}: {maxCapacity} guests
                </span>
              </div>
              <Input
                type="number"
                required
                min={1}
                max={maxCapacity || 1}
                value={isNaN(formData.guests) ? '' : formData.guests}
                onChange={(e) => {
                  const val = e.target.value === '' ? NaN : parseInt(e.target.value)
                  setFormData(prev => ({ ...prev, guests: val }))
                }}
                icon={<UsersIcon className="w-5 h-5 text-[var(--accent)]" />}
                className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
              />
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={loading || nights <= 0}
                isLoading={loading}
                className="w-full h-20 sm:h-24 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 active:scale-[0.98]"
                rightIcon={!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
              >
                {t('confirm.confirm_btn') || 'Proceed to Payment'}
              </Button>
              
              {hasUrlParams && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Cancel Edits
                </button>
              )}
            </div>
          </form>
        )}
        
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-12 flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          Secure Encrypted Transaction
          <span className="w-1 h-1 rounded-full bg-gray-300" />
        </p>
      </CardContent>
    </Card>
  )
}

export function BookingForm(props: BookingFormProps) {
  return (
    <Suspense fallback={<div className="animate-pulse h-[400px] w-full bg-gray-100 rounded-[2.5rem]"></div>}>
      <BookingFormInner {...props} />
    </Suspense>
  )
}

