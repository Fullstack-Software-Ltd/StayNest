'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBookingStatus } from '@/lib/bookings/updateBookingStatus'
import { Button } from '@/components/ui/Button'
import { SubmitButton } from '@/components/shared/SubmitButton'
import { toast } from 'sonner'
import { CheckCircle2, XCircle } from 'lucide-react'

interface OwnerBookingActionsProps {
  bookingId: string
  currentStatus: string
  propertyName: string
}

export function OwnerBookingActions({ bookingId, currentStatus, propertyName }: OwnerBookingActionsProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async (status: 'confirmed' | 'cancelled' | 'completed') => {
    setIsUpdating(true)
    try {
      await updateBookingStatus(bookingId, status)
      toast.success(`Booking ${status === 'completed' ? 'marked as completed' : status}`, {
        description: `The guest has been notified for ${propertyName}.`
      })
      router.refresh()
    } catch (error: any) {
      console.error('[STATUS UPDATE ERROR]', error)
      toast.error('Update failed', {
        description: error.message || 'There was an issue updating the booking.'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (!['pending', 'confirmed'].includes(currentStatus)) {
    return (
      <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
         <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
           This booking is {currentStatus}
         </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {currentStatus === 'pending' ? (
        <>
          <Button 
            onClick={() => handleUpdate('confirmed')}
            disabled={isUpdating}
            className="flex-1 py-8 text-lg rounded-2xl shadow-xl shadow-[var(--primary)]/20"
          >
            {isUpdating ? 'Confirming...' : 'Confirm Reservation'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleUpdate('cancelled')}
            disabled={isUpdating}
            className="flex-1 py-8 text-lg rounded-2xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            Reject Request
          </Button>
        </>
      ) : (
        <Button 
          onClick={() => handleUpdate('completed')}
          disabled={isUpdating}
          className="w-full py-8 text-lg rounded-2xl shadow-xl shadow-[var(--primary)]/20"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          {isUpdating ? 'Completing...' : 'Mark as Completed'}
        </Button>
      )}
    </div>
  )
}
