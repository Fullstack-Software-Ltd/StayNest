'use client'

import { useSettings } from '@/context/SettingsContext'
import { ReviewSummary } from '@/components/reviews/review-summary'
import { Star, Sparkles } from 'lucide-react'

interface PropertyReviewsHeaderProps {
  average: number
  count: number
}

export function PropertyReviewsHeader({ average, count }: PropertyReviewsHeaderProps) {
  const { t } = useSettings()

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/20 shadow-sm">
          <Star className="w-3 h-3 text-[var(--accent)] fill-current" />
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest">
            {t('details.social_proof') || 'Guest Experiences'}
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          {t('details.guest_reviews')}
        </h2>
        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
          {t('details.reviews_subtitle')}
        </p>
      </div>
      <ReviewSummary average={average} count={count} />
    </div>
  )
}
