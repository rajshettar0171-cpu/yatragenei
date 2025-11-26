import os
from dataclasses import dataclass
from math import asin, cos, radians, sin, sqrt
from typing import Any, Dict, List, Optional, Sequence, Tuple

from pydantic import BaseModel, Field, conlist

from ..data_loader import DataStore
from .alerts import generate_destination_alerts, summarize_alerts


class ItineraryRequest(BaseModel):
    destination: str = Field(..., description="Destination slug or name")
    days: int = Field(..., ge=1, le=7)
    budget: str = Field(..., pattern="^(low|medium|high)$")
    traveler_type: str
    interests: conlist(str, min_length=1)
    month: Optional[str] = None
    use_llm: bool = False


class ItinerarySegment(BaseModel):
    timeOfDay: str
    startTime: str
    durationHours: float
    spotId: str
    title: str
    description: str
    coordinates: Dict[str, float]
    entryFee: str
    travelDistanceKm: float
    travelSuggestion: str
    foodStop: str
    interestMatchScore: int
    notes: str


class DayPlan(BaseModel):
    day: int
    theme: str
    segments: List[ItinerarySegment]
    whyPlan: Dict[str, str]


class ItineraryResponse(BaseModel):
    destination: str
    month: Optional[str]
    days: List[DayPlan]
    summary: Dict[str, Any]


TIME_SLOTS: Sequence[Tuple[str, str, float]] = (
    ("Morning", "08:30", 3.0),
    ("Afternoon", "13:00", 3.5),
    ("Evening", "17:30", 3.0),
)

BUDGET_COSTS = {
    "low": "₹1.2k–₹1.8k / day · homestays + shared cabs",
    "medium": "₹2k–₹3k / day · boutique stays + mix of taxis",
    "high": "₹3.5k+ / day · chauffeured drives + premium dining",
}

SLOT_LABEL = {"Morning": "sunrise", "Afternoon": "midday", "Evening": "twilight"}

DEFAULT_PROFILE = {
    "terrain": "city promenades",
    "roadTrip": "Easy access by national highway; buffer 30 mins for toll queues.",
    "bikeRoute": "Rent scooters in-town for last-mile hops; helmets mandatory.",
    "adventureHighlights": "Guided walking tours and rooftop sundowners keep energy moderate.",
    "foodHighlights": "Street food crawls, craft coffee, and regional thalis.",
    "photoHighlights": "Colonial boulevards with string lights at dusk.",
    "natureHighlights": "Garden strolls and riverside bike tracks for slower hours.",
    "shoppingHighlights": "Night markets featuring indie designers and souvenir pop-ups.",
    "hiddenGem": "Sneak into the old printing-press lane for quiet photo ops.",
    "foodStops": ["Local bazaar chaat stall", "Indie coffee lab", "Artisanal dessert bar"],
}

