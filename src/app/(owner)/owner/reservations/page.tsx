import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { OwnerBookingCard } from '@/components/owner-bookings/owner-booking-card'
import { OwnerBookingEmptyState } from '@/components/owner-bookings/owner-booking-empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { isAfter, isBefore, parseISO } from 'date-fns'
import type { Booking } from '@/types/booking'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function OwnerBookingsPage({ searchParams }: PageProps) {
  await requireRole(['owner', 'admin'])
  const { status = 'active' } = await searchParams
  const allBookings = await getOwnerBookings()

  const now = new Date()

  // Filter logic
  const filteredBookings = allBookings.filter((b: Booking) => {
    const checkIn = parseISO(b.check_in)
    const checkOut = parseISO(b.check_out)

    if (status === 'active') {
      return b.status === 'confirmed' && isBefore(checkIn, now) && isAfter(checkOut, now)
    }
    if (status === 'upcoming') {
      return (b.status === 'confirmed' || b.status === 'pending') && isAfter(checkIn, now)
    }
    if (status === 'completed') {
      return b.status === 'completed' || (b.status === 'confirmed' && isBefore(checkOut, now))
    }
    if (status === 'cancelled') {
      return b.status === 'cancelled'
    }
    return true
  })

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Reservations"
          subtitle="Manage all upcoming and past bookings for your properties."
        />

        <Tabs defaultValue={status} className="w-full mt-12">
          <TabsList className="bg-white/50 p-1 rounded-2xl border border-gray-100 w-fit mb-8">
            <TabsTrigger value="active" href="/owner/reservations?status=active" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] shadow-none data-[state=active]:shadow-sm transition-all">
              Active
            </TabsTrigger>
            <TabsTrigger value="upcoming" href="/owner/reservations?status=upcoming" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] shadow-none data-[state=active]:shadow-sm transition-all">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" href="/owner/reservations?status=completed" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] shadow-none data-[state=active]:shadow-sm transition-all">
              Completed
            </TabsTrigger>
            <TabsTrigger value="cancelled" href="/owner/reservations?status=cancelled" className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] shadow-none data-[state=active]:shadow-sm transition-all">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value={status}>
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-20 text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CalendarCheck className="w-10 h-10 text-gray-200" />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 mb-2">No {status} reservations</h3>
                 <p className="text-gray-500 font-medium max-w-xs mx-auto">When you have bookings in this category, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((booking: Booking) => (
                  <OwnerBookingCard key={booking.id} booking={JSON.parse(JSON.stringify(booking))} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

import { CalendarCheck } from 'lucide-react'
