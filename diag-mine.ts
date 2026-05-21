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

async function diag() {
  if (!supabaseUrl || !supabaseAnonKey) return
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const id = 'ae211862-3dcb-49ef-9fd1-0baf63ed8029'
  
  const { data: p } = await supabase.from('properties').select('*').eq('id', id).single()
  const { data: r } = await supabase.from('rooms').select('*').eq('property_id', id)

  console.log('--- PROPERTY ---')
  console.log(JSON.stringify(p, null, 2))
  console.log('--- ROOMS ---')
  console.log(JSON.stringify(r, null, 2))
}

diag()
