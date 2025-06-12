import { mapApiHotelToViewModel } from "./utils";
import type { ApiHotelResponse } from "./types/hotel";
import type { HotelFilters } from "./types/hotel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchHotels(filters: HotelFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v).toLowerCase()));
      } else {
        params.append(key, String(value).toLowerCase());
      }
    }
  });

  const url = `${API_BASE_URL}/hotel/hotels/?${params.toString()}`;
  console.log("url: ", url)

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data: ApiHotelResponse = await response.json();

    const processedHotels = data.results.map(mapApiHotelToViewModel);

    return {
      hotels: processedHotels,
      total: data.count,
      nextPageUrl: data.next,
    };
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return { hotels: [], total: 0, nextPageUrl: null };
  }
}
