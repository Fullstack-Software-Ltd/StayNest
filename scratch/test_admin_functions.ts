
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { format } from 'date-fns';

async function main() {
  try {
    console.log('TESTING ANALYTICS...');
    const [
      totalUsers,
      totalProperties,
      approvedCount,
      totalBookings,
      totalReviews,
      paymentStats,
      reviewStats
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.property.count(),
      prisma.property.count({ where: { status: 'approved' } }),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true
        }
      }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);
    console.log('ANALYTICS SUCCESS');

    console.log('TESTING FINANCIAL REPORT...');
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
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const monthlyRevenue: Record<string, number> = {}
    payments.forEach(p => {
      const month = format(new Date(p.created_at), 'MMM yyyy')
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(p.amount)
    })

    const propertyEarnings: Record<string, number> = {}
    payments.forEach(p => {
      const name = p.booking?.property?.name || 'Unknown'
      propertyEarnings[name] = (propertyEarnings[name] || 0) + Number(p.amount)
    })
    console.log('FINANCIAL REPORT SUCCESS');
    
  } catch (error) {
    console.error('CRASH DETECTED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
