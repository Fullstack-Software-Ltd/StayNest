import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function promoteAdmin() {
  console.log('Fetching users...')
  const { data: profiles, error: err } = await supabase
    .from('profiles')
    .select('*')
    .limit(5)

  if (err) {
    console.error('Error fetching profiles:', err)
    return
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profiles found in the database.')
    return
  }

  console.log('Found profiles:', profiles.map(p => ({ id: p.id, role: p.role, email: p.email || p.full_name })))

  const userToPromote = profiles[0]
  console.log(`Promoting user ${userToPromote.id} (${userToPromote.full_name || 'No Name'}) to admin...`)

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userToPromote.id)

  if (updateErr) {
    console.error('Error updating role:', updateErr)
  } else {
    console.log('Successfully promoted to admin!')
  }
}

promoteAdmin()
