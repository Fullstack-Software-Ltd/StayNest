'use client'

import { getBookingById } from '@/lib/bookings/getUserBookings'
import { notFound } from 'next/navigation'
import { BookingStatusBadge } from '@/components/bookings/booking-status-badge'
import { MapPin, Calendar, Users, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { useSettings } from '@/context/SettingsContext'
import { use, useEffect, useState } from 'react'
import { Booking } from '@/types/booking'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { cancelBooking } from '@/lib/bookings/cancelBooking'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'

export default function BookingDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise)
  const { t } = useSettings()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchBooking = async () => {
    try {
      const data = await getBookingById(id)
      setBooking(data as any)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooking()
  }, [id])

  const handleCancelClick = async () => {
    setCancelling(true)
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled successfully')
      await fetchBooking()
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const isCancellable = booking && ['pending', 'confirmed'].includes(booking.status)
  // Optionally check if date is in future
  const isFuture = booking && new Date(booking.check_in) > new Date()

  if (loading) return <div className="min-h-screen pt-8 text-center font-bold">Loading...</div>
  if (!booking) notFound()

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/bookings" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('booking.details.back')}
        </Link>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-50 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{t('booking.details.title')}</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  {t('booking.details.id')} {booking.id.split('-')[0].toUpperCase()}
                </h1>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking.details.property_info')}</h3>
                   <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                       {booking.property?.main_image_url ? (
                         <img src={booking.property.main_image_url} alt={booking.property.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <Home className="w-8 h-8" />
                         </div>
                       )}
                     </div>
                     <div>
                       <p className="font-bold text-gray-900">{booking.property?.name}</p>
                       <p className="text-sm text-gray-500 flex items-center">
                         <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                         {booking.property?.city}, {booking.property?.country}
                       </p>
                     </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking.details.room_info')}</h3>
                   <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                     <p className="text-sm font-bold text-gray-900 mb-1">{booking.room?.name}</p>
                     <p className="text-xs text-gray-500 line-clamp-2">{booking.room?.description}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">{t('booking.details.stay_info')}</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{t('booking.details.check_in')}</p>
                       <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{t('booking.details.check_out')}</p>
                       <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                     </div>
                   </div>
                   <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-3">
                     <Users className="w-4 h-4 text-blue-500" />
                     <span className="text-sm font-bold text-gray-700">{booking.guests} {booking.guests === 1 ? t('property.guest') : t('property.guests')}</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{t('booking.details.total_cost')}</p>
                      <FormattedPrice amount={booking.total_price} className="text-3xl font-black text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isCancellable && (
              <div className="mt-12 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Need to cancel?</h4>
                  <p className="text-sm text-gray-500">You can cancel this booking until the check-in date.</p>
                </div>
                <Button 
                  onClick={() => setShowConfirm(true)}
                  className="w-full md:w-auto px-10 py-4 bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none rounded-2xl font-bold"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleCancelClick}
        isLoading={cancelling}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone and the host will be notified."
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        variant="danger"
      />
    </div>
  )
}
