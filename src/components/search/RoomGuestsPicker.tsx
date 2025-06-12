"use client";

import { useState } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { RoomGuestCounts } from "@/lib/types/search";

interface RoomsGuestsPickerProps {
  value: RoomGuestCounts;
  onChange: (counts: RoomGuestCounts) => void;
}

export default function RoomsGuestsPicker({ value, onChange }: RoomsGuestsPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatCounts = (counts: RoomGuestCounts) => {
    const totalGuests = counts.adults + counts.children;
    const roomText = counts.rooms === 1 ? "Room" : "Rooms";
    const guestText = totalGuests === 1 ? "Guest" : "Guests";

    return `${counts.rooms} ${roomText} - ${totalGuests} ${guestText}`;
  };

  const updateCount = (field: keyof RoomGuestCounts, increment: boolean) => {
    const newValue = { ...value };

    if (increment) {
      newValue[field] = Math.min(newValue[field] + 1, 30);
    } else {
      const minValues = { rooms: 1, adults: 1, children: 0 };
      newValue[field] = Math.max(newValue[field] - 1, minValues[field]);
    }

    onChange(newValue);
  };

  const CounterRow = ({
    label,
    description,
    value: count,
    field,
    min = 0,
    max = 30,
  }: {
    label: string;
    description?: string;
    value: number;
    field: keyof RoomGuestCounts;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateCount(field, false)}
          disabled={count <= min}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateCount(field, true)}
          disabled={count >= max}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-12 px-3"
        >
          <Users className="mr-2 h-4 w-4" />
          <span className="flex-1 truncate">{formatCounts(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-1">
          <CounterRow
            label="Adults"
            description="> 12 years"
            value={value.adults}
            field="adults"
            min={1}
          />
          <Separator />
          <CounterRow
            label="Children"
            description="2 - 12 years"
            value={value.children}
            field="children"
            min={0}
          />
          <Separator />
          <CounterRow label="Rooms" value={value.rooms} field="rooms" min={1} />
        </div>
        <div className="pt-4">
          <Button
            onClick={() => setIsOpen(false)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
