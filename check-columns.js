const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function run() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found')
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  })

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing credentials')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Query table info
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching properties:', error.message)
    if (error.message.includes('column "amenities" does not exist')) {
       console.log('✅ CONFIRMED: column "amenities" is missing.')
    }
  } else {
    const columns = Object.keys(data[0] || {})
    console.log('Current columns in properties table:', columns)
    if (columns.includes('amenities')) {
       console.log('✅ Column "amenities" exists.')
    } else {
       console.log('❌ Column "amenities" is missing.')
    }
  }
}

run().catch(console.error)
