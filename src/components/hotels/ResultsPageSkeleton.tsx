import { Skeleton } from "@/components/ui/skeleton";

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

export function ResultsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="p-4 border rounded-lg space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="p-4 border rounded-lg space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </aside>

      <section className="lg:col-span-3 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <HotelCardSkeleton />
          <HotelCardSkeleton />
          <HotelCardSkeleton />
        </div>
      </section>
    </div>
  );
}
