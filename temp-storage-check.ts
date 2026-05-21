import { createClient } from './src/lib/supabase/server'

async function checkBuckets() {
  const supabase = await createClient()
  
  console.log('--- Checking Storage Buckets ---')
  const { data: buckets, error } = await supabase.storage.listBuckets()
  
  if (error) {
    console.error('Error listing buckets:', error.message)
    return
  }

  const required = ['avatars', 'property-images', 'room-images']
  const existingNames = buckets.map(b => b.name)
  
  required.forEach(name => {
    if (existingNames.includes(name)) {
      console.log(`✅ Bucket "${name}" exists.`)
    } else {
      console.log(`❌ Bucket "${name}" is MISSING.`)
    }
  })

  // Try to create them if missing (might fail depending on perms)
  for (const name of required) {
    if (!existingNames.includes(name)) {
      console.log(`Attempting to create bucket "${name}"...`)
      const { error: createError } = await supabase.storage.createBucket(name, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })
      if (createError) {
        console.error(`Failed to create "${name}":`, createError.message)
      } else {
        console.log(`✅ Created bucket "${name}".`)
      }
    }
  }
}

checkBuckets()
