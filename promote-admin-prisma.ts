import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const email = 'mazzalin32@gmail.com'
  console.log(`Promoting ${email} to admin...`)
  
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.error(`User with email ${email} not found.`)
    return
  }

  const updatedProfile = await prisma.profile.update({
    where: { id: user.id },
    data: { role: 'admin' }
  })

  console.log(`Success! Updated profile:`, updatedProfile)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
