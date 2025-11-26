import json
import os
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional


def _default_data_dir() -> Path:
    """Resolve the base directory for mock data files."""
    return Path(__file__).resolve().parent.parent / "data"


DATA_DIR = Path(os.getenv("TRAVEL_DATA_DIR", _default_data_dir()))


def _load_json(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(f"Mock data file missing: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


class DataStore:
    """In-memory cache for mock travel data with lightweight mutation helpers."""

    def __init__(self) -> None:
        self._lock = Lock()
        self.spots: List[Dict[str, Any]] = []
        self.blog_posts: List[Dict[str, Any]] = []
        self.insta_posts: List[Dict[str, Any]] = []
        self.alerts: List[Dict[str, Any]] = []
        self.destinations: List[Dict[str, Any]] = []
        self._destination_index: Dict[str, Dict[str, Any]] = {}
        self.tagged_hidden_gems: Dict[str, List[str]] = {}
        self.refresh()

    def refresh(self) -> None:
        """Reload all mock files from disk."""
        with self._lock:
            self.spots = _load_json(DATA_DIR / "shimla_spots.json")
            scraped_dir = DATA_DIR / "scraped"
            self.blog_posts = _load_json(scraped_dir / "blog_posts.json")
            self.insta_posts = _load_json(scraped_dir / "insta_posts.json")
            self.alerts = _load_json(scraped_dir / "alerts.json")
            catalog_path = DATA_DIR / "destinations_catalog.json"
            self.destinations = _load_json(catalog_path)
            self._destination_index = {}
            for record in self.destinations:
                self._destination_index[record["id"]] = record
                normalized_name = self._normalize_destination_key(record["name"])
                self._destination_index[normalized_name] = record
            self.tagged_hidden_gems = {}

    @property
    def scraped_items(self) -> List[Dict[str, Any]]:
        """Flatten scraped content for admin UI."""
        flattened: List[Dict[str, Any]] = []
        for source, collection in [
            ("blog", self.blog_posts),
            ("instagram", self.insta_posts),
            ("alert", self.alerts),
        ]:
            for item in collection:
                flattened.append({**item, "sourceType": source})
        return flattened

    def _normalize_destination_key(self, value: str) -> str:
        return value.replace("_", "-").replace(" ", "-").lower()

    def list_destinations(self) -> List[Dict[str, Any]]:
        return self.destinations

    def get_destination(self, identifier: str) -> Optional[Dict[str, Any]]:
        if not identifier:
            return None
        normalized = self._normalize_destination_key(identifier)
        return self._destination_index.get(normalized)

    def mark_hidden_gem(
        self, item_id: str, destination_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Tag a destination so itineraries elevate hidden gems."""
        with self._lock:
            candidate = next(
                (item for item in self.scraped_items if item["id"] == item_id), None
            )
            if not candidate:
                raise ValueError(f"No scraped item with id '{item_id}'")
            target_destination = destination_id or candidate.get("destinationId")
            if not target_destination and candidate.get("destination"):
                target_destination = candidate["destination"]
            destination = (
                self.get_destination(target_destination) if target_destination else None
            )
            if not destination:
                raise ValueError(
                    "Destination not resolved for hidden gem tagging; provide destinationId."
                )
            dest_id = destination["id"]
            self.tagged_hidden_gems.setdefault(dest_id, []).append(item_id)
            return {
                "taggedItemId": item_id,
                "destinationId": dest_id,
                "note": "Hidden gem boost applied to itinerary scoring.",
            }

    def get_spot_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        search = name.strip().lower()
        for spot in self.spots:
            if spot["name"].lower() == search or spot["id"].lower() == search:
                return spot
        return None


DATA_STORE = DataStore()

