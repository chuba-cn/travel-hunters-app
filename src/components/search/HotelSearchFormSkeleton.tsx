
export function HotelSearchFormSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="flex border-b">
          <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-12 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="h-12 bg-gray-200 rounded-md"></div>

          <div className="h-12 bg-gray-200 rounded-md"></div>

          <div className="h-12 bg-gray-200 rounded-md"></div>

          <div className="w-full h-12 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
