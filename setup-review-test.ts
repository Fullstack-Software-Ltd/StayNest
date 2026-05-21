import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Manual .env.local parsing
const envFile = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function setupTestReview() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key missing in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // 1. Get a guest user
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('role', 'guest')
    .limit(1)

  if (pError || !profiles || profiles.length === 0) {
    console.log('No guest profiles found.')
    return
  }
  const guest = profiles[0]
  console.log(`Found guest: ${guest.full_name} (${guest.id})`)

  // 2. Check for completed bookings
  const { data: bookings, error: bError } = await supabase
    .from('bookings')
    .select('id, status, property_id')
    .eq('user_id', guest.id)
    .eq('status', 'completed')
    .limit(1)

  if (bError) {
    console.error('Error fetching bookings:', bError)
    return
  }

  if (bookings && bookings.length > 0) {
    console.log(`Found completed booking: ${bookings[0].id}`)
    console.log(`Test URL: http://localhost:3000/reviews/new/${bookings[0].id}`)
  } else {
    // Check for ANY booking to reuse
    const { data: anyBooking } = await supabase
      .from('bookings')
      .select('id, user_id, status')
      .eq('user_id', guest.id)
      .limit(1)
    
    if (anyBooking && anyBooking.length > 0) {
       console.log(`ACTION_REQUIRED: Update booking ${anyBooking[0].id} to 'completed' status manually or via script to test.`)
    } else {
       console.log('No bookings found for this guest. Create a booking first.')
    }
  }
}

setupTestReview()
