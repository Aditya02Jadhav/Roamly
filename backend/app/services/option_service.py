from datetime import date
from typing import List, Dict, Any
from app.schemas.itinerary_option import EstimatedCost


def _calculate_trip_days(start_date: date, end_date: date) -> int:
    return max(1, (end_date - start_date).days + 1)


def _generate_generic_day_outline(destination: str, days: int, pace_name: str) -> List[str]:
    if days == 1:
        return [f"Full Day: Central {destination} Landmarks & Local Flavors"]
    elif days == 2:
        return [
            f"Day 1: Historic Center & Iconic Landmarks in {destination}",
            f"Day 2: Neighborhood Culture, Food Markets & Departure",
        ]
    elif days == 3:
        return [
            f"Day 1: Arrival, Orientation & Scenic Viewpoint in {destination}",
            f"Day 2: Heritage Sites & Local Culinary Highlights",
            f"Day 3: Neighborhood Crafts, Quiet Parks & Departure",
        ]
    else:
        outlines = [
            f"Day 1: Arrival & Historic Center Walk in {destination}",
            f"Day 2: Iconic Landmarks & Cultural Sights",
            f"Day 3: Local Food Markets & Neighborhood Discovery",
        ]
        for day_num in range(4, min(days, 6)):
            outlines.append(f"Day {day_num}: {pace_name} Excursions & Scenic Surroundings")
        outlines.append(f"Day {days}: Leisure Morning, Local Souvenirs & Departure")
        return outlines


def _get_cost_range(budget: str, days: int, travellers: int) -> tuple[int, int, str]:
    # Daily per-person ranges based on Roamly budget tier standards
    daily_rates = {
        "budget-friendly": (1500, 3000),
        "moderate": (3000, 7000),
        "comfort": (7000, 15000),
        "premium": (15000, 25000),
    }
    min_daily, max_daily = daily_rates.get(budget, (3000, 7000))
    total_min = min_daily * days * max(1, travellers)
    total_max = max_daily * days * max(1, travellers)
    display_str = f"₹{total_min:,} – ₹{total_max:,}"
    return total_min, total_max, display_str


def generate_starter_options(
    destination: str,
    start_date: date,
    end_date: date,
    budget: str,
    adults: int,
    children: int,
) -> List[Dict[str, Any]]:
    """
    Generate starter itinerary options isolated from external APIs.
    Uses destination-specific templates when verified knowledge is available (Kyoto, Goa),
    otherwise provides clearly labelled generic starter options without fabricated facts.
    """
    days = _calculate_trip_days(start_date, end_date)
    travellers = adults + children
    dest_lower = destination.lower()

    if "kyoto" in dest_lower:
        return _kyoto_starter_options(days, budget, travellers)
    elif "goa" in dest_lower:
        return _goa_starter_options(days, budget, travellers)
    else:
        return _generic_starter_options(destination, days, budget, travellers)


