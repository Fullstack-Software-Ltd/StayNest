
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            property: {
              select: {
                name: true,
                city: true
              }
            }
          }
        }
      }
    });
    console.log('PAYMENTS_START');
    console.log(JSON.stringify(payments, null, 2));
    console.log('PAYMENTS_END');
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
