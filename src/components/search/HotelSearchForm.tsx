"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LocationSearchInput from "./LocationSearchInput";
import DateRangePicker from "./DateRangePicker";
import { useSearchParams } from "../hooks/useSearchParams";
import { searchFormSchema, type SearchFormData } from "@/lib/types/search";
import { format } from "date-fns";
import RoomsGuestsPicker from "./RoomGuestsPicker";

export default function HotelsSearchForm() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: searchParams.ss || "",
      startDate: searchParams.start_date || undefined,
      endDate: searchParams.end_date || undefined,
      roomCount: searchParams.room_count || 1,
      adultCount: searchParams.adult_count || 1,
      childCount: searchParams.child_count || 0,
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    await setSearchParams({
      ss: data.location,
      start_date: data.startDate,
      end_date: data.endDate,
      room_count: data.roomCount,
      adult_count: data.adultCount,
      child_count: data.childCount,
    });

    const params = new URLSearchParams({
      ss: data.location,
      start_date: format(data.startDate, "yyyy-MM-dd"),
      end_date: format(data.endDate, "yyyy-MM-dd"),
      room_count: data.roomCount.toString(),
      adult_count: data.adultCount.toString(),
      child_count: data.childCount.toString(),
    });

    router.push(`/hotelsList?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-green-700 border-b-2 border-green-600">
            <span>🏨</span>
            <span className="font-medium">Hotels</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-gray-500">
            <span>🏖️</span>
            <span className="font-medium">Tour Packages</span>
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LocationSearchInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Where are you going?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateRangePicker
                      value={{
                        from: field.value,
                        to: form.watch("endDate"),
                      }}
                      onChange={(range) => {
                        field.onChange(range.from);
                        if (range.to) {
                          form.setValue("endDate", range.to);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomCount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RoomsGuestsPicker
                      value={{
                        rooms: field.value,
                        adults: form.watch("adultCount"),
                        children: form.watch("childCount"),
                      }}
                      onChange={(counts) => {
                        field.onChange(counts.rooms);
                        form.setValue("adultCount", counts.adults);
                        form.setValue("childCount", counts.children);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium text-base"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