CATEGORY_PROFILES: Dict[str, Dict[str, Any]] = {
    "Hill Stations & Mountain Regions": {
        "terrain": "cedar ridgelines",
        "roadTrip": "Chandigarh–{name} expressway flows into pine hairpins; fuel up before Parwanoo and carry motion bands.",
        "bikeRoute": "Rent Royal Enfields at the base town and chase sunrise loops to orchard villages; pack rain shells.",
        "adventureHighlights": "Paragliding windows over meadow bowls + downhill MTB shuttles near ridge farms.",
        "foodHighlights": "Himachali dham thalis, Tibetan broth bowls, and bakery jalebis along Mall Road.",
        "photoHighlights": "Golden-hour ridge decks, colonial bungalows, and misty forests.",
        "natureHighlights": "Deodar forest baths, waterfall scrambles, cloud inversions after noon showers.",
        "shoppingHighlights": "Wood-carved souvenirs, handwoven shawls, and boutique teas.",
        "hiddenGem": "Sunset clearing behind the forest rest house where locals picnic with kahwa.",
        "foodStops": ["Foxhill Bakery", "Old Mall Diner", "Ridge Chai Cart", "Pinecone Cafe"],
    },
    "Nature & Trekking Spots": {
        "terrain": "alpine meadows and hanging bridges",
        "roadTrip": "Plan for winding valley roads with single-lane bridges; refuel at the last market town.",
        "bikeRoute": "Hire 4x4 taxis for luggage and trek the final ascent light.",
        "adventureHighlights": "Waterfall rappels, multi-day hikes, and hot-spring dips.",
        "foodHighlights": "Trail kitchens serving millet rotis, bamboo shoots, and mountain honey.",
        "photoHighlights": "Living root bridges, sunrise meadows, and starry skies.",
        "natureHighlights": "Moss-laden forests, turquoise plunge pools, and bird calls.",
        "shoppingHighlights": "Tribal handicrafts, bamboo art, and spice blends at weekly haats.",
        "hiddenGem": "A fern-laced pool downstream where only locals swim.",
        "foodStops": ["Trail Tiffin Shack", "Valley Millet Kitchen", "Bamboo Cafe"],
    },
    "Beaches & Backwaters": {
        "terrain": "palm-lined coves and canals",
        "roadTrip": "NH66 coastal drive with sea breezes—avoid late-night freight convoys.",
        "bikeRoute": "Rent retro scooters to hop beaches; carry dry bags for sudden sprays.",
        "adventureHighlights": "Dawn surf lessons, SUP sessions, and mangrove kayak cruises.",
        "foodHighlights": "Toddy shop seafood, shack-grilled snapper, and sunset gelato.",
        "photoHighlights": "Golden dunes, fishing piers, and lighthouse silhouettes.",
        "natureHighlights": "Backwater cruises with kingfishers, lagoon hammocks, and estuary walks.",
        "shoppingHighlights": "Handwoven mats, shell art, and designer resort wear pop-ups.",
        "hiddenGem": "Lagoon sandbar that emerges during low tide—best for barefoot sunsets.",
        "foodStops": ["Artjuna Shack", "Toddy Tree Kitchen", "Lagoon Gelato Cart"],
    },
    "Coastal Areas": {
        "terrain": "cliff-hugging highways and fishing hamlets",
        "roadTrip": "Coastal highway features sea-facing ghats; buffer for monsoon potholes.",
        "bikeRoute": "Motorcycle rentals let you link viewpoints and fort stops with ease.",
        "adventureHighlights": "Parasailing, scuba tasters, and mangrove ziplines.",
        "foodHighlights": "Kokum curries, grill shacks, and Portuguese-era bakeries.",
        "photoHighlights": "Clifftop forts, harbor sunsets, and colorful fishing nets.",
        "natureHighlights": "Estuary birding, bioluminescent creeks, and casuarina groves.",
        "shoppingHighlights": "Beach bazaars selling shell jewelry, linen, and organic oils.",
        "hiddenGem": "Abandoned lighthouse terrace perfect for blue-hour frames.",
        "foodStops": ["Surfside Shack", "Port Cafe", "Spice Lane Bakery"],
    },
    "Islands": {
        "terrain": "lagoon islands and coral beaches",
        "roadTrip": "Island hops via ferries—book morning slots before winds pick up.",
        "bikeRoute": "Rent e-bikes for coastal loops; recharge at harbor cafes.",
        "adventureHighlights": "Reef dives, snorkeling sandbars, and night-kayak bioluminescence.",
        "foodHighlights": "Grilled octopus, coconut kulfi, and beachside BBQs.",
        "photoHighlights": "Turquoise lagoons, mangrove tunnels, and star trails.",
        "natureHighlights": "Turtle nesting walks and hammock siestas in breadfruit groves.",
        "shoppingHighlights": "Shell craft collectives and slow-fashion island boutiques.",
        "hiddenGem": "Secret sand spit accessible at low tide for sunset picnics.",
        "foodStops": ["Lagoon Grill", "Harbor Coffee Lab", "Sunset Sorbet Bike"],
    },
    "Cultural & Historical": {
        "terrain": "fortified quarters and palace corridors",
        "roadTrip": "Golden Triangle-style drives on smooth expressways; plan dawn departures.",
        "bikeRoute": "Sunrise cycling tours weave through bazaar alleys before traffic builds.",
        "adventureHighlights": "Hot-air balloons over forts and heritage zip lines.",
        "foodHighlights": "Royal thalis, kachori trails, and century-old coffee houses.",
        "photoHighlights": "Havelis, mirrored halls, and pastel doorways.",
        "natureHighlights": "Palace gardens, stepwells, and lakeside ghats.",
        "shoppingHighlights": "Block prints, gemstones, blue pottery, and leather ateliers.",
        "hiddenGem": "Courtyard cafe tucked behind an antique store—live sitar at dusk.",
        "foodStops": ["Royal Thali House", "Hawa Cafe", "Amer Kulfi Cart"],
    },
    "Cities & Culture": {
        "terrain": "design districts and riverfront promenades",
        "roadTrip": "Access via expressways + metro links; best to arrive off-peak.",
        "bikeRoute": "Public bike docks connect murals, breweries, and science parks.",
        "adventureHighlights": "Night cycling, craft brewery crawls, and VR museums.",
        "foodHighlights": "Glocal brunch spots, micro roasteries, and midnight dosa carts.",
        "photoHighlights": "Street-art alleys, skyline lookouts, and neon bridges.",
        "natureHighlights": "Urban forests, botanical lakes, and rooftop farms.",
        "shoppingHighlights": "Concept stores, sneaker culture drops, and indie labels.",
        "hiddenGem": "An old warehouse now hosting vinyl bars and ceramic studios.",
        "foodStops": ["Third Wave Brew Lab", "Indie Brunch House", "Midnight Dosa Cart"],
    },
    "Major Cities": {
        **DEFAULT_PROFILE,
        "foodStops": ["Art District Cafe", "Midnight Frankie Truck", "Cold Brew Cart"],
    },
    "Heritage & Temple Destinations": {
        "terrain": "sacred tanks and stone corridors",
        "roadTrip": "Chennai–Madurai style highways; arrive before aarti rush.",
        "bikeRoute": "Rent e-bikes to cover temple corridors quickly between rituals.",
        "adventureHighlights": "Pilgrim climbs, coracle rides, and heritage photo walks.",
        "foodHighlights": "Prasadam kitchens, filter coffee, and banana-leaf feasts.",
        "photoHighlights": "Gopuram silhouettes, oil-lamp rituals, and chariot streets.",
        "natureHighlights": "Sacred groves and coastal estuaries attached to temples.",
        "shoppingHighlights": "Brassware, silk looms, and hand-carved icons.",
        "hiddenGem": "Temple tank steps where locals feed koi at sunrise.",
        "foodStops": ["Temple Prasadam Hall", "Filter Coffee Counter", "Banana Leaf Mess"],
    },
    "Desert & Heritage": {
        "terrain": "sand dunes and fort ramparts",
        "roadTrip": "Jaipur–Jaisalmer routes offer desert expressways; fuel at last major town.",
        "bikeRoute": "Camel safaris + ATV rentals for dunes; sunset jeep convoys.",
        "adventureHighlights": "Dune bashing, camel rides, and night-star photo walks.",
        "foodHighlights": "Ker sangri, bajra rotis, and bhang lassi counters.",
        "photoHighlights": "Golden fort walls and Orion-filled skies.",
        "natureHighlights": "Oasis birding and desert nurseries.",
        "shoppingHighlights": "Mirror-work textiles, silver trinkets, and leather mojris.",
        "hiddenGem": "Abandoned caravanserai now used for astro hangs.",
        "foodStops": ["Dune Dhaba", "Mirage Cafe", "Fort Kulfi Cart"],
    },
    "Mountains & Nature": {
        "terrain": "cloud forests and tea ridges",
        "roadTrip": "Shillong-style hill drives with living root bridge detours.",
        "bikeRoute": "Hire local cabbies for ghat sections; mountain bikes for village loops.",
        "adventureHighlights": "Canyoning, caving, and glass-bottom boat rides at Dawki.",
        "foodHighlights": "Tribal BBQs, bamboo pork, and Khasi rice cakes.",
        "photoHighlights": "Living root engineering, canyons, and sunlit lakes.",
        "natureHighlights": "Plunge pools, rolling clouds, and clean rivers.",
        "shoppingHighlights": "Handwoven shawls, black pepper, and bamboo crafts.",
        "hiddenGem": "A lesser-known waterfalls amphitheater outside the tourist map.",
        "foodStops": ["Khasi Barbecue Stall", "Root Bridge Cafe", "Laitlum Tea Shack"],
    },
    "Cultural & Heritage": {
        "terrain": "temple boulevards and coastal promenades",
        "roadTrip": "Puri–Konark marine drive best tackled at sunrise before buses roll in.",
        "bikeRoute": "Rent cycles for heritage precinct loops and craft villages.",
        "adventureHighlights": "Sand art workshops, rustic boat rides, and heritage walks.",
        "foodHighlights": "Mahaprasad meals, rasgulla trails, and chai under banyan trees.",
        "photoHighlights": "Sun temple bas reliefs, chariot festivals, and beach sunrises.",
        "natureHighlights": "Olive ridley nesting beaches and mangrove wetlands.",
        "shoppingHighlights": "Pattachitra art, applique textiles, and brass idols.",
        "hiddenGem": "Quiet fisherman lane serving chai with temple bells in the backdrop.",
        "foodStops": ["Jagannath Mahaprasad Hall", "Beachside Chai Cart", "Sweet Factory"],
    },
}


