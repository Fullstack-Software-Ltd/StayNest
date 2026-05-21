const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testBuckets() {
  const required = ['avatars', 'property-images', 'room-images']
  for (const name of required) {
    console.log(`Testing access to "${name}" bucket...`)
    const { error } = await supabase.storage.from(name).list('', { limit: 1 })
    if (error) {
      console.error(`❌ Error accessing "${name}":`, error.message)
    } else {
      console.log(`✅ Bucket "${name}" exists and is accessible.`)
    }
  }
}

testBuckets()
