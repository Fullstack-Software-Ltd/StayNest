import { Booking } from '@/types/booking'

export function validatePaymentRequest(booking: Booking, userId: string): { valid: boolean; error?: string } {
  // 1. Ensure booking exists
  if (!booking) {
    return { valid: false, error: 'Booking not found.' }
  }

  // 2. Ensure guest owns the booking
  if (booking.user_id !== userId) {
    return { valid: false, error: 'Unauthorized. You can only pay for your own bookings.' }
  }

  // 3. Ensure booking is not already paid (if status tracked)
  // Note: We might allow retry if payment record is 'failed'
  
  return { valid: true }
}
