export type ItineraryOption = {
  id: string;
  title: string;
  description: string;
  price: string;
  stopCount: number;
  stopDescription: string;
  pace: string;
  image: string;
  imageAlt: string;
  recommended?: boolean;
  highlights: string[];
  dayOutline: string[];
};

export const itineraryOptions: ItineraryOption[] = [
  {
    id: "balanced",
    title: "Balanced Explorer",
    description: "A little culture, great food and iconic sights.",
    price: "₹45,000",
    stopCount: 14,
    stopDescription: "curated stops",
    pace: "Balanced",
    image: "/images/kyoto-balanced.jpg",
    imageAlt:
      "Scenic Kyoto historic street in Gion with traditional machiya houses.",
    recommended: true,
    highlights: [
      "Fushimi Inari Taisha morning hike",
      "Kiyomizu-dera wooden stage",
      "Nishiki Market street food tasting",
      "Arashiyama bamboo grove & monkeys",
    ],
    dayOutline: [
      "Historic Kyoto & Gion",
      "Arashiyama & Bamboo Groves",
      "Food & Nishiki Market",
      "Fushimi Inari & Southern Temples",
      "Crafts & Departure",
    ],
  },
  {
    id: "budget",
    title: "Budget Smart",
    description: "Make every rupee count without missing the essentials.",
    price: "₹32,000",
    stopCount: 11,
    stopDescription: "curated stops",
    pace: "Value-focused",
    image: "/images/kyoto-budget.jpg",
    imageAlt:
      "A quiet path alongside Kyoto's Kamogawa riverbank at dusk.",
    highlights: [
      "Free temple grounds & scenic gardens",
      "Affordable local ramen & bento gems",
      "Kamogawa riverbank sunset walk",
      "Scenic walking routes & bus transit",
    ],
    dayOutline: [
      "Free Heritage Walk & Gion",
      "Kamogawa River & Local Eateries",
      "Northern Kyoto Zen Temples",
      "Fushimi Inari Outer Trails",
      "Local Markets & Souvenirs",
    ],
  },
  {
    id: "slow",
    title: "Slow Travel",
    description: "Fewer stops, deeper experiences and time to unwind.",
    price: "₹48,000",
    stopCount: 8,
    stopDescription: "immersive stops",
    pace: "Relaxed",
    image: "/images/kyoto-slow.jpg",
    imageAlt:
      "A quiet Kyoto Zen rock garden with raked gravel and lush green moss.",
    highlights: [
      "Traditional Machiya tea ceremony",
      "Unhurried morning strolls through Higashiyama",
      "Private Zen rock garden contemplation",
      "Artisanal kaiseki dining experience",
    ],
    dayOutline: [
      "Slow Arrival & Tea in Gion",
      "Philosophy's Path & Nanzen-ji",
      "Artisan Workshops & Pottery",
      "Daitoku-ji Zen Gardens & Tea",
      "Leisurely Morning & Departure",
    ],
  },
];
