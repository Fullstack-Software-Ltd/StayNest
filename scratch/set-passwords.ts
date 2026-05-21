import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const password = '123456'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  console.log('🔐 Setting default passwords for all users...')
  
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })
    console.log(`✅ Updated password for: ${user.email}`)
  }
  
  console.log('🎉 Done! All users can now log in with password: 123456')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
