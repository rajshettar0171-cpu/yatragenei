"""
This stub simulates a scraping pipeline by reading local mock files and emitting
a normalized feed. Replace with a real scraper when connecting to live sources.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List

from .data_loader import DATA_DIR


def load_stub_payload() -> Dict[str, List[dict]]:
    scraped_dir = DATA_DIR / "scraped"
    payload = {}
    for name in ["blog_posts", "insta_posts", "alerts"]:
        path = scraped_dir / f"{name}.json"
        with path.open("r", encoding="utf-8") as file:
            payload[name] = json.load(file)
    return payload


def summarize(payload: Dict[str, List[dict]]) -> str:
    lines = []
    lines.append(f"Loaded {len(payload['blog_posts'])} travel blogs")
    lines.append(f"Loaded {len(payload['insta_posts'])} Instagram intel drops")
    lines.append(f"Loaded {len(payload['alerts'])} live alerts")
    hidden_gems = [
        item["title"]
        for item in payload["blog_posts"]
        if "hidden" in item.get("tags", [])
    ]
    if hidden_gems:
        lines.append(f"Blog-derived hidden gems: {', '.join(hidden_gems)}")
    return "\n".join(lines)


if __name__ == "__main__":
    feed = load_stub_payload()
    print(summarize(feed))

