import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=')
  const value = rest.join('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function listProperties() {
  if (!supabaseUrl || !supabaseAnonKey) return
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('properties')
    .select('id, name, status, daily_price, is_whole_unit')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('--- RECENT PROPERTIES ---')
  data.forEach(p => {
    console.log(`ID: ${p.id} | Name: ${p.name} | Status: ${p.status} | Price: ${p.daily_price} | Whole: ${p.is_whole_unit}`)
  })
}

listProperties()
