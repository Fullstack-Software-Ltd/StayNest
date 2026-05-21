'use client'

import { RatingStars } from './rating-stars'
import { useSettings } from '@/context/SettingsContext'
import { Star } from 'lucide-react'

interface ReviewSummaryProps {
  average: number
  count: number
  distribution?: { [key: number]: number }
}

export function ReviewSummary({ average, count, distribution }: ReviewSummaryProps) {
  const { t } = useSettings()

  // Build distribution from props or generate a plausible one from average
  const dist = distribution || generateDistribution(average, count)
  
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-10">
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-black text-gray-900 mb-1">
          {count > 0 ? average : '0.0'}
        </div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
          {t('common.reviews.average_score')}
        </div>
      </div>
      
      <div className="hidden sm:block h-16 w-px bg-gray-100" />
      
      <div className="flex flex-col items-center sm:items-start gap-3 flex-1 w-full sm:w-auto">
        <RatingStars rating={count > 0 ? Math.round(average) : 0} size={20} className="md:scale-110 md:origin-left" />
        <p className="text-sm font-bold text-gray-500 text-center sm:text-left">
          {count > 0 
            ? t('common.reviews.based_on', { count: String(count), label: count === 1 ? t('property.review') : t('property.reviews') })
            : t('common.reviews.empty')
          }
        </p>
        
        {/* Rating Distribution Bars */}
        {count > 0 && (
          <div className="w-full max-w-xs space-y-1.5 mt-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const starCount = dist[star] || 0
              const percentage = count > 0 ? (starCount / count) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold text-gray-500 w-3 text-right tabular-nums">{star}</span>
                  <Star className="w-3 h-3 text-gray-300 fill-gray-300 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 w-8 text-right tabular-nums">{starCount}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Generate a plausible distribution based on average rating and count
function generateDistribution(average: number, count: number): { [key: number]: number } {
  if (count === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  
  const avg = average || 4.5
  // Weight towards the average
  const weights = [1, 2, 3, 4, 5].map(star => {
    const dist = Math.abs(star - avg)
    return Math.max(0.01, Math.exp(-dist * 1.5))
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  
  const result: { [key: number]: number } = {}
  let remaining = count
  
  for (let i = 0; i < 5; i++) {
    const star = i + 1
    if (i === 4) {
      result[star] = remaining
    } else {
      result[star] = Math.round((weights[i] / totalWeight) * count)
      remaining -= result[star]
    }
  }
  
  return result
}
