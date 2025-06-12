"use client"

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HotelSearchFormSkeleton } from "@/components/search/HotelSearchFormSkeleton";

const HotelSearchForm = dynamic(
  () => import("@/components/search/HotelSearchForm"),
  {
    ssr: false,
    loading: () => <HotelSearchFormSkeleton />,
  }
);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<HotelSearchFormSkeleton />}>
          <HotelSearchForm />
        </Suspense>
      </div>
    </main>
  );
}
