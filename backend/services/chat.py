from typing import Any, Dict, List, Optional

from pydantic import BaseModel

from ..data_loader import DataStore
from .alerts import generate_destination_alerts


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    reply: str
    sources: List[Dict[str, str]]
    confidence: float


class ChatService:
    """Rule-based travel assistant that leans on scraped intel."""

    def __init__(self, store: DataStore) -> None:
        self.store = store

    def respond(self, message: str, context: Optional[Dict[str, Any]] = None) -> ChatResponse:
        text = message.lower()
        destination = self._resolve_destination(context)
        alerts = generate_destination_alerts(destination, self.store.alerts)
        spot = self._detect_spot(text) if destination["id"] == "shimla" else None
        sources: List[Dict[str, str]] = []

        if "crowd" in text or "busy" in text:
            reply, source = self._crowd_update(destination, spot)
            if source:
                sources.append(source)
            return ChatResponse(reply=reply, sources=sources, confidence=0.84)

        if "alternate" in text or "instead" in text or "option" in text:
            reply, source = self._suggest_alternative(destination, spot, context)
            if source:
                sources.append(source)
            return ChatResponse(reply=reply, sources=sources, confidence=0.8)

        if "weather" in text or "rain" in text or "snow" in text:
            reply, source = self._weather_brief(destination, alerts)
            if source:
                sources.append(source)
            return ChatResponse(reply=reply, sources=sources, confidence=0.78)

        if "road" in text or "closure" in text or "traffic" in text:
            reply, source = self._road_status(destination, alerts)
            if source:
                sources.append(source)
            return ChatResponse(reply=reply, sources=sources, confidence=0.82)

        if "hidden gem" in text or "offbeat" in text:
            reply, source = self._hidden_gem_tip(destination)
            if source:
                sources.append(source)
            return ChatResponse(reply=reply, sources=sources, confidence=0.76)

        reply = self._general_answer(destination, spot)
        return ChatResponse(reply=reply, sources=sources, confidence=0.7)

    def _resolve_destination(self, context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        candidate = "shimla"
        if context:
            candidate = (
                context.get("destinationId")
                or context.get("destination")
                or context.get("destination_id")
                or candidate
            )
        destination = self.store.get_destination(candidate)
        if not destination:
            destination = self.store.get_destination("shimla") or self.store.destinations[0]
        return destination

    def _detect_spot(self, text: str) -> Optional[Dict[str, Any]]:
        for spot in self.store.spots:
            if spot["name"].lower() in text or spot["id"].lower() in text:
                return spot
        return None

    def _crowd_update(
        self, destination: Dict[str, Any], spot: Optional[Dict[str, Any]]
    ) -> tuple[str, Optional[Dict[str, str]]]:
        if destination["id"] != "shimla" or not spot:
            best_time = destination.get("bestTime", "typical shoulder months")
            reply = (
                f"{destination['name']} is calmest on weekday mornings before 10 AM. "
                f"Peak window noted in our guide: {best_time}. "
                "Book key attractions in advance and keep a backup cafe/park in mind."
            )
            return reply, {"type": "destination", "id": destination["id"]}
        related_post = next(
            (post for post in self.store.insta_posts if spot["name"] in post.get("geoTags", [])),
            None,
        )
        crowd_level = spot.get("crowdScore", 6)
        reply = (
            f"{spot['name']} is currently rated {crowd_level}/10 on crowd scale. "
            f"{'Go before 9 AM to beat the rush.' if crowd_level >= 7 else 'Expect relaxed flows for most of the day.'}"
        )
        if related_post:
            reply += f" Latest field note ({related_post['source']}): {related_post['content'][:160]}..."
            return reply, {"type": "insta", "id": related_post["id"]}
        return reply, None

    def _suggest_alternative(
        self,
        destination: Dict[str, Any],
        spot: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]],
    ) -> tuple[str, Optional[Dict[str, str]]]:
        interests = [interest.lower() for interest in (context or {}).get("interests", [])]
        if destination["id"] == "shimla":
            candidate = next(
                (
                    s
                    for s in self.store.spots
                    if s != spot and s.get("isHiddenGem") and any(tag in interests for tag in s.get("tags", []))
                ),
                None,
            )
            if not candidate:
                candidate = next((s for s in self.store.spots if s.get("isHiddenGem")), self.store.spots[0])
            reply = (
                f"Swap {spot['name'] if spot else 'the busy stop'} for {candidate['name']} — "
                f"{candidate['description']} Crowd score {candidate['crowdScore']}/10 with easier access."
            )
            return reply, {"type": "spot", "id": candidate["id"]}
        reply = (
            f"Instead of {spot['name'] if spot else 'the main attraction'}, detour to a local-led hidden gem near {destination['name']}. "
            f"Look for artisan lanes and community-run cafes — fewer crowds, richer stories. Interests noted: {', '.join(interests) or 'general blend'}."
        )
        return reply, {"type": "destination", "id": destination["id"]}

    def _weather_brief(
        self, destination: Dict[str, Any], alerts: List[Dict[str, Any]]
    ) -> tuple[str, Optional[Dict[str, str]]]:
        alert = next((a for a in alerts if a["type"] == "weather"), None)
        if alert:
            reply = f"Weather desk: {alert['title']} — {alert['description']}"
            return reply, {"type": "alert", "id": alert["id"]}
        return (
            f"No live weather advisory for {destination['name']}. Still pack a light layer and keep an eye on IMD updates.",
            {"type": "destination", "id": destination["id"]},
        )

    def _road_status(
        self, destination: Dict[str, Any], alerts: List[Dict[str, Any]]
    ) -> tuple[str, Optional[Dict[str, str]]]:
        alert = next((a for a in alerts if a["type"] == "road_closure"), None)
        if alert:
            reply = f"Road ops: {alert['title']} — {alert['description']}"
            return reply, {"type": "alert", "id": alert["id"]}
        return (
            f"All arterial routes into {destination['name']} currently open. Buffer 20 minutes for checkpoints and photo halts.",
            {"type": "destination", "id": destination["id"]},
        )

    def _hidden_gem_tip(
        self, destination: Dict[str, Any]
    ) -> tuple[str, Optional[Dict[str, str]]]:
        if destination["id"] == "shimla":
            gem = next((spot for spot in self.store.spots if spot.get("isHiddenGem")), None)
            if not gem:
                gem = self.store.spots[0]
            reply = f"Hidden gem pick: {gem['name']} — {gem['description']}"
            return reply, {"type": "spot", "id": gem["id"]}
        reply = (
            f"Hidden gem cue for {destination['name']}: explore side streets highlighted in the region brief and ask homestay hosts about community-run spots."
        )
        return reply, {"type": "destination", "id": destination["id"]}

    def _general_answer(
        self, destination: Dict[str, Any], spot: Optional[Dict[str, Any]]
    ) -> str:
        if destination["id"] == "shimla" and spot:
            return (
                f"{spot['name']} opens {spot['openingHours']} with entry fee {spot.get('entryFee', 'Free')}."
                f" Best window: {spot.get('bestTime', 'early morning')}."
            )
        summary = destination.get("summary", "")
        best_time = destination.get("bestTime", "peak season")
        return (
            f"{destination['name']} intel active. Expect best conditions around {best_time}. "
            f"{summary} Ask about road, weather, or alternate experiences for deeper cuts."
        )

