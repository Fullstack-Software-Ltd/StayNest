import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function diagnostic() {
  const propertyId = '7cb754ba-7303-4c84-bda0-0c11a9391b88'
  console.log(`Checking property: ${propertyId}`)

  const { data: property, error: pError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single()

  if (pError) {
    console.error('Property Error:', pError)
  } else {
    console.log('Property Data:', JSON.stringify(property, null, 2))
  }

  const { data: rooms, error: rError } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)

  if (rError) {
    console.error('Rooms Error:', rError)
  } else {
    console.log(`Rooms (${rooms?.length || 0}):`, JSON.stringify(rooms, null, 2))
  }
}

diagnostic()
