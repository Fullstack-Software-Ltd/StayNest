import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Manual .env.local parsing
const envFile = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  const value = rest.join('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkAdmin() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key missing in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // 1. Check for admins
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('role', 'admin')

  if (error) {
    console.error('Error fetching admins:', error.message)
    return
  }

  if (admins && admins.length > 0) {
    console.log('--- ADMINS FOUND ---')
    admins.forEach(admin => {
      console.log(`Name: ${admin.full_name}`)
      console.log(`Email: ${admin.email}`)
      console.log(`Role: ${admin.role}\n`)
    });
  } else {
    // Check all users
    const { data: allUsers } = await supabase.from('profiles').select('id, full_name, email, role').limit(10)
    console.log('--- NO ADMINS FOUND ---')
    console.log('Here are some users you can promote via Supabase SQL editor:')
    allUsers?.forEach(user => {
      console.log(`- ${user.email} (${user.role})`)
    })
  }
}

checkAdmin()
