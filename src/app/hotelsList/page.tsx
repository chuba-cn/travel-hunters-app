import HotelSearchForm from "@/components/search/HotelSearchForm";
import HotelResultsPage from "@/components/hotels/HotelResultsPage";
import { ResultsPageSkeleton } from "@/components/hotels/ResultsPageSkeleton";
import { fetchHotels } from "@/lib/api";
import type { HotelFilters } from "@/lib/types/hotel";
import { cleanFiltersForApi } from "@/lib/utils";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
interface HotelsListPageProps {
  searchParams: SearchParams;
}

export default async function HotelsListPage({
  searchParams,
}: HotelsListPageProps) {

  const resolvedSearchParams = await searchParams;

  const initialFilters = cleanFiltersForApi({
    ...resolvedSearchParams,
    page: 1,
  });

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <HotelSearchForm />
      <Suspense fallback={<ResultsPageSkeleton />}>
        <HotelsDataFetcher initialFilters={initialFilters} />
      </Suspense>
    </main>
  );
}

async function HotelsDataFetcher({
  initialFilters,
}: {
  initialFilters: HotelFilters;
}) {
  const initialData = await fetchHotels(initialFilters);
  return (
    <HotelResultsPage
      initialFilters={initialFilters}
      initialHotels={initialData.hotels}
      initialTotal={initialData.total}
    />
  );
}