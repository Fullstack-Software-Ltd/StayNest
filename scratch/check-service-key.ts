import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkData() {
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(5)
  console.log('Profiles:', profiles);
  if (error) console.error('Error:', error);
}

checkData()
