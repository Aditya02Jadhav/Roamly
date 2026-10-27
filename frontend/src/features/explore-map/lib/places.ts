export type PlaceCategory =
  | "Attractions"
  | "Food & Cafés"
  | "Culture"
  | "Hidden Gems"
  | "Shopping"
  | "Nature";

export type ExplorePlace = {
  id: string;
  name: string;
  title: string;
  category: PlaceCategory;
  badge: string;
  location: string;
  distance: string;
  rating: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  mapPosition: { top: string; left: string };
  saved?: boolean;
  gem?: boolean;
  icon: string;
  color: string;
};

export const placeCategories: {
  name: PlaceCategory;
  icon: string;
  color: string;
}[] = [
  { name: "Attractions", icon: "fort", color: "text-[#D35400]" },
  { name: "Food & Cafés", icon: "restaurant", color: "text-tertiary" },
  { name: "Culture", icon: "palette", color: "text-[#4A3DB5]" },
  { name: "Hidden Gems", icon: "auto_awesome", color: "text-primary-container" },
  { name: "Shopping", icon: "storefront", color: "text-[#7E22CE]" },
  { name: "Nature", icon: "park", color: "text-tertiary-container" },
];

export const explorePlaces: ExplorePlace[] = [
  {
    id: "nahargarh",
    name: "Nahargarh Fort",
    title: "Nahargarh Fort & Sunset Point",
    category: "Hidden Gems",
    badge: "Hidden Gem · Scenic Viewpoint",
    location: "Aravalli Hills, Jaipur · 25 mins from Old City",
    distance: "Aravalli Hills · 25m from Old City",
    rating: "4.8",
    description:
      "Perched dramatically on the ridge of the Aravalli Hills, offering panoramic sunset views across the entire Pink City and peaceful stepwells. A favorite evening gathering spot.",
    tags: ["Panoramic Views", "Golden Hour", "Stepwell Architecture"],
    image: "/images/nahargarh-fort.jpg",
    imageAlt:
      "Amber-colored Nahargarh Fort overlooking Jaipur at golden hour",
    mapPosition: { top: "28%", left: "45%" },
    gem: true,
    icon: "wb_twilight",
    color: "bg-primary-container",
  },
  {
    id: "patrika",
    name: "Patrika Gate & Circle",
    title: "Patrika Gate & Jawahar Circle",
    category: "Culture",
    badge: "Culture · Historic Gate",
    location: "Jawahar Circle, Sanganer · 20 mins from Center",
    distance: "Jawahar Circle · Sanganer",
    rating: "4.7",
    description:
      "An intricately hand-painted monumental gateway displaying colorful murals of royal battles, traditional weddings, and architectural heritage from across Rajasthan.",
    tags: ["Rajasthani Murals", "Photography Spot", "Lush Circular Park"],
    image: "/images/patrika-gate.jpg",
    imageAlt:
      "Colorfully painted arches and murals of Patrika Gate in Jaipur",
    mapPosition: { top: "82%", left: "49%" },
    icon: "temple_hindu",
    color: "bg-[#4A3DB5]",
  },
  {
    id: "tapri",
    name: "Tapri Central",
    title: "Tapri Central Tea Lounge",
    category: "Food & Cafés",
    badge: "Food & Café · Rooftop",
    location: "C-Scheme, Ashok Nagar · Opposite Central Park",
    distance: "C-Scheme · Opposite Central Park",
    rating: "4.6",
    description:
      "Beloved neighborhood rooftop cafe famed for spiced Kullad chai, dal pakwan, and serene green park canopy views. An essential local hangout.",
    tags: ["Artisanal Chai", "Rooftop Vibe", "Local Snacks"],
    image: "/images/tapri-central.jpg",
    imageAlt: "Rooftop chai lounge overlooking Central Park in Jaipur",
    mapPosition: { top: "68%", left: "40%" },
    icon: "local_cafe",
    color: "bg-tertiary",
  },
  {
    id: "anokhi",
    name: "Anokhi Museum",
    title: "Anokhi Museum of Hand Printing",
    category: "Hidden Gems",
    badge: "Hidden Gem · Heritage Haveli",
    location: "Amer Village · 10 mins walk from Amer Fort",
    distance: "Amer · 10m walk from Fort",
    rating: "4.8",
    description:
      "A beautifully restored 16th-century stone haveli exhibiting indigenous wooden block-printing methods, natural dye vats, and master craftsman demonstrations.",
    tags: ["Textile Arts", "Live Demonstrations", "Restored Haveli"],
    image: "/images/anokhi-museum.jpg",
    imageAlt: "Block printing crafts and textiles at Anokhi Museum",
    mapPosition: { top: "18%", left: "72%" },
    gem: true,
    icon: "auto_awesome",
    color: "bg-primary-container",
  },
  {
    id: "johari",
    name: "Johari & Bapu Bazaar",
    title: "Johari & Bapu Bazaar",
    category: "Shopping",
    badge: "Shopping · Historic Bazaar",
    location: "Old City Market Quarter · Near Johari Bazar Rd",
    distance: "Old City · Near Sanganeri Gate",
    rating: "4.5",
    description:
      "Jaipur's quintessential pink colonnaded street bazaar bustling with silver filigree ornaments, hand-embroidered textiles, lacquer bangles, and spicy street treats.",
    tags: ["Blue Pottery", "Silver Jewelry", "Traditional Textiles"],
    image: "/images/johari-bazaar.jpg",
    imageAlt: "Pink City bazaar street with traditional shops in Jaipur",
    mapPosition: { top: "52%", left: "60%" },
    icon: "shopping_bag",
    color: "bg-[#7E22CE]",
  },
  {
    id: "jal-mahal",
    name: "Jal Mahal",
    title: "Jal Mahal",
    category: "Attractions",
    badge: "Attraction · Water Palace",
    location: "Amer Road · Man Sagar Lake",
    distance: "Amer Road · Man Sagar Lake",
    rating: "4.6",
    description:
      "A graceful sandstone palace surrounded by the calm waters of Man Sagar Lake.",
    tags: ["Lake Views", "Architecture", "Photography"],
    image: "/images/jal-mahal.jpg",
    imageAlt: "Jal Mahal palace reflected in Man Sagar Lake in Jaipur",
    mapPosition: { top: "22%", left: "68%" },
    saved: true,
    icon: "fort",
    color: "bg-[#D35400]",
  },
];

export const savedPlaceNames = [
  "Hawa Mahal",
  "City Palace",
  "Amer Fort",
  "Jal Mahal",
] as const;
