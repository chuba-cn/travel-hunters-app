import { z } from "zod";

export const searchFormSchema = z.object({
  location: z.string().min(1, "Please select a destination"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select a start date",
  }),
  roomCount: z.number().min(1).max(30),
  adultCount: z.number().min(1).max(30),
  childCount: z.number().min(0).max(30),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;

export interface LocationSuggestion {
  id: string;
  name: string;
  type: "city" | "hotel" | "landmark";
  country?: string;
  region?: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface RoomGuestCounts {
  rooms: number;
  adults: number;
  children: number;
}

export interface ApiLocationSuggestion {
  hotel_name: string;
  location_city: string;
  location_state: string;
  location_country: string;
  matched_by_location_city: boolean;
  matched_by_location_state: boolean;
  matched_by_hotel_name: boolean;
}

export interface ProcessedLocationSuggestion {
  id: string;
  primaryText: string;
  secondaryText: string;
  type: "hotel" | "city" | "state";
}
