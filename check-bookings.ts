import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', '450a7bbb-a6f8-4cb6-abf2-9f686ca9964c')

  if (error) {
    console.error('ERROR:', error)
  } else {
    console.log('BOOKINGS:', data)
  }
}

check()
