import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { LocationSuggestion } from "@/lib/types/search";

export function useLocationSearch() {
  const [ query, setQuery ] = useState("");
  const [ suggestions, setSuggestions ] = useState<LocationSuggestion[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ debouncedQuery ] = useDebounce(query, 300);

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const mockSuggestions: LocationSuggestion[] = [
        {
          id: "1",
          name: `${searchQuery} City Center`,
          type: "city",
          region: "Downtown",
          country: "Country",
        },
        {
          id: "2",
          name: `${searchQuery} Beach Resort`,
          type: "hotel",
          region: "Coastal Area",
          country: "Country",
        },
        {
          id: "3",
          name: `${searchQuery} International Airport`,
          type: "landmark",
          region: "Airport District",
          country: "Country",
        },
      ];
      
      await new Promise((resolve) => setTimeout(resolve, 200));

      setSuggestions(mockSuggestions);
      // const response = await fetch(
      //   `/api/locations/search?q=${encodeURIComponent(searchQuery)}`
      // );
      // const data = await response.json();
    } catch (error) {
      console.error("Failed to search locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    searchLocations(debouncedQuery)
  }, [ debouncedQuery, searchLocations ]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading
  }
}