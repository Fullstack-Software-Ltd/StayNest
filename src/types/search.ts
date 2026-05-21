export interface SearchFilters {
  destination?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  amenities?: string[];
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
}

export interface PropertySearchResult {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  city: string;
  country: string;
  main_image_url: string | null;
  starting_price: number | null;
  capacity: number;
  average_rating: number | null;
  review_count: number;
  amenities?: string[];
  is_favorited?: boolean;
}
