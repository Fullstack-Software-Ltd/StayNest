import { Review } from '@/types/review'
import { ReviewCard } from './review-card'
import { ReviewEmptyState } from './review-empty-state'

interface ReviewListProps {
  reviews: Review[]
  showProperty?: boolean
  showUser?: boolean
}

export function ReviewList({ reviews, showProperty = false, showUser = true }: ReviewListProps) {
  if (reviews.length === 0) {
    return <ReviewEmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          showProperty={showProperty}
          showUser={showUser}
        />
      ))}
    </div>
  )
}
