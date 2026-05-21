
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const admins = await prisma.profile.findMany({
      where: { role: 'admin' }
    });
    console.log('ADMIN_PROFILES_START');
    console.log(JSON.stringify(admins, null, 2));
    console.log('ADMIN_PROFILES_END');
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
