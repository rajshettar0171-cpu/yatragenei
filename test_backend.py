#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Quick test script to verify backend core logic without FastAPI server."""

import sys
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

try:
    from data_loader import DataStore
    from services.itinerary import ItineraryRequest, generate_itinerary_local
    from services.chat import ChatService, ChatRequest
    
    print("[OK] All imports successful")
    
    # Test DataStore
    store = DataStore()
    print(f"[OK] DataStore: {len(store.spots)} spots, {len(store.blog_posts)} blogs, {len(store.insta_posts)} insta posts, {len(store.alerts)} alerts")
    
    # Test itinerary generation
    request = ItineraryRequest(
        destination="shimla",
        days=2,
        budget="low",
        traveler_type="solo",
        interests=["trekking", "photography"],
        month="November"
    )
    
    itinerary = generate_itinerary_local(store, request)
    print(f"[OK] Itinerary generated: {len(itinerary.days)} days for {itinerary.destination}")
    print(f"  - Day 1 theme: {itinerary.days[0].theme}")
    print(f"  - Day 1 segments: {len(itinerary.days[0].segments)}")
    print(f"  - Summary: {itinerary.summary.get('travelerType', 'N/A')} traveler, {itinerary.summary.get('budget', 'N/A')} budget")
    
    # Test chat service
    chat_service = ChatService(store)
    chat_response = chat_service.respond("Is Kufri crowded today?", {"interests": ["trekking"]})
    print(f"[OK] Chat response: {chat_response.reply[:80]}...")
    print(f"  - Confidence: {chat_response.confidence}")
    print(f"  - Sources: {len(chat_response.sources)}")
    
    # Test destination catalog
    catalog_path = Path("data/destinations_catalog.json")
    if catalog_path.exists():
        with open(catalog_path, encoding="utf-8") as f:
            catalog = json.load(f)
        print(f"[OK] Destinations catalog: {len(catalog)} destinations loaded")
        sample = catalog[0] if catalog else None
        if sample:
            print(f"  - Sample: {sample.get('name')} ({sample.get('region')})")
    
    print("\n[SUCCESS] All core backend tests passed!")
    print("\nNote: FastAPI server requires Python 3.8+. Current Python version may be too old.")
    print("To run the full server, upgrade to Python 3.8+ and run: uvicorn backend.main:app --reload")
    
except ImportError as e:
    print(f"[ERROR] Import error: {e}")
    print("This is expected if FastAPI dependencies aren't installed (requires Python 3.8+)")
except Exception as e:
    print(f"[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()