def _normalize_interests(interests: Sequence[str]) -> List[str]:
    seen = set()
    ordered = []
    for interest in interests:
        key = interest.lower().strip()
        if key and key not in seen:
            seen.add(key)
            ordered.append(key)
    return ordered or ["culture"]


def _profile_for_category(destination: Dict[str, Any]) -> Dict[str, Any]:
    profile = dict(DEFAULT_PROFILE)
    category = destination.get("primaryCategory")
    if category in CATEGORY_PROFILES:
        profile.update(CATEGORY_PROFILES[category])
    if not profile.get("foodStops"):
        profile["foodStops"] = DEFAULT_PROFILE["foodStops"]
    return profile


def destination_profile(destination: Dict[str, Any]) -> Dict[str, Any]:
    """Public helper so other modules (API, chat) can reuse category tone."""
    return _profile_for_category(destination)


def _slot_label(slot: str) -> str:
    return SLOT_LABEL.get(slot, slot.lower())


def _travel_tip(distance: float) -> str:
    if distance <= 0.4:
        return "Begin near your stay — breathe in the local rhythm."
    if distance < 1.8:
        return f"Walkable hop (~{distance} km) via shaded lanes."
    if distance < 5:
        return f"Shared cab or scooter (~{distance} km / 15 min)."
    return f"Plan a 25+ min transfer (~{distance} km); buffer for scenic stops."


