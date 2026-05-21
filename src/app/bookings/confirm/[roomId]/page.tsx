'use client'

import { BookingFormWrapper } from './BookingFormWrapper'
import { notFound } from 'next/navigation'
import { useSettings } from '@/context/SettingsContext'
import { use, useEffect, useState } from 'react'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { getBookingInitialData } from '@/app/actions/rooms'

export default function BookingConfirmPage({ params: paramsPromise }: { params: Promise<{ roomId: string }> }) {
  const params = use(paramsPromise)
  const { t } = useSettings()
  const [data, setData] = useState<{ room: Room; property: Property } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    async function fetchData() {
      try {
        const result = await getBookingInitialData(params.roomId)

        if (!result) throw new Error('Room not found')

        setData(result)
      } catch (err: any) {
        console.error('Error fetching booking data:', err)
        setError(err.message || 'Failed to initialize checkout')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.roomId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest animate-pulse">Initializing Checkout...</span>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-10 border border-red-50 shadow-xl shadow-red-900/5 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-red-500 font-bold">!</span>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Initialization Failed</h2>
          <p className="text-sm font-medium text-gray-500 leading-relaxed text-balance">
            We couldn't secure the booking details for this room. This might be due to a temporary connection issue.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full h-14 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    </div>
  )
  
  if (!data) notFound()

  const { room, property } = data

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24 sm:pb-32">
      {/* ─── Premium Header ───────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-12 sm:py-16 mb-12 sm:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[var(--primary)]/10 mb-8 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            {t('confirm.step_title') || 'Secure Your Reservation'}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-[0.95] text-balance mb-6 animate-slide-up">
            {t('confirm.title') || 'Finalize Your Stay'}
          </h1>
          
          <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('confirm.subtitle') || 'Review your selection and provide guest information to secure your luxury experience in Rwanda.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <BookingFormWrapper 
          property={property} 
          room={room} 
        />
      </div>
    </div>
  )
}
