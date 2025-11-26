from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .data_loader import DATA_STORE
from .services.chat import ChatRequest, ChatResponse, ChatService
from .services.itinerary import (
    ItineraryRequest,
    ItineraryResponse,
    destination_profile,
    generate_itinerary_local,
    generate_itinerary_with_llm,
)
from .services.alerts import generate_destination_alerts


class TagRequest(BaseModel):
    itemId: str
    destinationId: Optional[str] = None


app = FastAPI(
    title="India Travel Intelligence POC",
    description="FastAPI backend that powers itinerary generation, chat support, and admin tooling for Indian destinations.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_service = ChatService(DATA_STORE)


@app.get("/api/health")
def health() -> Dict[str, Any]:
    """Health check endpoint for deployment monitoring."""
    try:
        return {
            "status": "ok",
            "primaryDestination": "Shimla",
            "spotsLoaded": len(DATA_STORE.spots) if hasattr(DATA_STORE, "spots") else 0,
            "destinationsLoaded": len(DATA_STORE.destinations) if hasattr(DATA_STORE, "destinations") else 0,
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.get("/api/destinations")
def list_destinations() -> Dict[str, Any]:
    return {"destinations": DATA_STORE.list_destinations()}


@app.get("/api/destination/{slug}")
def destination_snapshot(slug: str) -> Dict[str, Any]:
    destination = DATA_STORE.get_destination(slug)
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    profile = destination_profile(destination)
    alerts = generate_destination_alerts(destination, DATA_STORE.alerts)
    top_spots = DATA_STORE.spots[:5] if destination["id"] == "shimla" else []
    experiences = (
        [f"{interest.title()} block" for interest in destination.get("interests", [])]
        if destination["id"] != "shimla"
        else []
    )
    return {
        "name": destination["name"],
        "region": destination["region"],
        "bestTime": destination.get("bestTime"),
        "summary": destination.get("summary"),
        "interests": destination.get("interests", []),
        "tagline": "AI travel assistant delivering region-first intelligence.",
        "heroCopy": "Plan confident trips with real-time alerts, hidden gems, and offline-ready itineraries.",
        "topSpots": top_spots,
        "experienceIdeas": experiences,
        "alerts": alerts,
        "roadTripPlan": profile["roadTrip"].format(name=destination["name"]),
        "bikePlan": profile["bikeRoute"].format(name=destination["name"]),
        "adventureHighlights": profile["adventureHighlights"],
        "foodHighlights": profile["foodHighlights"],
    }


@app.post("/api/itinerary", response_model=ItineraryResponse)
def create_itinerary(payload: ItineraryRequest) -> ItineraryResponse:
    try:
        if payload.use_llm:
            try:
                return generate_itinerary_with_llm(DATA_STORE, payload)
            except RuntimeError:
                return generate_itinerary_local(DATA_STORE, payload)
        return generate_itinerary_local(DATA_STORE, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    return chat_service.respond(payload.message, payload.context)


@app.get("/api/admin/scraped")
def scraped_feed(destination: Optional[str] = Query(default=None)) -> Dict[str, Any]:
    def _filter(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not destination:
            return records
        return [
            item
            for item in records
            if item.get("destinationId") == destination or item.get("destination") == destination
        ]

    return {
        "blogs": _filter(DATA_STORE.blog_posts),
        "insta": _filter(DATA_STORE.insta_posts),
        "alerts": _filter(DATA_STORE.alerts),
    }


@app.post("/api/admin/tag")
def tag_hidden_gem(payload: TagRequest) -> Dict[str, Any]:
    try:
        return DATA_STORE.mark_hidden_gem(payload.itemId, payload.destinationId)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/api/admin/refresh")
def refresh_data() -> Dict[str, Any]:
    DATA_STORE.refresh()
    return {"status": "reloaded"}

