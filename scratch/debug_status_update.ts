import { updateBookingStatus } from './src/lib/bookings/updateBookingStatus'
import { createClient } from './src/lib/supabase/server'

async function debugUpdateStatus() {
  const supabase = await createClient()
  
  // 1. Get the most recent confirmed booking
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('id, status, user_id')
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (fetchError || !booking) {
    console.log('No confirmed booking found to test with.')
    return
  }

  console.log(`Testing with booking ID: ${booking.id}, Current Status: ${booking.status}`)

  try {
    // 2. Try to update to completed
    await updateBookingStatus(booking.id, 'completed')
    console.log('updateBookingStatus call succeeded.')
    
    // 3. Verify status in DB
    const { data: updatedBooking } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', booking.id)
      .single()
      
    console.log(`Verified Status in DB: ${updatedBooking?.status}`)
    
    // 4. Verify notification
    const { data: notification } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', booking.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      
    console.log('Latest Notification for Guest:', notification?.title, notification?.message)
    
  } catch (err: any) {
    console.error('DEBUG ERROR:', err.message)
  }
}

debugUpdateStatus()
