
import { getPlatformBookings } from '@/lib/admin/adminActions'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { Calendar, Search, Filter, ArrowRight, User, Home, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { status = 'all' } = await searchParams
  const bookings = await getPlatformBookings(status)

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Reservations</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor all platform booking activity.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
            <a
              key={s}
              href={`/admin/bookings?status=${s}`}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                status === s 
                  ? "bg-gray-900 text-white shadow-lg" 
                  : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"
              )}
            >
              {s}
            </a>
          ))}
        </div>

        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            type="text"
            placeholder="Search by guest or property..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20 transition-all"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking: any) => {
            const guest = Array.isArray(booking.guest) ? booking.guest[0] : booking.guest
            const property = Array.isArray(booking.property) ? booking.property[0] : booking.property
            
            return (
              <Card key={booking.id} padding="none" className="overflow-hidden hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-8">
                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                        <Home className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-black text-gray-900 truncate">{property?.name || 'Unknown Property'}</h3>
                        <p className="text-xs font-medium text-gray-400 truncate">{property?.city || 'Unknown City'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="flex-1 min-w-0 md:border-l md:pl-8 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Guest</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{guest?.full_name || 'System User'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Status */}
                  <div className="flex-1 md:border-l md:pl-8 border-gray-100">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-in</p>
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{format(new Date(booking.check_in), 'MMM d, yyyy')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-out</p>
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{format(new Date(booking.check_out), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-8 md:border-l md:pl-8 border-gray-100 min-w-[140px]">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                      <p className="text-lg font-black text-gray-900 tracking-tighter">${Number(booking.total_price).toLocaleString()}</p>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      booking.status === 'confirmed' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Calendar className="w-10 h-10 text-gray-200" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">No {status} reservations</h3>
             <p className="text-gray-500 font-medium max-w-xs mx-auto">The platform hasn't recorded any bookings with this status yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
