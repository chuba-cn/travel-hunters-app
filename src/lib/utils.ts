import type {
  ApiLocationSuggestion,
  ProcessedLocationSuggestion,
} from "./types/search";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiHotelResult, Hotel, HotelFilters } from "./types/hotel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

export function mapApiLocationsToSuggestions(
  data: ApiLocationSuggestion[]
): ProcessedLocationSuggestion[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item, index) => {
      let primaryText = "";
      let secondaryText = "";
      let type: "hotel" | "city" | "state" = "city";

      if (item.matched_by_hotel_name && item.hotel_name) {
        type = "hotel";
        primaryText = item.hotel_name;
        secondaryText = [
          item.location_city,
          item.location_state,
          item.location_country,
        ]
          .filter(Boolean)
          .join(", ");
      } else if (item.matched_by_location_city && item.location_city) {
        type = "city";
        primaryText = item.location_city;
        secondaryText = [item.location_state, item.location_country]
          .filter(Boolean)
          .join(", ");
      } else if (item.matched_by_location_state && item.location_state) {
        type = "state";
        primaryText = item.location_state;
        secondaryText = item.location_country;
      } else {
        return null;
      }

      return {
        id: `${index}-${primaryText}`,
        primaryText,
        secondaryText,
        type,
      };
    })
    .filter((item): item is ProcessedLocationSuggestion => item !== null);
}

const INVALID_HOSTNAMES = [ "example.com", "placeholder.com" ];

export function mapApiHotelToViewModel(apiHotel: ApiHotelResult): Hotel {
  const lowestPrice = Math.min(
    ...apiHotel.rooms.map((room) => room.rooms_rates_per_night),
    Infinity
  );

  const cheapestRoom = apiHotel.rooms.find(
    (room) => room.rooms_rates_per_night === lowestPrice
  );

  let currentPrice = lowestPrice;
  let originalPrice: number | undefined;
  let discount: number | undefined;

  if (
    cheapestRoom?.late_night_deals &&
    cheapestRoom.late_night_room_rate_off > 0
  ) {
    discount = cheapestRoom.late_night_room_rate_off;
    originalPrice = lowestPrice;
    currentPrice = originalPrice * (1 - discount / 100);
  }

  const tags = new Set<string>();

  if (apiHotel.urgency_notification_message) {
    tags.add(apiHotel.urgency_notification_message);
  }
  const hasBreakfast = apiHotel.rooms.some((room) =>
    room.rooms_additional_deals?.some((deal) =>
      deal.subItem.toLowerCase().includes("breakfast")
    )
  );

  if (hasBreakfast) {
    tags.add("Breakfast Included");
  }

  if (
    apiHotel.amenities.some((a) => a.subItem?.toLowerCase().includes("wifi"))
  ) {
    tags.add("Wifi");
  }

  let review: Hotel["review"] | undefined;

  if (apiHotel.urgency_notification_message) {
    review = { text: apiHotel.urgency_notification_message };
  } else if (tags.size > 0) {
    tags.add(Array.from(tags)[0]);
  }

  const allImageUrls = new Set<string>();
  apiHotel.main_photo?.forEach((img) => allImageUrls.add(img));
  apiHotel.exterior_photo?.forEach((photo) => allImageUrls.add(photo.imgPath));
  apiHotel.rooms.forEach((room) => {
    room.roomimages?.forEach((img) => allImageUrls.add(img.image_url));
  });

  const validImages = Array.from(allImageUrls)
    .filter((src): src is string => {

      if (!src || typeof src !== "string") return false;
      try {

        const url = new URL(src);
        return !INVALID_HOSTNAMES.includes(url.hostname);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return false;
      }
    })
    .slice(0, 10);


  if (validImages.length === 0) {

    validImages.push("https://placehold.co/400");
  }

  return {
    id: String(apiHotel.id),
    name: apiHotel.hotel_name,
    location: [apiHotel.location_city, apiHotel.location_state]
      .filter(Boolean)
      .join(", "),
    starRating: Math.round(apiHotel.star_rating),
    images: validImages,
    price: {
      current: currentPrice,
      original: originalPrice,
      discount: discount,
    },
    tags: Array.from(tags),
    review: review,
  };
}

/**
 * Cleans the filter object from nuqs, converting null values to undefined
 * so it matches the expected type for our API calls.
 * @param filters The raw filter object from useQueryStates.
 * @returns A cleaned filter object compatible with our API service.
 */
export function cleanFiltersForApi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: Record<string, any>
): HotelFilters {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanedFilters: Record<string, any> = {};

  for (const key in filters) {
    const value = filters[key];

    if (value !== null && value !== undefined) {
      if (!Array.isArray(value) || value.length > 0) {
        cleanedFilters[key] = value;
      }
    }
  }

  return cleanedFilters as HotelFilters;
}
