import { z } from 'zod'

// ─── Property Schemas ─────────────────────────────────────────

export const propertySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  country: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  main_image_url: z.string().url().nullable().optional(),
  images: z.array(z.string().url()).min(2, 'At least 2 photos are required').optional().default([]),
  
  // New pricing & category fields
  is_whole_unit: z.boolean().default(false),
  offers_monthly: z.boolean().default(false),
  offers_daily: z.boolean().default(true),
  monthly_price: z.number().optional().nullable(),
  daily_price: z.number().optional().nullable(),
  max_guests: z.number().int().min(1).default(1),
  amenities: z.array(z.string()).optional().default([]),
})

export const roomSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(1, 'Description is required'),
  price_per_night: z.number().positive('Price must be greater than 0'),
  monthly_price: z.number().positive().optional().nullable(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1 guest'),
  available_rooms: z.number().int().min(0),
  bed_type: z.string(),
  size_sqm: z.number().positive(),
  facilities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(2, 'At least 2 photos are required for each room').optional().default([]),
})

// ─── Booking Schemas ──────────────────────────────────────────

export const bookingSchema = z.object({
  property_id: z.string().uuid(),
  room_id: z.string().uuid(),
  check_in: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0,0,0,0)), {
    message: 'Check-in date cannot be in the past'
  }),
  check_out: z.string(),
  guests: z.number().int().min(1),
  total_price: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  converted_price: z.number().optional()
}).refine((data) => new Date(data.check_out) > new Date(data.check_in), {
  message: 'Check-out date must be after check-in date',
  path: ['check_out'],
})

// ─── Review Schemas ───────────────────────────────────────────

export const reviewSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(1000),
})

// ─── Auth Schemas ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, 'Full name is required'),
})

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(100).nullable().optional(),
  legal_name: z.string().max(100).nullable().optional(),
  preferred_name: z.string().max(50).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  language: z.string().max(50).nullable().optional(),
  currency: z.string().max(50).nullable().optional(),
  status: z.string().max(50).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
})
