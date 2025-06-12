"use client";

import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs";
import { HotelFilters as HotelFiltersComponent } from "./HotelFilters";
import { HotelCard } from "./HotelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchHotels } from "@/lib/api";
import type { Hotel, HotelFilters } from "@/lib/types/hotel";

interface HotelResultsPageProps {
  initialFilters: HotelFilters;
  initialHotels: Hotel[];
  initialTotal: number;
}

export default function HotelResultsPage({
  initialFilters,
  initialHotels,
  initialTotal,
}: HotelResultsPageProps) {
  const [filters, setFilters] = useQueryStates({
    ss: parseAsString,
    page: parseAsInteger.withDefault(1),
    pt: parseAsArrayOf(parseAsString),
    min_price: parseAsInteger,
    max_price: parseAsInteger,
    am: parseAsArrayOf(parseAsString),
    star_rating: parseAsArrayOf(parseAsInteger),
    bt: parseAsArrayOf(parseAsString),
    payment_type: parseAsArrayOf(parseAsString),
    ra: parseAsArrayOf(parseAsString),
    attraction: parseAsArrayOf(parseAsString),
  });

  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [total, setTotal] = useState(initialTotal);
  const [isPending, startTransition] = useTransition();
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  useEffect(() => {

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      return;
    }

    startTransition(() => {
      fetchHotels({ ...filters, page: 1 }).then((data) => {
        setHotels(data.hotels);
        setTotal(data.total);
      });
    });
  }, [filters, initialFilters]);


  useEffect(() => {
    const hasMore = hotels.length < total;

    if (inView && !isPending && hasMore) {
      startTransition(() => {
        const nextPage = (filters.page || 1) + 1;

        fetchHotels({ ...filters, page: nextPage }).then((data) => {
          setHotels((prev) => [...prev, ...data.hotels]);
          setFilters({ page: nextPage });
        });
      });
    }
  }, [inView, isPending, hotels.length, total, filters, setFilters]);
  
  const handleFilterChange = (newFilters: Partial<HotelFilters>) => {
    setFilters({
      ...newFilters,
      page: 1,
      pt: newFilters.pt ? newFilters.pt.filter((item): item is string => item !== null) : undefined,
      am: newFilters.am ? newFilters.am.filter((item): item is string => item !== null) : undefined,
      star_rating: newFilters.star_rating ? newFilters.star_rating.filter((item): item is number => item !== null) : undefined,
      bt: newFilters.bt ? newFilters.bt.filter((item): item is string => item !== null) : undefined,
      payment_type: newFilters.payment_type ? newFilters.payment_type.filter((item): item is string => item !== null) : undefined,
      ra: newFilters.ra ? newFilters.ra.filter((item): item is string => item !== null) : undefined,
      attraction: newFilters.attraction ? newFilters.attraction.filter((item): item is string => item !== null) : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <HotelFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </aside>

      <section className="lg:col-span-3 space-y-6">
        <h2 className="text-2xl font-bold">
          {isPending ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            `${total} Properties found in ${filters.ss || "your destination"}`
          )}
        </h2>
        <div className="space-y-4">
          {isPending && hotels.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))
            : hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
        </div>

        {isPending && hotels.length > 0 && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        )}

        {hotels.length < total && !isPending && (
          <div ref={ref} className="h-10" />
        )}
      </section>
    </div>
  );
}

function HotelCardSkeleton() {
  return (
    <div className="flex bg-white border rounded-lg p-4 space-x-4">
      <Skeleton className="h-48 w-1/4 rounded-md" />
      <div className="w-3/4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex-grow" />
        <div className="flex justify-between items-end pt-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-12 w-28" />
        </div>
      </div>
    </div>
  );
}
