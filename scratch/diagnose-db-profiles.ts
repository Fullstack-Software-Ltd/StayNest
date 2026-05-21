import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('--- Checking active database connection ---')
    
    // Check tables in current schema
    const tables: any = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Tables:', tables.map((t: any) => t.table_name))

    // Count records
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)

    const profileCount = await prisma.profile.count()
    console.log('Profile count:', profileCount)

    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 5, include: { profile: true } })
      console.log('Users sample:', JSON.stringify(users, null, 2))
    }
  } catch (err) {
    console.error('Prisma query error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
