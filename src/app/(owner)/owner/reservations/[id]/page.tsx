import { getBookingByIdForOwner } from '@/lib/bookings/getOwnerBookings'
import { notFound } from 'next/navigation'
import { OwnerBookingStatusBadge } from '@/components/owner-bookings/owner-booking-status-badge'
import { PageHeader } from '@/components/shared/page-header'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { format, parseISO } from 'date-fns'
import { MapPin, Calendar, Users, Mail, Phone, Home, ArrowLeft, Info, MessageCircle, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { updateBookingStatus } from '@/lib/bookings/updateBookingStatus'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'
import { calculatePayout, formatCurrency } from '@/lib/utils/finance'

import { requireRole } from '@/lib/auth/requireRole'
import { OwnerBookingActions } from '@/components/owner-bookings/OwnerBookingActions'

export default async function OwnerBookingDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(['owner', 'admin'])
  const { id } = await params
  let booking
  try {
    booking = await getBookingByIdForOwner(id)
  } catch (e) {
    notFound()
  }

  const { gross, fee, net } = calculatePayout(Number(booking.total_price))

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/owner/reservations" className="inline-flex items-center text-sm font-black text-gray-400 hover:text-[var(--primary)] mb-8 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all reservations
        </Link>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-10 md:p-14 border-b border-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/5 px-3 py-1 rounded-full text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-4">
                  <span>Guest Reservation</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Booking #{booking.id.split('-')[0].toUpperCase()}
                </h1>
              </div>
              <OwnerBookingStatusBadge status={booking.status} className="text-sm px-5 py-2" />
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Column: Guest & Property */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Guest Information
                  </h3>
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-[var(--primary)] border border-gray-100 shadow-sm overflow-hidden">
                        {booking.guest?.avatar_url ? (
                          <img src={booking.guest.avatar_url} alt={booking.guest.full_name} className="w-full h-full object-cover" />
                        ) : (
                          booking.guest?.full_name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg leading-tight">{booking.guest?.full_name}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Verified Guest</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                       {/* Primary Contact Details */}
                       <div className="space-y-6">
                         <div className="flex flex-col gap-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</p>
                           <p className="text-2xl font-black text-gray-900 leading-tight">
                             {booking.guest?.full_name || 'Anonymous Guest'}
                           </p>
                         </div>

                         <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                           <div className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-[var(--primary)]/30 transition-colors">
                             <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center mr-4 text-[var(--primary)]">
                               <Mail className="w-5 h-5" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                               <p className="text-sm font-bold text-gray-900 truncate">{booking.guest?.email}</p>
                             </div>
                           </div>

                           <div className="flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-[var(--primary)]/30 transition-colors">
                             <div className="w-10 h-10 bg-[var(--primary)]/5 rounded-xl flex items-center justify-center mr-4 text-[var(--primary)]">
                               <Phone className="w-5 h-5" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                               <p className="text-sm font-bold text-gray-900">
                                 {booking.guest?.phone || 'Not provided by guest'}
                               </p>
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       {/* Secondary Metadata */}
                       <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-dashed border-gray-200">
                         <div className="space-y-1">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform Member</p>
                           <p className="text-sm font-bold text-gray-900">
                             {booking.guest?.created_at 
                               ? `Since ${format(new Date(booking.guest.created_at), 'MMM yyyy')}` 
                               : 'Established Member'}
                           </p>
                         </div>
                         {booking.guest?.language && (
                           <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Primary Language</p>
                             <p className="text-sm font-bold text-gray-900">{booking.guest.language}</p>
                           </div>
                         )}
                       </div>

                       <a 
                         href={`mailto:${booking.guest?.email}?subject=Reservation Update for ${booking.property?.name}`}
                         className="block"
                       >
                         <Button variant="primary" className="w-full rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 h-14 shadow-xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 transition-all active:scale-95">
                            <MessageCircle className="w-4 h-4" />
                            Message via Email
                         </Button>
                       </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Property & Room
                  </h3>
                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-2">
                    <p className="font-black text-gray-900 text-lg">{booking.property?.name}</p>
                    <p className="text-sm text-gray-500 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[var(--primary)]" />
                      {booking.property?.city}, {booking.property?.country}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200/50">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Room details</p>
                      <p className="text-sm font-bold text-gray-700">{booking.room?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dates & Payment */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Stay Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Check In</p>
                      <p className="text-sm font-black text-gray-900 text-center">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Check Out</p>
                      <p className="text-sm font-black text-gray-900 text-center">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center space-x-3">
                    <Users className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-black text-gray-900">{booking.guests} Guests</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Payout Breakdown
                  </h3>
                  <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Booking Price</span>
                        <span className="font-bold">{formatCurrency(gross)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-6 text-red-400">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center">
                          Platform Fee (10%)
                          <Info className="w-3 h-3 ml-1 opacity-50" />
                        </span>
                        <span className="font-bold">-{formatCurrency(fee)}</span>
                      </div>
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-1">Your Net Payout</p>
                        <p className="text-4xl font-black text-white tracking-tighter">{formatCurrency(net)}</p>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <TrendingUp className="w-24 h-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-16 pt-16 border-t border-gray-50">
              <OwnerBookingActions 
                bookingId={booking.id} 
                currentStatus={booking.status}
                propertyName={booking.property?.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
