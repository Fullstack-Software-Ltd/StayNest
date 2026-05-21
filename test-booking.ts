import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testBooking() {
  const userId = '450a7bbb-a6f8-4cb6-abf2-9f686ca9964c'
  
  // 1. Ensure profile exists
  console.log('Ensuring profile for:', userId)
  const { data: profile } = await supabase.from('profiles').upsert({
    id: userId,
    full_name: 'Test User',
    email: 'test@example.com',
    role: 'guest'
  }).select().single()

  // 2. Get a valid property and room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*, properties(*)')
    .limit(1)
    .single()

  if (roomError || !room) {
    console.error('No rooms found to test with:', roomError)
    return
  }
  
  console.log('Attempting booking for room:', room.id, 'property:', room.property_id)

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      property_id: room.property_id,
      room_id: room.id,
      user_id: userId,
      check_in: '2025-05-10',
      check_out: '2025-05-15',
      guests: 1,
      total_price: 500,
      status: 'confirmed'
    })
    .select()
    .single()

  if (error) {
    console.error('CREATE BOOKING FAILED:', error)
  } else {
    console.log('CREATE BOOKING SUCCESS:', data)
  }
}

testBooking()
