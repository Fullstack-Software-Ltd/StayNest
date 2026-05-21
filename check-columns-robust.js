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
    const parts = line.split('=')
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim()
    }
  })

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing credentials')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching properties:', error.message)
  } else {
    const columns = Object.keys(data[0] || {})
    console.log('Current columns in properties table:', columns)
  }
}

run().catch(console.error)