def _cost_estimate_total(budget: str, days: int) -> str:
    per_day = BUDGET_COSTS.get(budget, BUDGET_COSTS["medium"])
    rough_daily = {"low": 1500, "medium": 2500, "high": 3800}.get(budget, 2500)
    total = rough_daily * days
    return f"{per_day} · approx ₹{total:,} for {days} day(s)"


def _daily_theme(day_idx: int, destination_name: str, interests: Sequence[str]) -> str:
    focus = "balanced highlights"
    lowered = set(interests)
    if "trekking" in lowered or "adventure" in lowered:
        focus = "trail mornings & adrenaline afternoons"
    elif "food" in lowered:
        focus = "tasting crawls & cafe sunsets"
    elif "culture" in lowered:
        focus = "heritage walks & night bazaars"
    elif "relaxation" in lowered:
        focus = "slow mornings & spa-toned evenings"
    elif "nature" in lowered:
        focus = "forest baths & river breezes"
    return f"{destination_name} · {focus} (Day {day_idx + 1})"


def _build_interest_segment(
    destination: Dict[str, Any],
    profile: Dict[str, Any],
    interest: str,
    slot: str,
    sequence: int,
    traveler_type: str,
    highlight_hidden: bool,
) -> Dict[str, Any]:
    behavior = INTEREST_BEHAVIORS.get(interest, INTEREST_BEHAVIORS["culture"])
    slot_word = _slot_label(slot)
    distance = behavior["distance"].get(slot, list(behavior["distance"].values())[0])
    distance = round(distance + (sequence % 2) * 0.4, 1)
    duration = behavior["duration"].get(slot, list(behavior["duration"].values())[0])
    title = behavior["title"].format(
        slot=slot_word.title(),
        name=destination["name"],
        terrain=profile["terrain"],
    )
    description = behavior["description"].format(
        name=destination["name"],
        terrain=profile["terrain"],
        foodHighlights=profile["foodHighlights"],
        adventureHighlights=profile["adventureHighlights"],
        photoHighlights=profile["photoHighlights"],
        natureHighlights=profile["natureHighlights"],
        shoppingHighlights=profile["shoppingHighlights"],
    )
    note = behavior["note"]
    if highlight_hidden:
        note += f" Hidden gem: {profile['hiddenGem']}."
    note += f" Tailored for {traveler_type.title()} pace."
    food_stop = profile["foodStops"][sequence % len(profile["foodStops"])]
    return {
        "timeOfDay": slot,
        "startTime": TIME_SLOTS[[s[0] for s in TIME_SLOTS].index(slot)][1],
        "durationHours": duration,
        "spotId": f"{destination['id']}-{interest}-{slot.lower()}-{sequence}",
        "title": title,
        "description": description,
        "coordinates": {"lat": 0.0, "lng": 0.0},
        "entryFee": behavior["entryFee"],
        "travelDistanceKm": distance,
        "travelSuggestion": _travel_tip(distance),
        "foodStop": food_stop,
        "interestMatchScore": min(10, 6 + sequence % 4),
        "notes": note,
    }


