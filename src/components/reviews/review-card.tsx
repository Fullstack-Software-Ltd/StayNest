import { Review } from '@/types/review'
import { RatingStars } from './rating-stars'
import { format } from 'date-fns'
import { Home, User } from 'lucide-react'
import Image from 'next/image'

interface ReviewCardProps {
  review: Review
  showProperty?: boolean
  showUser?: boolean
}

export function ReviewCard({ review, showProperty = false, showUser = true }: ReviewCardProps) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow focus-within:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {showUser && (
            <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0 overflow-hidden relative">
              {review.user?.avatar_url ? (
                <Image 
                  src={review.user.avatar_url} 
                  alt={review.user.full_name} 
                  fill
                  sizes="40px"
                  className="rounded-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
          )}
          <div className="min-w-0">
            {showUser && (
              <h4 className="font-bold text-gray-900 text-sm truncate">
                {review.user?.full_name || 'Anonymous Guest'}
              </h4>
            )}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {format(new Date(review.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <RatingStars rating={review.rating} size={16} />
      </div>

      {showProperty && review.property && (
        <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative">
             {review.property.main_image_url ? (
               <Image 
                 src={review.property.main_image_url} 
                 alt={review.property.name} 
                 fill
                 sizes="32px"
                 className="object-cover" 
               />
             ) : (
               <Home size={16} />
             )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{review.property.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{review.property.city}, {review.property.country}</p>
          </div>
        </div>
      )}

      <p className="text-gray-600 text-sm leading-relaxed italic">
        "{review.comment}"
      </p>
    </div>
  )
}
