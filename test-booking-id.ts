import { createClient } from '@supabase/supabase-js'
import util from 'util'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(name, city, country, main_image_url, address, type),
      room:rooms(name, description, price_per_night, bed_type)
    `)
    .limit(1)
    .single()

  console.log('TEST BOOKING ID:', util.inspect(error, { depth: null }))
  if (data) {
     const { data: b, error: e } = await supabase.from('bookings').select('*').eq('id', data.id).single()
     console.log('TEST BY ID:', util.inspect(e, { depth: null }))
  }
}

test()