def _build_catalog_days(
    store: DataStore,
    request: ItineraryRequest,
    destination: Dict[str, Any],
    interests: List[str],
    alerts: List[Dict[str, Any]],
    profile: Dict[str, Any],
) -> List[DayPlan]:
    hidden_tagged = destination["id"] in store.tagged_hidden_gems
    segments_needed = request.days * len(TIME_SLOTS)
    pool: List[Dict[str, Any]] = []
    seq = 0
    while len(pool) < segments_needed * 2:
        for interest in interests:
            for slot_name, _, _ in TIME_SLOTS:
                pool.append(
                    _build_interest_segment(
                        destination,
                        profile,
                        interest,
                        slot_name,
                        seq,
                        request.traveler_type,
                        highlight_hidden=hidden_tagged and slot_name == "Evening",
                    )
                )
                seq += 1
                if len(pool) >= segments_needed * 2:
                    break
            if len(pool) >= segments_needed * 2:
                break

    days: List[DayPlan] = []
    pool_idx = 0
    for day_idx in range(request.days):
        day_segments: List[ItinerarySegment] = []
        for slot_idx, (slot_name, _, _) in enumerate(TIME_SLOTS):
            if pool_idx >= len(pool):
                pool_idx = 0
            segment_data = dict(pool[pool_idx])
            pool_idx += 1
            if slot_idx == 0:
                segment_data["travelDistanceKm"] = 0.0
                segment_data["travelSuggestion"] = "Start near your stay — slow warm-up walk."
            segment_data["interestMatchScore"] = min(
                10, segment_data["interestMatchScore"] + (8 if segment_data["spotId"].split("-")[1] in interests else 0)
            )
            day_segments.append(ItinerarySegment(**segment_data))
        why_plan = {
            "costEstimate": BUDGET_COSTS.get(request.budget, BUDGET_COSTS["medium"]),
            "safety": summarize_alerts(alerts),
            "roadTrip": profile["roadTrip"].format(name=destination["name"]),
            "bikeRoute": profile["bikeRoute"].format(name=destination["name"]),
            "hiddenGem": profile["hiddenGem"] if hidden_tagged else "Hidden gem sourced from travel OS recommendations.",
        }
        days.append(
            DayPlan(
                day=day_idx + 1,
                theme=_daily_theme(day_idx, destination["name"], interests),
                segments=day_segments,
                whyPlan=why_plan,
            )
        )
    return days


