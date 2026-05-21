'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { isAdmin } from '@/lib/auth/access'
import { format } from 'date-fns'

export async function getPlatformProperties(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: {
            full_name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return properties.map(p => {
      const plain = JSON.parse(JSON.stringify(p))
      return {
        ...plain,
        daily_price: p.daily_price ? Number(p.daily_price) : null,
        monthly_price: p.monthly_price ? Number(p.monthly_price) : null,
        latitude: p.latitude ? Number(p.latitude) : null,
        longitude: p.longitude ? Number(p.longitude) : null,
      }
    }) as any
  } catch (error) {
    console.error('Error fetching platform properties:', error)
    return []
  }
}

export async function approveProperty(propertyId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { owner_id: true, name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'approved' }
    })

    // Notify owner
    await createNotification({
      user_id: property.owner_id,
      type: 'property_approved',
      title: 'Property Approved!',
      message: `Congratulations! Your property "${property.name}" has been approved and is now live on UrugoStay.`,
      link: `/owner/properties/${propertyId}`
    })

    revalidatePath('/admin/properties')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/owner/properties/${propertyId}`)
    revalidatePath('/')
  } catch (error) {
    console.error('APPROVE PROPERTY ERROR:', error)
    throw error
  }
}

export async function rejectProperty(propertyId: string, reason?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { owner_id: true, name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'rejected' }
    })

    // Notify owner
    await createNotification({
      user_id: property.owner_id,
      type: 'property_rejected',
      title: 'Property Listing Update',
      message: `Your property "${property.name}" request was not approved. ${reason ? `Reason: ${reason}` : 'Please review your listing and try again.'}`,
      link: `/owner/properties/${propertyId}/edit`
    })

    revalidatePath('/admin/properties')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/owner/properties/${propertyId}`)
    revalidatePath(`/properties/${propertyId}`)
    revalidatePath('/')
  } catch (error) {
    console.error('REJECT PROPERTY ERROR:', error)
    throw error
  }
}

export async function deleteProperty(propertyId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { name: true }
    })

    if (!property) throw new Error('Property not found')

    await prisma.property.delete({
      where: { id: propertyId }
    })

    const paths = ['/admin/properties', '/admin/dashboard', '/search', '/']
    paths.forEach(path => revalidatePath(path))
    
    return { success: true, message: `Property "${property.name}" and all its associated data have been wiped.` }
  } catch (error) {
    console.error('DELETE PROPERTY ERROR:', error)
    throw new Error('Failed to delete property')
  }
}

export async function getPlatformUsers() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const users = await prisma.profile.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        avatar_url: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return users
  } catch (error) {
    console.error('Error fetching platform users:', error)
    return []
  }
}

export async function updateUserRole(userId: string, role: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.profile.update({
      where: { id: userId },
      data: { role }
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/dashboard')
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

export async function getPublicPlatformAnalytics() {
  try {
    const [totalUsers, totalProperties, reviewStats] = await Promise.all([
      prisma.profile.count(),
      prisma.property.count({ where: { status: 'approved' } }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ])

    return {
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      averageRating: reviewStats._avg.rating || 5.0
    }
  } catch (error) {
    console.error('Error fetching public analytics:', error)
    return {
      totalUsers: 0,
      totalProperties: 0,
      averageRating: 5.0
    }
  }
}

export async function getPlatformAnalytics() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const [
      totalUsers,
      totalProperties,
      approvedCount,
      totalBookings,
      totalReviews,
      paymentStats,
      reviewStats,
      ownerCount,
      adminCount
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
      }),
      prisma.profile.count({ where: { role: 'owner' } }),
      prisma.profile.count({ where: { role: 'admin' } })
    ])

    return {
      totalUsers: totalUsers || 0,
      totalProperties: totalProperties || 0,
      approvedProperties: approvedCount || 0,
      totalBookings: totalBookings || 0,
      totalReviews: totalReviews || 0,
      totalRevenue: Number(paymentStats._sum.amount || 0),
      averageRating: reviewStats._avg.rating || 0,
      totalOwners: ownerCount || 0,
      totalAdmins: adminCount || 0
    }
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    throw error
  }
}

export async function getPlatformFinancialReport() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    // 1. Get all payments
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
    })

    // 2. Aggregate by month
    const monthlyRevenue: Record<string, number> = {}
    payments.forEach(p => {
      const month = format(new Date(p.created_at), 'MMM yyyy')
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(p.amount)
    })

    // 3. Top earning properties
    const propertyEarnings: Record<string, number> = {}
    payments.forEach(p => {
      const name = p.booking?.property?.name || 'Unknown'
      propertyEarnings[name] = (propertyEarnings[name] || 0) + Number(p.amount)
    })

    return {
      payments: payments.map(p => ({ ...p, amount: Number(p.amount) })),
      monthlyRevenue,
      topProperties: Object.entries(propertyEarnings)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    }
  } catch (error) {
    console.error('Error fetching financial report:', error)
    throw error
  }
}

export async function getPlatformBookings(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar_url: true
          }
        },
        property: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            main_image_url: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return bookings.map(b => ({
      ...b,
      total_price: Number(b.total_price),
      guest: b.user // Rename for compatibility
    })) as any
  } catch (error) {
    console.error('Error fetching platform bookings:', error)
    return []
  }
}

export async function getPlatformPayments(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        booking: {
          select: {
            id: true,
            check_in: true,
            check_out: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return payments.map(p => ({
      ...p,
      amount: Number(p.amount)
    })) as any
  } catch (error) {
    console.error('Error fetching platform payments:', error)
    return []
  }
}

export async function getPlatformReviews() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true
          }
        },
        property: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return reviews
  } catch (error) {
    console.error('Error fetching platform reviews:', error)
    return []
  }
}

export async function deleteReview(reviewId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  try {
    await prisma.review.delete({
      where: { id: reviewId }
    })

    revalidatePath('/admin/reviews')
    revalidatePath('/admin/dashboard')
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}