def _kyoto_starter_options(days: int, budget: str, travellers: int) -> List[Dict[str, Any]]:
    min_cost, max_cost, display_cost = _get_cost_range(budget, days, travellers)
    
    return [
        {
            "option_key": "balanced",
            "title": "Balanced Explorer",
            "description": "A curated mix of historic shrines, vibrant food markets, and iconic districts.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": max_cost,
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(6, days * 3),
            "stop_description": "curated stops",
            "pace": "Balanced",
            "image": "/images/kyoto-balanced.jpg",
            "image_alt": "Scenic Kyoto historic street in Gion with traditional machiya houses.",
            "recommended": True,
            "highlights": [
                "Fushimi Inari Taisha morning hike",
                "Kiyomizu-dera wooden stage and views",
                "Nishiki Market street food tasting",
                "Arashiyama bamboo grove stroll",
            ],
            "day_outline": [
                "Historic Kyoto & Gion Districts",
                "Arashiyama Groves & Riverside Walk",
                "Nishiki Market Culinary Exploration",
                "Southern Temples & Heritage Paths",
                "Artisan Workshops & Departure",
            ][:days] if days <= 5 else [
                "Historic Kyoto & Gion",
                "Arashiyama & Bamboo Groves",
                "Nishiki Market & Downtown",
                "Fushimi Inari & Southern Temples",
                "Eastern Higashiyama Historic Trails",
                "Crafts & Departure",
            ],
        },
        {
            "option_key": "budget",
            "title": "Budget Smart",
            "description": "Make every rupee count with free heritage grounds, scenic river walks, and local eateries.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": int(min_cost * 0.8),
                "max_amount": int(max_cost * 0.8),
                "basis": "estimated_total_per_trip",
                "display": f"₹{int(min_cost * 0.8):,} – ₹{int(max_cost * 0.8):,}",
            },
            "stop_count": max(5, days * 2),
            "stop_description": "curated stops",
            "pace": "Value-focused",
            "image": "/images/kyoto-budget.jpg",
            "image_alt": "A quiet path alongside Kyoto's Kamogawa riverbank at dusk.",
            "recommended": False,
            "highlights": [
                "Free temple grounds and scenic gardens",
                "Affordable local ramen and bento spots",
                "Kamogawa riverbank sunset walking route",
                "Public bus and subway transit connections",
            ],
            "day_outline": [
                "Free Heritage Walk & Gion",
                "Kamogawa River & Local Eateries",
                "Zen Temple Outer Grounds",
                "Fushimi Inari Outer Forest Trails",
                "Local Markets & Departure",
            ][:days],
        },
        {
            "option_key": "slow",
            "title": "Slow Travel",
            "description": "Fewer daily stops, deeper atmospheric immersion, and leisurely teahouse visits.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": int(max_cost * 1.1),
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(4, days * 2),
            "stop_description": "immersive stops",
            "pace": "Relaxed",
            "image": "/images/kyoto-slow.jpg",
            "image_alt": "A quiet Kyoto Zen rock garden with raked gravel and moss.",
            "recommended": False,
            "highlights": [
                "Traditional Machiya teahouse visit",
                "Unhurried morning strolls through Higashiyama",
                "Quiet Zen rock garden contemplation",
                "Artisanal dining experience",
            ],
            "day_outline": [
                "Slow Arrival & Tea in Gion",
                "Philosophy's Path & Nanzen-ji Grounds",
                "Artisan Workshops & Ceramic Studios",
                "Daitoku-ji Zen Gardens & Courtyards",
                "Leisurely Morning & Departure",
            ][:days],
        },
    ]


def _goa_starter_options(days: int, budget: str, travellers: int) -> List[Dict[str, Any]]:
    min_cost, max_cost, display_cost = _get_cost_range(budget, days, travellers)

    return [
        {
            "option_key": "balanced",
            "title": "Balanced Explorer",
            "description": "Coastal highlights, historic Latin Quarter alleys, vibrant beach shacks, and sunset forts.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": max_cost,
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(6, days * 3),
            "stop_description": "curated stops",
            "pace": "Balanced",
            "image": "/images/goa-balanced.jpg",
            "image_alt": "Golden sunset over Goa shoreline with palm trees and ocean waves.",
            "recommended": True,
            "highlights": [
                "Fontainhas heritage architecture walk",
                "Scenic coastal cliff and fort viewpoints",
                "Authentic Goan seafood thali tasting",
                "Sunset catamaran or seaside lounge",
            ],
            "day_outline": [
                "Arrival & Panjim Latin Quarter (Fontainhas)",
                "North Goa Coastal Forts & Sunset Shacks",
                "Old Goa UNESCO Churches & Spice Plantation",
                "South Goa Serene Beaches & Backwaters",
                "Coastal Souvenirs & Departure",
            ][:days],
        },
        {
            "option_key": "budget",
            "title": "Budget Smart",
            "description": "Scenic scooter trails, authentic local thali spots, and peaceful public beaches.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": int(min_cost * 0.75),
                "max_amount": int(max_cost * 0.75),
                "basis": "estimated_total_per_trip",
                "display": f"₹{int(min_cost * 0.75):,} – ₹{int(max_cost * 0.75):,}",
            },
            "stop_count": max(5, days * 2),
            "stop_description": "curated stops",
            "pace": "Value-focused",
            "image": "/images/goa-budget.jpg",
            "image_alt": "Scenic coastal road flanked by coconut trees in Goa.",
            "recommended": False,
            "highlights": [
                "Self-guided scooter coastal routes",
                "Affordable local Goan fish-curry-rice joints",
                "Free sunset viewpoint at Chapora Fort",
                "Public ferry rides across Mandovi river",
            ],
            "day_outline": [
                "Budget Check-in & Vagator Sunset",
                "Scooter Exploration of North Beaches",
                "Historic Panjim Free Walking Route",
                "Arambol Sweet Water Lake Walk",
                "Local Fish Market & Departure",
            ][:days],
        },
        {
            "option_key": "slow",
            "title": "Slow Travel",
            "description": "Quiet South Goa coastlines, heritage home stays, yoga mornings, and leisurely café afternoons.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": int(max_cost * 1.15),
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(4, days * 2),
            "stop_description": "immersive stops",
            "pace": "Relaxed",
            "image": "/images/goa-slow.jpg",
            "image_alt": "Tranquil South Goa beach with gentle waves and secluded sand.",
            "recommended": False,
            "highlights": [
                "Quiet morning strolls along South Goa beaches",
                "Heritage Portuguese villa garden afternoon",
                "Organic farm-to-table lunch experience",
                "Sundowner by the Chapora or Sal riverbanks",
            ],
            "day_outline": [
                "Leisurely Arrival & South Goa Check-in",
                "Palolem & Agonda Unhurried Beach Day",
                "Cabo de Rama Scenic Fort & Cliff Views",
                "Riverside Café & Local Bakery Stroll",
                "Peaceful Morning Stroll & Departure",
            ][:days],
        },
    ]


