export interface HotelFilters {
  ss?: string | null;
  page?: number | null;
  pt?: (string | null)[] | null;
  min_price?: number | null;
  max_price?: number | null;
  am?: (string | null)[] | null;
  star_rating?: (number | null)[] | null;
  bt?: (string | null)[] | null;
  payment_type?: (string | null)[] | null;
  ra?: (string | null)[] | null;
  attraction?: (string | null)[] | null;
}

export interface ApiHotelResult {
  id: number;
  hotel_name: string;
  star_rating: number;
  location_city: string;
  location_state: string;
  main_photo: string[];
  exterior_photo: { imgPath: string }[];
  rooms: {
    rooms_rates_per_night: number;
    late_night_deals: boolean;
    late_night_room_rate_off: number;
    rooms_additional_deals: { subItem: string }[];
    roomimages: { image_url: string }[];
  }[];
  amenities: { subItem: string }[];
  urgency_notification_message?: string;
}

export interface ApiHotelResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiHotelResult[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  starRating: number;
  images: string[];
  price: {
    current: number;
    original?: number;
    discount?: number;
  };
  tags: string[];
  review?: {
    text: string;
    author?: string;
  };
}
