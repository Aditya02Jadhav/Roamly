from typing import List, Dict, Any
import re
from app.schemas.itinerary import TripStopCreate


class AIService:
    @staticmethod
    def generate_adjusted_stops(
        prompt: str,
        destination: str,
        current_stops: List[Dict[str, Any]],
    ) -> List[TripStopCreate]:
        lower_prompt = prompt.lower().strip()

        # Pattern 1: Relaxed / Slower pace
        if any(w in lower_prompt for w in ["relaxed", "slow", "chill", "less", "rest", "calm", "easy"]):
            if current_stops:
                # Keep top 2 highlights, adjust times to be leisurely
                kept = current_stops[:2]
                return [
                    TripStopCreate(
                        title=f"{kept[0]['title']} (Leisurely visit)",
                        time="10:30 AM",
                        duration="2 hours",
                        category="Relaxed highlight",
                        description=f"A relaxed morning exploration in {destination} with no rush.",
                    ),
                    TripStopCreate(
                        title="Local café & scenic afternoon rest",
                        time="1:30 PM",
                        duration="2 hours",
                        category="Café & leisure",
                        description=f"Enjoy local flavors and unwinding at a peaceful spot in {destination}.",
                    ),
                ]
            return [
                TripStopCreate(
                    title=f"Leisurely stroll around {destination}",
                    time="10:30 AM",
                    duration="2 hours",
                    category="Relaxed exploration",
                    description="Take in the sights at an easy, enjoyable pace.",
                ),
                TripStopCreate(
                    title="Scenic tea house or garden",
                    time="2:00 PM",
                    duration="1.5 hours",
                    category="Café & rest",
                    description="Relax and soak in the ambiance.",
                ),
            ]

        # Pattern 2: Hidden gems / Off the beaten path
        if any(w in lower_prompt for w in ["hidden", "gem", "local", "secret", "unique", "off-beat", "quiet"]):
            return [
                TripStopCreate(
                    title=f"Secret backstreets & heritage quarter in {destination}",
                    time="9:30 AM",
                    duration="1.5 hours",
                    category="Hidden gem",
                    description=f"Discover secluded alleyways, artisan workshops, and quiet heritage away from tourist crowds in {destination}.",
                ),
                TripStopCreate(
                    title="Authentic neighborhood eatery",
                    time="12:30 PM",
                    duration="1 hour",
                    category="Local cuisine",
                    description="Beloved local dining spot known only to residents.",
                ),
                TripStopCreate(
                    title="Overlooked sunset viewpoint",
                    time="5:00 PM",
                    duration="1.5 hours",
                    category="Hidden gem",
                    description="Quiet panoramic view without the crowded tour groups.",
                ),
            ]

        # Pattern 3: Reduce travel time / Compact cluster
        if any(w in lower_prompt for w in ["travel time", "distance", "cluster", "walkable", "closer", "transit"]):
            base_title = current_stops[0]["title"] if current_stops else f"Central district of {destination}"
            return [
                TripStopCreate(
                    title=base_title,
                    time="10:00 AM",
                    duration="1.5 hours",
                    category="Core stop",
                    description=f"Begin in the walkable heart of {destination}.",
                ),
                TripStopCreate(
                    title="Adjacent historic square & artisan lane (5 min walk)",
                    time="11:45 AM",
                    duration="1 hour",
                    category="Walking radius",
                    description="Just steps away from your morning stop to minimize commute.",
                ),
                TripStopCreate(
                    title="Neighborhood lunch & park rest",
                    time="1:00 PM",
                    duration="1.5 hours",
                    category="Local dining",
                    description="Convenient dining directly inside the same district.",
                ),
            ]

        # Pattern 4: Food & Dining focus
        if any(w in lower_prompt for w in ["food", "lunch", "dinner", "eat", "coffee", "taste", "snack"]):
            return [
                TripStopCreate(
                    title=f"Morning food market walk in {destination}",
                    time="9:30 AM",
                    duration="1.5 hours",
                    category="Food & market",
                    description=f"Sample regional breakfast specialties and fresh seasonal bites in {destination}.",
                ),
                TripStopCreate(
                    title="Traditional family-run lunch destination",
                    time="12:30 PM",
                    duration="1.5 hours",
                    category="Culinary highlight",
                    description="Signature local dishes recommended by culinary guides.",
                ),
                TripStopCreate(
                    title="Artisan coffee or tea tasting",
                    time="3:30 PM",
                    duration="1 hour",
                    category="Café",
                    description="Afternoon specialty drink and dessert break.",
                ),
            ]

        # Generic intelligent response adapting prompt
        clean_prompt = prompt.strip().rstrip(".?!")
        return [
            TripStopCreate(
                title=f"{clean_prompt.capitalize()} in {destination}",
                time="10:00 AM",
                duration="2 hours",
                category="AI customized",
                description=f"Tailored to your preference: '{prompt}' in {destination}.",
            ),
            TripStopCreate(
                title="Complementary local highlight & lunch",
                time="12:30 PM",
                duration="1.5 hours",
                category="Plan highlight",
                description="Convenient nearby stop complementing your custom adjustment.",
            ),
            TripStopCreate(
                title="Free exploration afternoon",
                time="3:00 PM",
                duration="2 hours",
                category="Flexible time",
                description="Explore at your own rhythm.",
            ),
        ]

