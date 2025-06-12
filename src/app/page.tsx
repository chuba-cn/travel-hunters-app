"use client"

import HotelSearchForm from "@/components/search/HotelSearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <HotelSearchForm />
      </div>
    </main>
  );
}
