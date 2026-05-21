import { createClient } from './src/lib/supabase/server'

async function check() {
  const supabase = await createClient()
  
  console.log('--- Checking Favorites Table ---')
  const { data, error } = await supabase.from('favorites').select('id').limit(1)
  
  if (error) {
    console.log('Error selecting from favorites:', error.message)
    console.log('Error code:', error.code)
  } else {
    console.log('Successfully connected to favorites table.')
  }

  console.log('\n--- Checking Tables in Public Schema ---')
  const { data: tables, error: tableError } = await supabase.rpc('get_tables') // Usually doesn't exist by default, let's try a generic query
  
  const { data: info } = await supabase.from('properties').select('id').limit(1)
  console.log('Properties table accessible:', !!info)
}

check()
