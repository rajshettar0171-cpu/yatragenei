from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List


CATEGORY_ALERT_TEMPLATES = {
    "Hill Stations & Mountain Regions": {
        "road": "Hairpin resurfacing on the approach road into {name}. Expect 25–30 min single-lane holds during daylight.",
        "weather": "Evening drizzle forecast this week; pack shells and expect temperatures to dip to 8 °C after sunset.",
        "event": "Local folk music circle at the heritage ridge every Saturday 6–8 PM. Arrive early for seating.",
    },
    "Nature & Trekking Spots": {
        "road": "Forest department restricts vehicle entry past the last village between 10 AM–4 PM. Hire local jeeps or trek the final stretch.",
        "weather": "Misty mornings likely; trails stay slick until late morning. Micro-spikes recommended.",
        "event": "Community eco-walk with naturalists on weekends. Slots open on the tourism kiosk the prior evening.",
    },
    "Beaches & Backwaters": {
        "road": "Coastal road diversions near {name} due to promenade upgrade. Follow detour boards via village lanes.",
        "weather": "Moderate swells expected midweek. Lifeguards hoisting yellow flags from noon to 3 PM.",
        "event": "Sundowner flea market with live music on Friday evenings at the main shack belt.",
    },
    "Coastal Areas": {
        "road": "NH66 night-time restrictions for bridge works. Day drives unaffected but speed capped at 60 kmph.",
        "weather": "Sea breeze carries humidity spikes; hydrate and carry reef-safe sunscreen.",
        "event": "Harbor cruise parade scheduled Saturday 7 PM. Book tickets before noon.",
    },
    "Islands": {
        "road": "Jetty maintenance limits ferries post 4 PM. Plan island hops earlier in the day.",
        "weather": "Light showers expected; seas slight, snorkeling visibility 15 m.",
        "event": "Bioluminescence kayak tours running nightly around new moon.",
    },
    "Cultural & Historical": {
        "road": "Old city streets partially pedestrianized for heritage week. Park outside the walled core and walk in.",
        "weather": "Cool dry winds; perfect for rooftop walks but carry light layers for late evenings.",
        "event": "Sound-and-light show at the fort nightly 7:30 PM. Tickets sell out by afternoon.",
    },
    "Cities & Culture": {
        "road": "Metro repair work adds 15 min to CBD commutes; use app cabs or metro where available.",
        "weather": "Pleasant evenings around 20 °C. Afternoon UV still high—carry hats.",
        "event": "Pop-up art + food night market over the weekend warehouse district.",
    },
    "Heritage & Temple Destinations": {
        "road": "Temple town one-way system active during aarti hours. Follow police guidance or park before core zone.",
        "weather": "Humid afternoons; mornings remain misty and photogenic.",
        "event": "Special aarati + cultural procession announced for Saturday dawn. Modest attire enforced.",
    },
    "Desert & Heritage": {
        "road": "Dune safari route shifted due to mild sandstorm forecasts. Operators using the east ridge loop.",
        "weather": "Day highs touch 32 °C, but desert nights dip below 12 °C—pack layers.",
        "event": "Folk dance + astro photography campfire at Sam dunes 8 PM nightly.",
    },
    "Mountains & Nature": {
        "road": "Landslide clearance along the gorge road 7–10 AM daily. Buffer an hour for transfers.",
        "weather": "Morning fog lifts by 9 AM; afternoons breezy with scattered showers.",
        "event": "Community harvest market + bamboo craft demos in the main square this Sunday.",
    },
    "Major Cities": {
        "road": "Flyover resurfacing adds 20 min to airport run—leave earlier during peak hours.",
        "weather": "Air quality moderate; keep reusable masks handy for evening traffic corridors.",
        "event": "Night cycling + street food crawl curated by locals every Saturday midnight.",
    },
    "default": {
        "road": "Local authorities report intermittent slowdowns en route. Keep 30 min buffer.",
        "weather": "Seasonal conditions stable; pack a light layer for evenings.",
        "event": "Weekly pop-up market adds buzz near the main square each Friday.",
    },
}


def _synthesize_alert(kind: str, text: str, destination: Dict[str, str]) -> Dict[str, str]:
    now = datetime.utcnow()
    offset = {"road": 0, "weather": 1, "event": 2}.get(kind, 0)
    timestamp = (now + timedelta(hours=offset)).isoformat() + "Z"
    return {
        "id": f"synthetic-{destination['id']}-{kind}",
        "type": kind if kind != "event" else "event",
        "severity": "medium" if kind != "event" else "low",
        "title": text.split(".")[0],
        "description": text,
        "affectedAreas": [destination["name"]],
        "timestamp": timestamp,
        "destinationId": destination["id"],
    }


def generate_destination_alerts(
    destination: Dict[str, str], base_alerts: List[Dict[str, str]]
) -> List[Dict[str, str]]:
    filtered = [
        alert for alert in base_alerts if alert.get("destinationId") == destination["id"]
    ]
    if filtered:
        return filtered

    profile = CATEGORY_ALERT_TEMPLATES.get(
        destination.get("primaryCategory", ""), CATEGORY_ALERT_TEMPLATES["default"]
    )
    synthetic = []
    for key in ("road", "weather", "event"):
        text = profile.get(key, CATEGORY_ALERT_TEMPLATES["default"][key]).format(
            name=destination["name"]
        )
        synthetic.append(_synthesize_alert(key if key != "event" else "event", text, destination))
    return synthetic


def summarize_alerts(alerts: List[Dict[str, str]]) -> str:
    if not alerts:
        return "No live advisories; continue to monitor local police and IMD handles."
    highlights = []
    for alert in alerts[:2]:
        highlights.append(f"{alert['title']} ({alert['severity']})")
    return "; ".join(highlights)

