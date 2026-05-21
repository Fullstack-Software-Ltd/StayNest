import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

async function run() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found')
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const env: Record<string, string> = {}
  
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      env[match[1].trim()] = match[2].trim()
    }
  })

  const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY']

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing credentials in .env.local')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const buckets = ['avatars', 'property-images', 'room-images']

  for (const bucket of buckets) {
    console.log(`Checking bucket: ${bucket}`)
    const { data: existing, error: listError } = await supabase.storage.getBucket(bucket)
    
    if (listError) {
      console.log(`Bucket ${bucket} not found, creating...`)
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5242880
      })
      if (createError) {
        console.error(`Error creating ${bucket}:`, createError.message)
      } else {
        console.log(`Successfully created ${bucket}`)
      }
    } else {
      console.log(`Bucket ${bucket} already exists. Ensuring it is public...`)
      await supabase.storage.updateBucket(bucket, { public: true })
    }
  }
  
  console.log('\n--- IMPORTANT ---')
  console.log('Buckets are ensured, but you MUST apply the RLS policies in supabase/migrations/20260406010000_storage_fix.sql')
  console.log('manually in your Supabase SQL Editor to allow users to upload images.')
}

run().catch(console.error)
