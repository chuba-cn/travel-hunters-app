import {
  Building,
  Globe,
  Star,
  CreditCard,
  Bed,
  ShieldCheck,
  Map,
} from "lucide-react";

export const POPULAR_FILTERS = [
  { id: "pt-hotel", label: "Hotel", group: "pt", value: "hotel" },
  { id: "bt-double", label: "Double Bed", group: "bt", value: "double" },
  { id: "pt-apart", label: "Apartments", group: "pt", value: "apartments" },
  { id: "am-english", label: "English", group: "am", value: "english" },
];

export const FILTER_SECTIONS = [
  {
    id: "pt",
    title: "Property type",
    icon: Building,
    options: [
      "Hotel",
      "Apartments",
      "Guest House",
      "Hostel",
      "Inn",
      "Bungalow",
      "Lodge",
      "Serviced Apartments",
    ],
  },
  {
    id: "am",
    title: "Language adaptations",
    icon: Globe,
    options: ["English", "French", "Spanish", "Arabic", "Mandarine"],
  },
  {
    id: "star_rating",
    title: "Star rating",
    icon: Star,
    options: [5, 4, 3, 2, 1],
  },
  {
    id: "payment_type",
    title: "Payment",
    icon: CreditCard,
    options: ["Pay At Hotel", "Book On Hold", "Reserve Now, Pay Later"],
  },
  {
    id: "bt",
    title: "Bed type",
    icon: Bed,
    options: [
      "Single",
      "Double",
      "Queen Bed",
      "King",
      "Double Bed",
      "Super King",
    ],
  },
  {
    id: "ra",
    title: "Room amenities",
    icon: ShieldCheck,
    options: ["Washing Machine", "Refrigerator", "Air Condition", "Bathtub"],
  },
  {
    id: "attraction",
    title: "Proximity to Attractions",
    icon: Map,
    options: ["Airport", "Restaurants", "Recreational Parks", "Shopping Mall"],
  },
];
