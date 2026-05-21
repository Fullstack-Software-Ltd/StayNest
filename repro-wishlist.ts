import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && v) env[k.trim()] = v.join('=').trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function repro() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const user_id = '64844c10-ce5f-4ded-bd48-09199e521451' // I know this exists from previous checks
  const property_id = 'ae211862-3dcb-49ef-9fd1-0baf63ed8029' // Property 'mine'

  console.log('Testing Wishlist Fetch...')
  const { data, error } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user_id)
    .eq('property_id', property_id)

  if (error) {
    console.error('FETCH ERROR:', error.message)
    console.error('ERROR CODE:', error.code)
  } else {
    console.log('FETCH SUCCESS:', data)
  }
}

repro()
