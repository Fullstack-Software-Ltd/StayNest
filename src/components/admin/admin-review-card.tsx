'use client'

import { deleteReview } from '@/lib/admin/adminActions'
import { Button } from '@/components/shared/Button'
import { Trash2, User, Star, MapPin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

interface AdminReviewCardProps {
  review: any
  onActionComplete: () => void
}

export function AdminReviewCard({ review, onActionComplete }: AdminReviewCardProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this review from the platform permanently?`)) return
    
    setLoading(true)
    try {
      await deleteReview(review.id)
      toast.success('Review permanently deleted')
      onActionComplete()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group focus-within:shadow-gray-200/50 relative overflow-hidden">
      
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] opacity-20" />

      <div className="flex flex-col sm:flex-row gap-6 w-full md:flex-1 pl-2">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 relative overflow-hidden shrink-0">
          {review.user?.avatar_url ? (
            <Image 
              src={review.user.avatar_url} 
              alt={review.user.full_name} 
              fill
              sizes="48px"
              className="object-cover" 
            />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-black text-gray-900 tracking-tight flex items-center gap-2">
              {review.user?.full_name || 'Anonymous Guest'}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] font-black text-amber-700">{review.rating}.0</span>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
              "{review.comment}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center bg-gray-50 px-2.5 py-1 rounded-md max-w-fit border border-gray-100">
              <MapPin className="w-3 h-3 mr-1.5" />
              {review.property?.name || 'Unknown Property'}
            </p>
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start md:items-center justify-end w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-xl h-12 w-12 p-0 border-red-50 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm"
          title="Delete Review"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
