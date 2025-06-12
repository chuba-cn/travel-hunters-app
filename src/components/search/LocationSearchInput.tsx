"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import type {
  ApiLocationSuggestion,
  ProcessedLocationSuggestion,
} from "@/lib/types/search";
import { mapApiLocationsToSuggestions } from "@/lib/utils";
interface LocationSearchInputProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
}

export default function LocationSearchInput({
  value,
  onChange,
  placeholder = "Where are you going?",
}: LocationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProcessedLocationSuggestion[]>(
    []
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedValue] = useDebounce(value, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const url = `https://sandbox.thetravelhunters.com/hotel/hotels-search/?search=${encodeURIComponent(
          debouncedValue
        )}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: ApiLocationSuggestion[] = await response.json();
        const processedSuggestions = mapApiLocationsToSuggestions(data);

        setSuggestions(processedSuggestions);
        setHighlightedIndex(-1);
        setIsOpen(processedSuggestions.length > 0);
      } catch (error) {
        console.error("Failed to fetch location suggestions:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (value.length > 0 || suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSuggestionSelect = (suggestion: ProcessedLocationSuggestion) => {
    onChange(suggestion.primaryText);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearInput = () => {
    onChange("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base"
          autoComplete="off"
        />
        {value && !isLoading && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {suggestions.length > 0 &&
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 transition-colors text-left",
                  "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                  "first:rounded-t-lg last:rounded-b-lg",
                  highlightedIndex === index && "bg-gray-50"
                )}
              >
                {/* Conditional Icon */}
                {suggestion.type === "hotel" ? (
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  {/* Primary and Secondary Text */}
                  <div className="font-medium text-sm truncate">
                    {suggestion.primaryText}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {suggestion.secondaryText}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );

  // return (
  //   <div ref={containerRef} className="relative w-full">
  //     <div className="relative">
  //       <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
  //       <Input
  //         ref={inputRef}
  //         value={value}
  //         onChange={handleInputChange}
  //         onFocus={handleInputFocus}
  //         onKeyDown={handleKeyDown}
  //         placeholder={placeholder}
  //         className="pl-10 pr-10 h-12 text-base"
  //         autoComplete="off"
  //       />
  //       {value && (
  //         <button
  //           type="button"
  //           onClick={clearInput}
  //           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       )}
  //     </div>

  //     {isOpen && (
  //       <div
  //         ref={dropdownRef}
  //         className={cn(
  //           "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto",
  //           "animate-in fade-in-0 zoom-in-95 duration-100"
  //         )}
  //       >
  //         {isLoading && (
  //           <div className="flex items-center justify-center p-4">
  //             <Search className="h-4 w-4 animate-spin text-muted-foreground" />
  //             <span className="ml-2 text-sm text-muted-foreground">
  //               Searching...
  //             </span>
  //           </div>
  //         )}

  //         {!isLoading && suggestions.length === 0 && value.trim() && (
  //           <div className="p-4 text-sm text-muted-foreground text-center">
  //             No destinations found for &quot;{value}&quot;
  //           </div>
  //         )}

  //         {!isLoading &&
  //           suggestions.map((suggestion, index) => (
  //             <button
  //               key={suggestion.id}
  //               type="button"
  //               onClick={() => handleSuggestionSelect(suggestion)}
  //               onMouseEnter={() => setHighlightedIndex(index)}
  //               className={cn(
  //                 "w-full flex items-center gap-3 p-3 transition-colors text-left",
  //                 "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
  //                 "first:rounded-t-lg last:rounded-b-lg",
  //                 highlightedIndex === index && "bg-gray-50"
  //               )}
  //             >
  //               <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
  //               <div className="flex-1 min-w-0">
  //                 <div className="font-medium text-sm truncate">
  //                   {suggestion.name}
  //                 </div>
  //                 {suggestion.region && (
  //                   <div className="text-xs text-muted-foreground truncate">
  //                     {suggestion.region}
  //                     {suggestion.country && `, ${suggestion.country}`}
  //                   </div>
  //                 )}
  //               </div>
  //             </button>
  //           ))}
  //       </div>
  //     )}
  //   </div>
  // );
}
