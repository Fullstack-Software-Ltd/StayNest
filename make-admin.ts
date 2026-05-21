import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as readline from 'readline'

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

async function main() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase URL or Key missing in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // List ALL users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .order('created_at', { ascending: false })

  if (error || !users) {
    console.error('❌ Error fetching users:', error?.message)
    console.log('\n📋 You can run this SQL directly in Supabase SQL Editor:')
    console.log("UPDATE profiles SET role = 'admin' WHERE email = 'your-email@here.com';")
    process.exit(1)
  }

  console.log('\n👥 ALL REGISTERED USERS:\n')
  users.forEach((u, i) => {
    const roleTag = u.role === 'admin' ? '🔴 ADMIN' : u.role === 'owner' ? '🟡 OWNER' : '🔵 GUEST'
    console.log(`  [${i + 1}] ${u.full_name || 'No Name'} — ${u.email} (${roleTag})`)
  })

  const admins = users.filter(u => u.role === 'admin')
  if (admins.length > 0) {
    console.log('\n✅ Admin accounts already exist:')
    admins.forEach(a => console.log(`   → ${a.email}`))
    console.log('\nYou can log in with any of those accounts to access /admin/dashboard\n')
    process.exit(0)
  }

  console.log('\n⚠️  No admin found. To create an admin, run this SQL in your Supabase SQL Editor:')
  console.log('   → https://supabase.com/dashboard/project/_/sql/new\n')
  
  if (users.length === 0) {
    console.log("   -- No users exist yet. Register an account at http://localhost:3000/register first, then run:")
    console.log("   UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';\n")
  } else {
    console.log("   -- Copy one of these ready-made SQL commands:\n")
    users.slice(0, 5).forEach(u => {
      console.log(`   UPDATE profiles SET role = 'admin' WHERE email = '${u.email}';`)
    })
    console.log()
  }

  process.exit(0)
}

main()
