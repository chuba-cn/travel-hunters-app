// components/hotels/HotelCard.tsx
"use client";

import Image from "next/image";
import { MapPin, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import type { Hotel } from "@/lib/types/hotel";
import { cn, formatPrice } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="w-full md:w-1/3 lg:w-1/4 relative">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {hotel.images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-48 md:h-full">
                  <Image
                    src={src}
                    alt={`${hotel.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {hotel.images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </>
          )}
        </Carousel>
        <button className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-700 hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {hotel.review && (
          <p className="text-xs text-gray-600 mb-2">
            <span className="text-red-500">♥</span> &quot;{hotel.review.text}
            &quot; by {hotel.review.author}
          </p>
        )}
        <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{hotel.location}</span>
        </div>
        <div className="my-2">
          <StarRating rating={hotel.starRating} />
        </div>
        <div className="flex flex-wrap gap-2">
          {hotel.tags.map((tag) => (
            <Badge
              key={tag}
              variant={
                tag === "Book now, pay later" || tag === "Breakfast Included"
                  ? "default"
                  : "secondary"
              }
              className={cn(
                tag === "Book now, pay later" || tag === "Breakfast Included"
                  ? "bg-blue-500 text-white"
                  : ""
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div className="flex flex-col items-start">
            {hotel.price.discount && (
              <Badge className="bg-yellow-400 text-black mb-1">
                {hotel.price.discount}% OFF
              </Badge>
            )}
            <p className="text-2xl font-bold text-red-600">
              {formatPrice(hotel.price.current)}
            </p>
            {hotel.price.original && (
              <p className="text-sm text-gray-500 line-through">
                was {formatPrice(hotel.price.original)}
              </p>
            )}
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
