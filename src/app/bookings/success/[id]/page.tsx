import { getBookingById } from '@/lib/bookings/getUserBookings'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { CheckCircle2, Calendar, MapPin, ArrowRight, Home, CreditCard, Sparkles } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/shared/Card'

export default async function BookingSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await getBookingById(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-12 pb-24 sm:pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Branding */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[var(--primary)]/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-full animate-ping opacity-20" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-[var(--accent)] text-white p-2 rounded-xl shadow-lg rotate-12">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-none text-balance">
            Reservation <br className="sm:hidden" /> Confirmed!
          </h1>
          <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Your stay at <span className="text-[var(--primary)] font-black italic">"{booking.property?.name}"</span> is successfully booked. A confirmation email has been sent to your inbox.
          </p>
        </div>

        {/* Detailed Receipt Card */}
        <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border-white/60 mb-12 animate-slide-up">
          <CardHeader 
            className="bg-[var(--warm-gray)]/30 border-b border-[var(--warm-gray)]/50 px-8 py-10 sm:px-12 sm:py-12"
            title="Booking Summary"
            subtitle="Secure Transaction Reference"
            icon={<CreditCard className="w-5 h-5 text-[var(--accent)]" />}
            action={
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Status</p>
                <div className="px-4 py-1 bg-[var(--primary)] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20">
                  {booking.status}
                </div>
              </div>
            }
          />

          <CardContent className="p-8 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
              {/* Left Column: Property Info */}
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {booking.property?.name}
                  </h3>
                  <p className="text-gray-500 font-bold opacity-80">
                    {booking.property?.city}, {booking.property?.country}
                  </p>
                </div>

                <div className="p-6 bg-[var(--warm-white)] rounded-[2rem] border border-[var(--warm-gray)]/50 inline-block overflow-hidden relative text-left">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/5 rounded-full -mr-8 -mt-8" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 relative z-10">Accomodation Selection</p>
                  <p className="text-lg font-black text-gray-900 relative z-10">{booking.room?.name}</p>
                </div>
              </div>

              {/* Right Column: Dates & Price */}
              <div className="space-y-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival</p>
                    <div className="p-5 bg-white rounded-2xl border border-[var(--warm-gray)]/50 shadow-sm">
                      <p className="text-sm sm:text-base font-black text-gray-900">
                        {format(parseISO(booking.check_in), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Check-in</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure</p>
                    <div className="p-5 bg-white rounded-2xl border border-[var(--warm-gray)] shadow-sm">
                      <p className="text-sm sm:text-base font-black text-gray-900">
                        {format(parseISO(booking.check_out), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Check-out</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-[var(--warm-gray)]/50">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Total Amount Paid</p>
                   <p className="text-4xl sm:text-5xl font-black text-[var(--primary)] tracking-tighter tabular-nums drop-shadow-sm">
                    ${booking.total_price}
                   </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-[var(--warm-gray)]/10 px-8 py-6 sm:px-12 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[var(--warm-gray)]/50">
                   <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order Reference</p>
                  <p className="text-xs font-mono font-bold text-gray-900">STAY-{booking.id.split('-')[0].toUpperCase()}</p>
                </div>
             </div>
             <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.2em] animate-pulse">
               Verification Processing &bull; Success
             </p>
          </CardFooter>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link href={`/payments/${booking.id}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto min-w-[200px] h-16 sm:h-20 rounded-2xl sm:rounded-3xl text-sm sm:text-base font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--primary)]/20 active:scale-95 group">
              Proceed to Payment
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/bookings">
              <Button variant="ghost" className="rounded-2xl px-8 h-14 sm:h-16 text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest hover:text-[var(--primary)]">
                Manage Bookings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="rounded-2xl px-8 h-14 sm:h-16 text-xs sm:text-sm font-black text-gray-400 uppercase tracking-widest hover:text-[var(--accent)]">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
