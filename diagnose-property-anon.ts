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

async function diagnostic() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Key missing in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const propertyId = '7cb754ba-7303-4c84-bda0-0c11a9391b88'
  console.log(`Checking property: ${propertyId}`)

  // Using select('*') to see all columns available
  const { data: property, error: pError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()

  if (pError) {
    console.error('Property Error:', pError.message)
  } else {
    console.log('--- PROPERTY DATA ---')
    console.log(`Name: ${property.name}`)
    console.log(`Status: ${property.status}`)
    console.log(`Whole Unit: ${property.is_whole_unit}`)
    console.log(`Daily Price: ${property.daily_price}`)
    console.log(`Monthly Price: ${property.monthly_price}`)
    console.log(`Created At: ${property.created_at}`)
    // console.log('Full JSON:', JSON.stringify(property, null, 2))
  }

  const { data: rooms, error: rError } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)

  if (rError) {
    console.error('Rooms Error:', rError.message)
  } else {
    console.log(`\n--- ROOMS (${rooms?.length || 0}) ---`)
    rooms?.forEach((room, i) => {
      console.log(`Room ${i+1}: ${room.name} ($${room.price_per_night})`)
    })
  }
}

diagnostic()
