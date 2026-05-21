import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkUserBookings() {
  const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  const userIds = [
    'c63fff73-2a8b-4920-b4d3-60707317c4fc',
    'a1722d44-f08c-4f76-892c-5a24b266aadd'
  ]
  
  for (const uid of userIds) {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, status, property_id')
      .eq('user_id', uid)
    
    if (error) console.error(`Error for ${uid}:`, error)
    else console.log(`Bookings for ${uid}:`, data)
  }
}

checkUserBookings()
