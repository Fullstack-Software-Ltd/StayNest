import { Client } from 'pg'

async function listDbs() {
  const connectionString = 'postgresql://postgres:Paccyemma%4007@127.0.0.1:5432/postgres'
  const client = new Client({ connectionString })
  await client.connect()

  try {
    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
    console.log('--- DATABASES ---')
    console.log(res.rows.map(r => r.datname))

    // Check tables in urugostay
    console.log('\n--- Checking urugostay tables ---')
    const clientDb = new Client({ connectionString: 'postgresql://postgres:Paccyemma%4007@127.0.0.1:5432/urugostay' })
    await clientDb.connect()
    const tablesRes = await clientDb.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log(tablesRes.rows.map(r => r.table_name))

    // Count rows in Profile
    const countRes = await clientDb.query('SELECT COUNT(*) FROM "Profile"')
    console.log('Profile count:', countRes.rows[0].count)

    const userCountRes = await clientDb.query('SELECT COUNT(*) FROM "User"')
    console.log('User count:', userCountRes.rows[0].count)

    await clientDb.end()
  } catch (err) {
    console.error(err)
  } finally {
    await client.end()
  }
}

listDbs()
