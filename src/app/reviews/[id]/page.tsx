import { getReviewById } from '@/lib/reviews/getReviewById'
import { RatingStars } from '@/components/reviews/rating-stars'
import { format } from 'date-fns'
import { ArrowLeft, Home, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth/requireRole'

export default async function ReviewDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(['guest', 'owner', 'admin'])
  const { id } = await params
  const review = await getReviewById(id)

  if (!review) {
    notFound()
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/reviews" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-8 uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to my reviews
        </Link>

        <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-[var(--primary)]/10 overflow-hidden">
          <div className="p-10 md:p-14">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Review Details</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  Submitted on {format(new Date(review.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
              <RatingStars rating={review.rating} size={32} />
            </div>

            <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100/50 mb-10">
               <p className="text-gray-700 text-xl font-medium leading-relaxed italic">
                 "{review.comment}"
               </p>
            </div>

            {review.property && (
              <div className="border-t border-gray-50 pt-10">
                <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-6">Property Details</p>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-[1.8rem] flex items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden shadow-sm">
                    {review.property.main_image_url ? (
                      <img src={review.property.main_image_url} alt={review.property.name} className="w-full h-full object-cover" />
                    ) : (
                      <Home size={32} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{review.property.name}</h3>
                    <p className="text-gray-500 font-medium flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {review.property.city}, {review.property.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
