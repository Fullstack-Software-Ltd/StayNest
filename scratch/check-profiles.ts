import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(5)
  console.log('Profiles:', profiles);
  if (error) console.error('Error:', error);
}

checkData()