# ---- Shimla-specific helpers (reuse rich spot data) ----

FOOD_DEFAULTS = [
    "Wake & Bake Café",
    "Cafe Simla Times",
    "Indian Coffee House",
    "Himachali Rasoi Local Dhaba",
    "Honey Hut Dessert Cart",
]


def haversine_km(coord_a: Tuple[float, float], coord_b: Tuple[float, float]) -> float:
    if not coord_a or not coord_b:
        return 0.0
    lat1, lon1 = coord_a
    lat2, lon2 = coord_b
    radius = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = (
        sin(d_lat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    )
    c = 2 * asin(sqrt(a))
    return round(radius * c, 2)


def _interest_overlap(spot: Dict[str, Any], interests: List[str]) -> int:
    tags = [tag.lower() for tag in spot.get("tags", [])]
    return len(set(tags) & set(interests))


def _score_spot(
    spot: Dict[str, Any],
    interests: List[str],
    traveler_type: str,
    budget: str,
) -> float:
    overlap = _interest_overlap(spot, interests)
    if overlap == 0:
        return 0.5
    crowd = spot.get("crowdScore", 5)
    base = 50 + (overlap * 12)
    crowd_factor = 10 - crowd if traveler_type.lower() in ["couple", "family"] else 12 - crowd
    budget_bonus = 5 if (budget == "low" and "free" in spot.get("entryFee", "").lower()) else 0
    gem_bonus = 15 if spot.get("isHiddenGem") else 0
    return base + crowd_factor + budget_bonus + gem_bonus


def _pick_food_stop(idx: int) -> str:
    return FOOD_DEFAULTS[idx % len(FOOD_DEFAULTS)]


def _interest_notes(spot: Dict[str, Any], interests: List[str]) -> str:
    normalized_interests = {tag.lower() for tag in interests}
    overlap_tags = ", ".join(
        tag for tag in spot.get("tags", []) if tag.lower() in normalized_interests
    )
    crowd = spot.get("crowdScore", 5)
    base_note = f"Aligns with {overlap_tags or 'core interests'}."
    if crowd >= 8:
        base_note += " Arrive before 9 AM to avoid tour bus rush."
    elif crowd <= 4:
        base_note += " Naturally low crowd score for unhurried frames."
    if spot.get("isHiddenGem"):
        base_note += " Flagged as hidden gem by admin."
    return base_note


def _hidden_gem_highlight(segments: Sequence[ItinerarySegment]) -> str:
    gem = next((seg for seg in segments if "hidden gem" in seg.notes.lower()), None)
    if not gem:
        return "Focus on marquee highlights today."
    return f"{gem.title} — linger 20 extra minutes for exclusive frames."


def _build_shimla_days(
    store: DataStore,
    request: ItineraryRequest,
    interests: List[str],
    alerts: List[Dict[str, Any]],
    profile: Dict[str, Any],
) -> List[DayPlan]:
    scored_spots = sorted(
        store.spots,
        key=lambda spot: _score_spot(spot, interests, request.traveler_type, request.budget),
        reverse=True,
    )
    if not scored_spots:
        raise ValueError("No Shimla spots available.")
    days: List[DayPlan] = []
    available = scored_spots.copy()
    used_ids: set[str] = set()

    for day_idx in range(request.days):
        if not available:
            available = scored_spots.copy()
        day_segments: List[ItinerarySegment] = []
        prev_coords: Optional[Tuple[float, float]] = None
        for slot_idx, (slot_name, start_time, duration) in enumerate(TIME_SLOTS):
            candidate = next(
                (
                    spot
                    for spot in available
                    if spot["id"] not in used_ids and _interest_overlap(spot, interests) > 0
                ),
                None,
            )
            if not candidate:
                candidate = next(
                    (spot for spot in store.spots if spot["id"] not in used_ids),
                    store.spots[slot_idx % len(store.spots)],
                )
            available = [spot for spot in available if spot["id"] != candidate["id"]]
            used_ids.add(candidate["id"])
            coords = (candidate["lat"], candidate["lng"])
            travel_distance = haversine_km(prev_coords, coords) if prev_coords else 0.0
            prev_coords = coords
            segment = ItinerarySegment(
                timeOfDay=slot_name,
                startTime=start_time,
                durationHours=duration,
                spotId=candidate["id"],
                title=candidate["name"],
                description=candidate["description"],
                coordinates={"lat": candidate["lat"], "lng": candidate["lng"]},
                entryFee=candidate.get("entryFee", "Free"),
                travelDistanceKm=travel_distance,
                travelSuggestion=_travel_tip(travel_distance),
                foodStop=_pick_food_stop(slot_idx + day_idx),
                interestMatchScore=min(10, max(5, _interest_overlap(candidate, interests) * 3)),
                notes=_interest_notes(candidate, request.interests),
            )
            if travel_distance == 0:
                segment.travelSuggestion = "Start near your stay — short warm-up walk."
            day_segments.append(segment)

        why_plan = {
            "costEstimate": BUDGET_COSTS.get(request.budget, BUDGET_COSTS["medium"]),
            "safety": summarize_alerts(alerts),
            "roadTrip": profile["roadTrip"].format(name="Shimla"),
            "bikeRoute": profile["bikeRoute"].format(name="Shimla"),
            "hiddenGem": _hidden_gem_highlight(day_segments),
        }
        days.append(
            DayPlan(
                day=day_idx + 1,
                theme=_daily_theme(day_idx, "Shimla", interests),
                segments=day_segments,
                whyPlan=why_plan,
            )
        )
    return days


def _build_summary(
    destination: Dict[str, Any],
    request: ItineraryRequest,
    alerts: List[Dict[str, Any]],
    days: List[DayPlan],
    profile: Dict[str, Any],
    store: DataStore,
) -> Dict[str, Any]:
    hidden_count = sum(
        1 for day in days for seg in day.segments if "hidden gem" in seg.notes.lower()
    )
    tagged_custom = len(store.tagged_hidden_gems.get(destination["id"], []))
    return {
        "destinationId": destination["id"],
        "travelerType": request.traveler_type,
        "budget": request.budget,
        "interests": request.interests,
        "costEstimate": _cost_estimate_total(request.budget, request.days),
        "roadTripPlan": profile["roadTrip"].format(name=destination["name"]),
        "bikePlan": profile["bikeRoute"].format(name=destination["name"]),
        "adventureHighlights": profile["adventureHighlights"],
        "foodHighlights": profile["foodHighlights"],
        "photoHighlights": profile["photoHighlights"],
        "natureHighlights": profile["natureHighlights"],
        "shoppingHighlights": profile["shoppingHighlights"],
        "hiddenGemCallout": profile["hiddenGem"],
        "taggedHiddenGems": tagged_custom,
        "hiddenGemCount": hidden_count,
        "alertsApplied": len(alerts),
    }


def generate_itinerary_local(
    store: DataStore, request: ItineraryRequest
) -> ItineraryResponse:
    destination = store.get_destination(request.destination)
    if not destination:
        raise ValueError(
            f"Destination '{request.destination}' not in catalog yet. Try one from the region guide."
        )
    profile = _profile_for_category(destination)
    normalized_interests = _normalize_interests(request.interests)
    alerts = generate_destination_alerts(destination, store.alerts)

    if destination["id"] == "shimla":
        days = _build_shimla_days(store, request, normalized_interests, alerts, profile)
    else:
        days = _build_catalog_days(
            store, request, destination, normalized_interests, alerts, profile
        )

    summary = _build_summary(destination, request, alerts, days, profile, store)
    return ItineraryResponse(
        destination=f"{destination['name']} · {destination['region']}",
        month=request.month,
        days=days,
        summary=summary,
    )


def generate_itinerary_with_llm(
    store: DataStore, request: ItineraryRequest
) -> ItineraryResponse:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY missing — falling back to deterministic builder.")
    return generate_itinerary_local(store, request)

INTEREST_BEHAVIORS: Dict[str, Dict[str, Any]] = {
    "trekking": {
        "title": "{slot} ridge trek",
        "description": "Follow {terrain} single-track near {name}, pausing for ridge selfies and chai thermos breaks.",
        "distance": {"Morning": 5.2, "Afternoon": 4.0, "Evening": 3.0},
        "duration": {"Morning": 3.0, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "Free",
        "travel": "Cab to trailhead + moderate climb",
        "note": "Pack rain shell + trail mix; guides available at the base kiosk.",
    },
    "food": {
        "title": "{slot} tasting crawl",
        "description": "Graze through {foodHighlights} with chef interviews and spice market pauses.",
        "distance": {"Morning": 1.5, "Afternoon": 2.0, "Evening": 1.2},
        "duration": {"Morning": 2.0, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "₹200 tasting wallet",
        "travel": "Walkable hop between cafes",
        "note": "Tell hosts about dietary needs; many serve zero-waste tastings.",
    },
    "photography": {
        "title": "{slot} photo chase",
        "description": "Shoot {photoHighlights} with framing tips and golden-hour compositions.",
        "distance": {"Morning": 2.5, "Afternoon": 3.0, "Evening": 2.0},
        "duration": {"Morning": 2.5, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "₹100 viewpoint permit",
        "travel": "Short cab + on-foot loops",
        "note": "Carry polarizer filters; drones need basic permits.",
    },
    "relaxation": {
        "title": "{slot} reset",
        "description": "Slow mornings with wellness corners, hammock time, and journaling prompts overlooking {terrain}.",
        "distance": {"Morning": 0.8, "Afternoon": 1.0, "Evening": 0.5},
        "duration": {"Morning": 2.0, "Afternoon": 2.0, "Evening": 1.5},
        "entryFee": "₹150 day-pass",
        "travel": "Start at stay; optional spa shuttle",
        "note": "BYO book + essential oils; places provide herbal teas.",
    },
    "culture": {
        "title": "{slot} heritage walk",
        "description": "Trace {terrain} storylines with guides decoding architecture, murals, and rituals.",
        "distance": {"Morning": 3.0, "Afternoon": 2.5, "Evening": 2.0},
        "duration": {"Morning": 2.5, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "₹120 monument pass",
        "travel": "Walking loop with short tuk-tuk hops",
        "note": "Modest attire and socks recommended for temple entries.",
    },
    "adventure": {
        "title": "{slot} adrenaline block",
        "description": "Layer {adventureHighlights} with certified operators and buffer time for transfers.",
        "distance": {"Morning": 6.0, "Afternoon": 8.0, "Evening": 4.0},
        "duration": {"Morning": 3.5, "Afternoon": 3.5, "Evening": 2.5},
        "entryFee": "₹800 activity wristband",
        "travel": "4x4 shuttle + brief trek",
        "note": "Check insurance waiver and carry hydration packs.",
    },
    "nature": {
        "title": "{slot} nature immersion",
        "description": "Forest baths among {natureHighlights}, bird calls logged via citizen-science apps.",
        "distance": {"Morning": 3.5, "Afternoon": 3.0, "Evening": 2.0},
        "duration": {"Morning": 2.5, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "₹50 eco-fee",
        "travel": "Shared jeep to trailhead",
        "note": "Carry reusable bottles and respect silence zones.",
    },
    "shopping": {
        "title": "{slot} maker circuit",
        "description": "Meet artisans behind {shoppingHighlights}; test your haggling and support fair trade.",
        "distance": {"Morning": 1.8, "Afternoon": 2.2, "Evening": 1.5},
        "duration": {"Morning": 2.0, "Afternoon": 2.5, "Evening": 2.0},
        "entryFee": "Free (pay for what you love)",
        "travel": "Walk + tuk-tuk combo",
        "note": "Carry cash for micro vendors; many wrap purchases in newspaper.",
    },

