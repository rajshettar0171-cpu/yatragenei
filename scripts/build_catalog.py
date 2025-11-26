import json
import re
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parent.parent
GUIDE_PATH = ROOT / "data" / "region_guide.md"
OUTPUT_PATH = ROOT / "data" / "destinations_catalog.json"

STATE_REGION = {
    "Himachal Pradesh": "North India",
    "Uttarakhand": "North India",
    "Ladakh": "North India",
    "Delhi": "North India",
    "Uttar Pradesh": "North India",
    "Rajasthan": "West India",
    "Karnataka": "South India",
    "Kerala": "South India",
    "Tamil Nadu": "South India",
    "Telangana": "South India",
    "Andhra Pradesh": "South India",
    "Goa": "West India",
    "Maharashtra": "West India",
    "Gujarat": "West India",
    "Daman and Diu": "West India",
    "West Bengal": "East India",
    "Sikkim": "East India",
    "Meghalaya": "East India",
    "Assam": "East India",
    "Andaman & Nicobar": "East India",
    "Andaman and Nicobar": "East India",
    "Bihar": "East India",
    "Odisha": "East India",
}

CATEGORY_INTERESTS: Dict[str, List[str]] = {
    "Hill Stations & Mountain Regions": [
        "trekking",
        "photography",
        "relaxation",
        "nature",
        "adventure",
    ],
    "Nature & Trekking Spots": [
        "trekking",
        "nature",
        "adventure",
        "photography",
    ],
    "Cultural & Historical": ["culture", "photography", "shopping", "food"],
    "Beaches & Backwaters": ["relaxation", "food", "photography", "nature", "adventure"],
    "Hill Stations": ["trekking", "photography", "relaxation", "nature"],
    "Heritage & Temple Destinations": [
        "culture",
        "relaxation",
        "photography",
        "shopping",
    ],
    "Major Cities": ["food", "culture", "shopping", "photography"],
    "Cities & Culture": ["culture", "food", "shopping", "photography"],
    "Coastal Areas": ["relaxation", "photography", "adventure", "food"],
    "Desert & Heritage": ["adventure", "culture", "photography", "shopping"],
    "Mountains & Nature": ["nature", "trekking", "photography", "relaxation"],
    "Islands": ["relaxation", "adventure", "nature", "photography", "food"],
    "Cultural & Heritage": ["culture", "photography", "food", "shopping"],
}

REGION_BEST_TIMES = {
    "North India": "March–June & Sept–Nov",
    "South India": "Oct–March (hill) · Nov–Feb (coast)",
    "West India": "Nov–Feb (coast) · Oct–March (desert)",
    "East India": "Oct–April (mountains) · Nov–Feb (plains)",
}

DESTINATION_BEST_TIME = {
    "auli": "Dec–Feb (prime ski season)",
    "manali": "Dec–Feb for snow · Mar–Jun for treks",
    "leh-ladakh": "June–Sept (road window)",
    "goa": "Nov–Feb (dry season)",
    "andaman-nicobar-islands": "Nov–May (calm seas)",
    "meghalaya-shillong-cherrapunji-dawki": "Oct–Apr (cloud-free)",
    "kaziranga-national-park": "Nov–Apr (park open)",
    "darjeeling": "Oct–Apr (clear Kanchenjunga views)",
    "sikkim-gangtok": "Oct–Apr (alpine trails)",
}

