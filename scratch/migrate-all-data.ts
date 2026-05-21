import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const prisma = new PrismaClient()

async function migrate() {
  console.log('🚀 Starting Data Migration...');

  try {
    // 1. Migrate Profiles (and Users)
    console.log('👥 Migrating Profiles and Users...');
    const { data: profiles } = await supabase.from('profiles').select('*')
    if (profiles) {
      for (const p of profiles) {
        // Create User first
        await prisma.user.upsert({
          where: { id: p.id },
          update: { email: p.email },
          create: { id: p.id, email: p.email }
        })
        // Create Profile
        await prisma.profile.upsert({
          where: { id: p.id },
          update: {
            full_name: p.full_name,
            email: p.email,
            role: p.role,
            phone: p.phone,
            avatar_url: p.avatar_url,
            status: p.status,
            created_at: new Date(p.created_at)
          },
          create: {
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            role: p.role,
            phone: p.phone,
            avatar_url: p.avatar_url,
            status: p.status,
            created_at: new Date(p.created_at)
          }
        })
      }
      console.log(`✅ Migrated ${profiles.length} profiles.`);
    }

    // 2. Migrate Properties
    console.log('🏠 Migrating Properties...');
    const { data: properties } = await supabase.from('properties').select('*')
    if (properties) {
      for (const p of properties) {
        await prisma.property.upsert({
          where: { id: p.id },
          update: {
            owner_id: p.owner_id,
            name: p.name,
            type: p.type,
            description: p.description,
            country: p.country,
            city: p.city,
            address: p.address,
            main_image_url: p.main_image_url,
            images: p.images || [],
            amenities: p.amenities || [],
            status: p.status,
            latitude: p.latitude,
            longitude: p.longitude,
            created_at: new Date(p.created_at),
            updated_at: new Date(p.updated_at)
          },
          create: {
            id: p.id,
            owner_id: p.owner_id,
            name: p.name,
            type: p.type,
            description: p.description,
            country: p.country,
            city: p.city,
            address: p.address,
            main_image_url: p.main_image_url,
            images: p.images || [],
            amenities: p.amenities || [],
            status: p.status,
            latitude: p.latitude,
            longitude: p.longitude,
            created_at: new Date(p.created_at),
            updated_at: new Date(p.updated_at)
          }
        })
      }
      console.log(`✅ Migrated ${properties.length} properties.`);
    }

    // 3. Migrate Rooms
    console.log('🛌 Migrating Rooms...');
    const { data: rooms } = await supabase.from('rooms').select('*')
    if (rooms) {
      for (const r of rooms) {
        await prisma.room.upsert({
          where: { id: r.id },
          update: {
            property_id: r.property_id,
            name: r.name,
            description: r.description,
            price_per_night: r.price_per_night,
            capacity: r.capacity,
            available_rooms: r.available_rooms,
            bed_type: r.bed_type,
            size_sqm: r.size_sqm,
            facilities: r.facilities as any,
            created_at: new Date(r.created_at),
            updated_at: new Date(r.updated_at)
          },
          create: {
            id: r.id,
            property_id: r.property_id,
            name: r.name,
            description: r.description,
            price_per_night: r.price_per_night,
            capacity: r.capacity,
            available_rooms: r.available_rooms,
            bed_type: r.bed_type,
            size_sqm: r.size_sqm,
            facilities: r.facilities as any,
            created_at: new Date(r.created_at),
            updated_at: new Date(r.updated_at)
          }
        })
      }
      console.log(`✅ Migrated ${rooms.length} rooms.`);
    }

    // 4. Migrate Bookings
    console.log('📅 Migrating Bookings...');
    const { data: bookings } = await supabase.from('bookings').select('*')
    if (bookings) {
      for (const b of bookings) {
        await prisma.booking.upsert({
          where: { id: b.id },
          update: {
            user_id: b.user_id,
            property_id: b.property_id,
            room_id: b.room_id,
            check_in: new Date(b.check_in),
            check_out: new Date(b.check_out),
            guests: b.guests,
            total_price: b.total_price,
            status: b.status,
            created_at: new Date(b.created_at),
            updated_at: new Date(b.updated_at)
          },
          create: {
            id: b.id,
            user_id: b.user_id,
            property_id: b.property_id,
            room_id: b.room_id,
            check_in: new Date(b.check_in),
            check_out: new Date(b.check_out),
            guests: b.guests,
            total_price: b.total_price,
            status: b.status,
            created_at: new Date(b.created_at),
            updated_at: new Date(b.updated_at)
          }
        })
      }
      console.log(`✅ Migrated ${bookings.length} bookings.`);
    }

    // 5. Migrate Payments
    console.log('💳 Migrating Payments...');
    const { data: payments } = await supabase.from('payments').select('*')
    if (payments) {
      for (const py of payments) {
        await prisma.payment.upsert({
          where: { id: py.id },
          update: {
            booking_id: py.booking_id,
            user_id: py.user_id,
            amount: py.amount,
            currency: py.currency,
            method: py.method,
            status: py.status,
            transaction_reference: py.transaction_reference,
            created_at: new Date(py.created_at),
            updated_at: new Date(py.updated_at)
          },
          create: {
            id: py.id,
            booking_id: py.booking_id,
            user_id: py.user_id,
            amount: py.amount,
            currency: py.currency,
            method: py.method,
            status: py.status,
            transaction_reference: py.transaction_reference,
            created_at: new Date(py.created_at),
            updated_at: new Date(py.updated_at)
          }
        })
      }
      console.log(`✅ Migrated ${payments.length} payments.`);
    }

    // 6. Migrate Reviews
    console.log('⭐ Migrating Reviews...');
    const { data: reviews } = await supabase.from('reviews').select('*')
    if (reviews) {
      for (const rv of reviews) {
        await prisma.review.upsert({
          where: { id: rv.id },
          update: {
            user_id: rv.user_id,
            property_id: rv.property_id,
            booking_id: rv.booking_id,
            rating: rv.rating,
            comment: rv.comment,
            created_at: new Date(rv.created_at),
            updated_at: new Date(rv.updated_at)
          },
          create: {
            id: rv.id,
            user_id: rv.user_id,
            property_id: rv.property_id,
            booking_id: rv.booking_id,
            rating: rv.rating,
            comment: rv.comment,
            created_at: new Date(rv.created_at),
            updated_at: new Date(rv.updated_at)
          }
        })
      }
      console.log(`✅ Migrated ${reviews.length} reviews.`);
    }

    console.log('🎉 Migration Completed Successfully!');
  } catch (error) {
    console.error('❌ Migration Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
