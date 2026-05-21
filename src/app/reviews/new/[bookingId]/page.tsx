import { canUserReviewBooking } from '@/lib/reviews/canUserReviewBooking'
import { ReviewForm } from '@/components/reviews/review-form'
import { requireRole } from '@/lib/auth/requireRole'
import { notFound, redirect } from 'next/navigation'
import { Home, Calendar, MapPin } from 'lucide-react'

export default async function NewReviewPage({
  params
}: {
  params: Promise<{ bookingId: string }>
}) {
  await requireRole(['guest'])
  const { bookingId } = await params
  
  const { canReview, error, booking, property } = await canUserReviewBooking(bookingId)

  if (!canReview) {
    if (error === 'You have already reviewed this booking') {
       redirect('/reviews')
    }
    return (
      <div className="min-h-screen pt-8 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl">
           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter">Review Not Allowed</h1>
           <p className="text-gray-500 font-medium leading-relaxed mb-8">{error}</p>
           <a href="/bookings" className="inline-block px-8 py-4 bg-gray-900 text-white font-black rounded-2xl tracking-widest uppercase text-xs hover:bg-gray-800 transition-colors">
              Back to Bookings
           </a>
        </div>
      </div>
    )
  }

  if (!booking || !property) {
    notFound()
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            <div className="lg:col-span-1">
              <ReviewForm 
                bookingId={bookingId} 
                propertyId={booking.property_id} 
                propertyName={property.name} 
              />
            </div>
        </div>
      </div>
    </div>
  )
}