SUMMARY_TEMPLATES = {
    "Hill Stations & Mountain Regions": "{name} is a classic hill circuit for pine walks, sunrise viewpoints, and chai pauses.",
    "Nature & Trekking Spots": "{name} rewards trekkers with alpine meadows, root bridges, and waterfall scrambles.",
    "Cultural & Historical": "{name} layers royal architecture, heritage walks, and buzzing bazaars.",
    "Beaches & Backwaters": "{name} mixes sunrise beach meditations with shack-side seafood and sunset cruises.",
    "Hill Stations": "{name} keeps temperatures mellow for tea estates, lake loops, and lazy promenades.",
    "Heritage & Temple Destinations": "{name} spotlights temple rituals, gopuram silhouettes, and sacred tanks.",
    "Major Cities": "{name} delivers urban energy—coffee labs, indie art, and midnight food streets.",
    "Cities & Culture": "{name} is perfect for heritage precinct walks, craft markets, and fusion diners.",
    "Coastal Areas": "{name} keeps breezy drives, cliffside photo stops, and water sports within reach.",
    "Desert & Heritage": "{name} blends desert drives, camel safaris, and fort sunsets.",
    "Mountains & Nature": "{name} is pure Northeast lushness with waterfalls, tea ridges, and cloud forests.",
    "Islands": "{name} offers lagoon dives, bioluminescent beaches, and hammock afternoons.",
    "Cultural & Heritage": "{name} highlights UNESCO temples, ritual arts, and iconic street food.",
}


def slugify(label: str) -> str:
    label = label.lower().strip()
    label = label.replace(" & ", " and ")
    label = label.replace("—", "-").replace("--", "-")
    label = re.sub(r"[^a-z0-9]+", "-", label)
    label = re.sub(r"-{2,}", "-", label)
    return label.strip("-")


def split_names(entry: str):
    entry = entry.replace("—", "-")
    match = re.match(r"(.+?)(?:\((.+)\))?$", entry.strip())
    if match:
        names_part, state = match.group(1).strip(), match.group(2)
    else:
        names_part, state = entry.strip(), None
    names_part = names_part.replace("&", ",")
    names = [n.strip() for n in names_part.split(",") if n.strip()]
    names = [n.replace("--", "-").replace("  ", " ") for n in names]
    return names, state.strip() if state else None


def parse_catalog():
    text = GUIDE_PATH.read_text(encoding="utf-8")
    current_region = None
    current_category = None
    entries: Dict[str, Dict] = {}

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("## "):
            region_title = stripped[3:].strip()
            if region_title and region_title[0].isdigit() and "." in region_title:
                region_title = region_title.split(".", 1)[1].strip()
            if region_title.lower().startswith("summary"):
                break
            current_region = region_title
            continue
        if stripped.startswith("### "):
            current_category = None
            continue
        if stripped.startswith("#### "):
            current_category = stripped[5:].strip()
            continue
        if not stripped.startswith("-"):
            continue
        if not current_region or not current_category:
            continue
        raw = stripped[1:].strip()
        names, state = split_names(raw)
        for name in names:
            key = slugify(name)
            if not key:
                continue
            state_value = state if state and state in STATE_REGION else None
            exists = entries.setdefault(
                key,
                {
                    "id": key,
                    "name": name,
                    "region": current_region,
                    "state": state_value,
                    "categories": set(),
                },
            )
            # set best-known region
            if state_value:
                exists["region"] = STATE_REGION[state_value]
                exists["state"] = state_value
            exists["categories"].add(current_category)

    catalog = []
    for dest in entries.values():
        categories = sorted(dest["categories"])
        primary_cat = categories[0]
        interests = CATEGORY_INTERESTS.get(primary_cat, ["culture", "photography"])
        best_time = DESTINATION_BEST_TIME.get(dest["id"])
        region_label = dest["region"]
        if not best_time:
            best_time = REGION_BEST_TIMES.get(region_label, "Oct–March")
        summary = SUMMARY_TEMPLATES.get(
            primary_cat, f"{dest['name']} invites interest-led exploration."
        )
        catalog.append(
            {
                "id": dest["id"],
                "name": dest["name"],
                "region": region_label,
                "state": dest["state"],
                "primaryCategory": primary_cat,
                "categories": categories,
                "interests": interests,
                "bestTime": best_time,
                "summary": summary,
            }
        )
    catalog.sort(key=lambda item: item["name"])
    OUTPUT_PATH.write_text(json.dumps(catalog, indent=2, ensure_ascii=False), encoding="utf-8")
    return len(catalog)


if __name__ == "__main__":
    count = parse_catalog()
    print(f"Wrote {count} destinations to {OUTPUT_PATH}")

