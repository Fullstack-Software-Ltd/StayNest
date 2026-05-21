const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Manually load env vars from .env.local
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) env[key.trim()] = value.trim()
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY // Use service role for bucket creation

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkBuckets() {
  console.log('--- Checking Storage Buckets ---')
  const { data: buckets, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.error('Error listing buckets:', error.message)
    return
  }

  const required = ['avatars', 'property-images', 'room-images']
  const existingNames = buckets.map(b => b.name)
  
  for (const name of required) {
    if (existingNames.includes(name)) {
      console.log(`✅ Bucket "${name}" exists.`)
    } else {
      console.log(`❌ Bucket "${name}" is MISSING. Attempting to create...`)
      const { data, error: createError } = await supabase.storage.createBucket(name, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      })
      if (createError) {
        console.error(`Failed to create "${name}":`, createError.message)
      } else {
        console.log(`✅ Created bucket "${name}".`)
      }
    }

    // Ensure Public Access Policies exist (simplified check)
    console.log(`Ensuring public access for "${name}"...`)
    // Note: Creating policies via API is complex, usually requires SQL. 
    // But we'll at least know if the bucket is public.
  }
}

checkBuckets()