def _generic_starter_options(
    destination: str,
    days: int,
    budget: str,
    travellers: int,
) -> List[Dict[str, Any]]:
    min_cost, max_cost, display_cost = _get_cost_range(budget, days, travellers)

    return [
        {
            "option_key": "balanced",
            "title": "Balanced Explorer",
            "description": f"A balanced starter plan combining central landmarks, neighborhood food, and culture in {destination}.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": max_cost,
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(6, days * 3),
            "stop_description": "starter stops",
            "pace": "Balanced",
            "image": "/images/generic-balanced.jpg",
            "image_alt": f"Scenic destination viewpoint overview of {destination}.",
            "recommended": True,
            "highlights": [
                f"Must-see historic landmarks and central sights in {destination}",
                "Curated neighborhood food and market exploration",
                "Scenic cultural and architectural discovery walk",
                "Evening viewpoint or waterfront promenade",
            ],
            "day_outline": _generate_generic_day_outline(destination, days, "Balanced"),
        },
        {
            "option_key": "budget",
            "title": "Budget Smart",
            "description": f"Value-focused starter plan prioritizing free landmarks, scenic walks, and local eats in {destination}.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": int(min_cost * 0.8),
                "max_amount": int(max_cost * 0.8),
                "basis": "estimated_total_per_trip",
                "display": f"₹{int(min_cost * 0.8):,} – ₹{int(max_cost * 0.8):,}",
            },
            "stop_count": max(5, days * 2),
            "stop_description": "starter stops",
            "pace": "Value-focused",
            "image": "/images/generic-budget.jpg",
            "image_alt": f"Charming public streets and vibrant local market in {destination}.",
            "recommended": False,
            "highlights": [
                f"Free public heritage sites and viewpoints in {destination}",
                "Authentic local street food and neighborhood bakeries",
                "Self-guided scenic walking circuits",
                "Public transit-friendly routing",
            ],
            "day_outline": _generate_generic_day_outline(destination, days, "Budget-friendly"),
        },
        {
            "option_key": "slow",
            "title": "Slow Travel",
            "description": f"Relaxed starter plan with fewer daily stops, dedicated downtime, and deeper immersion in {destination}.",
            "price_display": display_cost,
            "estimated_cost": {
                "currency": "INR",
                "min_amount": min_cost,
                "max_amount": int(max_cost * 1.1),
                "basis": "estimated_total_per_trip",
                "display": display_cost,
            },
            "stop_count": max(4, days * 2),
            "stop_description": "starter stops",
            "pace": "Relaxed",
            "image": "/images/generic-slow.jpg",
            "image_alt": f"Quiet courtyard and relaxing atmospheric area in {destination}.",
            "recommended": False,
            "highlights": [
                f"Unhurried morning walks through quiet districts in {destination}",
                "Independent cafés and relaxed local reading spots",
                "Immersive artisan or garden visit without rush",
                "Authentic leisure dining experience",
            ],
            "day_outline": _generate_generic_day_outline(destination, days, "Relaxed"),
        },
    ]
