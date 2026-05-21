export type PropertyStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  description: string;
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  main_image_url?: string;
  images?: string[];
  amenities?: string[];
  status: PropertyStatus;
  
  // New pricing & category fields
  is_whole_unit: boolean;
  offers_monthly: boolean;
  offers_daily: boolean;
  monthly_price?: number;
  daily_price?: number;
  starting_price?: number | null;
  max_guests: number;

  host?: {
    full_name: string;
    avatar_url: string | null;
    created_at: string;
  };
  created_at: string;
  updated_at: string;
}

export type CreatePropertyInput = Omit<Property, 'id' | 'owner_id' | 'status' | 'created_at' | 'updated_at'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput> & { status?: PropertyStatus };
