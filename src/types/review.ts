import { Profile } from './profile'
import { Property } from './property'

export interface Review {
  id: string
  user_id: string
  property_id: string
  booking_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  
  // Optional relations
  user?: Profile
  property?: Property
}

export interface ReviewWithRelations extends Review {
  user: Profile
  property: Property
}

export interface CreateReviewInput {
  booking_id: string
  property_id: string
  rating: number
  comment: string
}
