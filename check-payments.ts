import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function check() {
  const { error } = await supabase.from('payments').select('id').limit(1)
  if (error) {
    console.error('PAYMENTS ERROR:', error)
  } else {
    console.log('PAYMENTS TABLE EXISTS')
  }
}

check()
