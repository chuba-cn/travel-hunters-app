/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { POPULAR_FILTERS, FILTER_SECTIONS } from "@/lib/constants";
import { StarRating } from "./StarRating";
import type { HotelFilters } from "@/lib/types/hotel";

interface HotelFiltersProps {
  filters: HotelFilters;
  onFilterChange: (newFilters: Partial<HotelFilters>) => void;
}

export function HotelFilters({ filters, onFilterChange }: HotelFiltersProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [localPrice, setLocalPrice] = useState([
    filters.min_price || 5000,
    filters.max_price || 500000,
  ]);

  const handleCheckboxChange = (
    group: keyof HotelFilters,
    value: string | number,
    checked: boolean
  ) => {
    const currentValues = (filters[group] as any[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange({ [group]: newValues });
  };

  const handlePriceCommit = () => {
    onFilterChange({ min_price: localPrice[0], max_price: localPrice[1] });
  };


  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full mb-4"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Sort & Filter
      </Button>

      {showFilters && (
        <div className="space-y-6 animate-in fade-in-0 duration-300">
          {/* Popular Filters */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Popular filters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {POPULAR_FILTERS.map((filter) => (
                <div key={filter.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={filter.id}
                    checked={(
                      filters[filter.group as keyof HotelFilters] as any[]
                    )?.includes(filter.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        filter.group as keyof HotelFilters,
                        filter.value,
                        !!checked
                      )
                    }
                  />
                  <label htmlFor={filter.id} className="text-sm">
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 text-center">
              Filter according to your budget
            </h3>
            <Slider
              value={localPrice}
              onValueChange={setLocalPrice}
              min={5000}
              max={500000}
              step={1000}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>from ₦{localPrice[0].toLocaleString()}</span>
              <span>to ₦{localPrice[1].toLocaleString()}</span>
            </div>
            <Button
              onClick={handlePriceCommit}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Find Affordable hotels
            </Button>
          </div>

          {/* Accordion Filters */}
          <Accordion type="multiple" className="w-full">
            {FILTER_SECTIONS.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <section.icon className="h-5 w-5" />
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {section.options.map((option) => (
                      <div
                        key={`${section.id}-${option}`}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${section.id}-${option}`}
                          checked={(
                            filters[section.id as keyof HotelFilters] as any[]
                          )?.includes(
                            typeof option === "number"
                              ? option
                              : String(option).toLowerCase().replace(/ /g, "_")
                          )}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              section.id as keyof HotelFilters,
                              typeof option === "number"
                                ? option
                                : String(option)
                                    .toLowerCase()
                                    .replace(/ /g, "_"),
                              !!checked
                            )
                          }
                        />
                        {section.id === "star_rating" ? (
                          <StarRating rating={option as number} />
                        ) : (
                          <label
                            htmlFor={`${section.id}-${option}`}
                            className="text-sm"
                          >
                            {option}
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}


