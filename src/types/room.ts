export interface Room {
  id: string;
  property_id: string;
  name: string;
  description: string;
  price_per_night: number;
  monthly_price?: number;
  capacity: number;
  available_rooms: number;
  bed_type: string | null;
  size_sqm: number | null;
  facilities: string[];
  images?: string[];
  created_at: string;
  updated_at: string;
}

export type CreateRoomInput = Omit<Room, 'id' | 'created_at' | 'updated_at'>;
export type UpdateRoomInput = Partial<CreateRoomInput>;

export const COMMON_FACILITIES = [
  'Free Wi-Fi',
  'Air Conditioning',
  'TV',
  'Balcony',
  'Private Bathroom',
  'Breakfast Included',
  'Mini Bar',
  'Coffee Machine',
  'Desk',
  'Safe Box'
];
