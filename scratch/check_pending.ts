
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const pending = await prisma.property.findMany({
      where: { status: 'pending' },
      include: {
        owner: {
          select: {
            full_name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    console.log('PENDING_PROPERTIES_START');
    console.log(JSON.stringify(pending, null, 2));
    console.log('PENDING_PROPERTIES_END');
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
