export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  
  // Optional relations
  property?: {
    name: string;
    city: string;
    country: string;
    address: string;
    type: string;
    main_image_url: string | null;
  };
  room?: {
    name: string;
    description: string;
    price_per_night: number;
    bed_type: string;
  };
  reviews?: { id: string }[];
}

export interface CreateBookingInput {
  property_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  currency: string;
  converted_price?: number;
}
