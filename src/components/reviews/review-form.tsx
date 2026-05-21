'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RatingStars } from './rating-stars'
import { createReview } from '@/lib/reviews/createReview'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/context/SettingsContext'

interface ReviewFormProps {
  bookingId: string
  propertyId: string
  propertyName: string
}

export function ReviewForm({ bookingId, propertyId, propertyName }: ReviewFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!comment.trim()) {
      setError('Please provide a comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createReview({
        booking_id: bookingId,
        property_id: propertyId,
        rating,
        comment: comment.trim()
      })
      router.push('/reviews')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-2xl shadow-[var(--primary)]/5">
      <div className="mb-8 md:mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-2">{t('common.reviews.title')}</h2>
        <p className="text-gray-500 font-medium tracking-tight text-sm md:text-base">{t('common.reviews.subtitle', { name: propertyName })}</p>
      </div>

      <div className="space-y-8 md:space-y-10">
        <div className="flex flex-col items-center">
          <label className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-4 md:mb-6">{t('common.reviews.rate')}</label>
          <RatingStars 
            rating={rating} 
            max={5} 
            readonly={false} 
            onChange={setRating} 
            size={40} 
            className="md:scale-125 md:origin-center"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-2">{t('common.reviews.share')}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('common.reviews.share_placeholder')}
            className="w-full min-h-[160px] md:min-h-[200px] p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-gray-50 border-none focus:ring-4 focus:ring-[var(--primary)]/10 transition-all text-gray-900 font-medium placeholder:text-gray-300 resize-none text-sm md:text-base"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-4 rounded-2xl border border-red-100">
            {error}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-6 md:py-8 text-base md:text-lg font-black tracking-widest uppercase rounded-2xl md:rounded-[2rem] shadow-xl shadow-[var(--primary)]/10 active:scale-95 transition-transform bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
        >
          {isSubmitting ? t('common.submitting') : t('common.reviews.post')}
        </Button>
      </div>
    </form>
  )
}
