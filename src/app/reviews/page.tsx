import { getUserReviews } from '@/lib/reviews/getUserReviews'
import { ReviewList } from '@/components/reviews/review-list'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { requireRole } from '@/lib/auth/requireRole'

export default async function MyReviewsPage() {
  await requireRole(['guest', 'owner', 'admin'])
  const reviews = await getUserReviews()

  return (
    <div className="bg-gray-50/30 min-h-screen pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="My Reviews"
          subtitle="Your feedback helps the community find better stays."
        />

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
            <EmptyState
              variant="reviews"
              actionLabel="Find a stay to review"
              actionHref="/search"
            />
          </div>
        ) : (
          <ReviewList reviews={reviews} showProperty={true} showUser={false} />
        )}
      </div>
    </div>
  )
}
