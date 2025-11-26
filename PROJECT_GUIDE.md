# YatraGenie - AI Travel Assistant POC

## 📋 Project Overview

**YatraGenie** is an investor-ready proof-of-concept (POC) for an AI-powered travel assistant web application focused on Indian destinations. The system generates personalized multi-day itineraries based on user interests, budget, traveler type, and travel month, with real-time intelligence from scraped content (blogs, Instagram posts, government alerts).

### Key Value Proposition
- **Interest-based customization**: Itineraries change significantly based on selected interests (trekking, food, photography, relaxation, culture, adventure, nature, shopping)
- **Multi-destination support**: Works with 62+ Indian destinations across North, South, East, and West India
- **Real-time intelligence**: Integrates road alerts, weather advisories, and local events
- **Hidden gem discovery**: Admin can tag scraped content as hidden gems, which boosts those spots in future itineraries
- **Offline-ready**: Downloadable JSON itineraries for areas with poor connectivity

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + TailwindCSS
- **Backend**: FastAPI (Python) + Pydantic for validation
- **Data**: Local JSON files (mock data simulating a RAG-like retrieval system)
- **No external dependencies**: Works entirely offline with mock data

### System Components

1. **Itinerary Generator** (`backend/services/itinerary.py`)
   - Deterministic algorithm using Haversine distance calculations
   - Multi-factor scoring: interest match, crowd levels, hidden gem boost, budget alignment
   - Generates day-by-day plans with morning/afternoon/evening segments
   - Includes travel times, food stops, entry fees, and personalized notes

2. **Chat Assistant** (`backend/services/chat.py`)
   - Rule-based natural language processing
   - Answers queries about crowds, weather, road conditions, alternatives, hidden gems
   - Uses scraped content (Instagram posts, blogs, alerts) for context-aware responses

3. **Data Store** (`backend/data_loader.py`)
   - In-memory cache for all mock data
   - Supports tagging hidden gems from scraped content
   - Thread-safe with refresh capability

4. **Admin Panel** (Frontend component)
   - View all scraped content (blogs, Instagram posts, alerts)
   - Tag items as hidden gems (updates spot scoring)
   - Filter by destination/region

## 📁 Project Structure

```
YatraGenie/
├── backend/                    # FastAPI backend
│   ├── main.py                # FastAPI app with all routes
│   ├── data_loader.py         # DataStore class for loading/managing mock data
│   ├── scraper_stub.py        # Simulates web scraping pipeline
│   ├── services/
│   │   ├── itinerary.py       # Core itinerary generation logic
│   │   ├── chat.py            # Chat assistant service
│   │   └── alerts.py          # Alert processing and filtering
│   ├── requirements.txt       # Python dependencies
│   └── env.example            # Environment variables template
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── page.tsx           # Main landing page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── TripForm.tsx       # Trip planning form
│   │   ├── ItineraryCard.tsx  # Day-by-day itinerary display
│   │   ├── ChatModal.tsx      # Chat assistant UI
│   │   ├── AlertsPanel.tsx    # Real-time alerts display
│   │   ├── AdminPanel.tsx     # Admin content management
│   │   └── LoadingSkeleton.tsx
│   ├── lib/
│   │   └── types.ts          # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
│
├── data/                       # Mock data files
│   ├── destinations_catalog.json    # 62 destinations with metadata
│   ├── shimla_spots.json            # Detailed Shimla attractions (15 spots)
│   └── scraped/
│       ├── blog_posts.json           # Sample travel blog posts
│       ├── insta_posts.json          # Sample Instagram captions
│       └── alerts.json               # Road/weather/event alerts
│
├── scripts/
│   └── build_catalog.py       # Script to generate destinations_catalog.json
│
├── README.md                   # Main project documentation
├── PROJECT_GUIDE.md           # This file - handoff guide
├── TEST_RESULTS.md            # Test results and validation
└── demo_script.md             # Investor demo walkthrough
```

## 🚀 How to Run

### Prerequisites
- **Python 3.8+** (3.9+ recommended) - FastAPI requires 3.8+
- **Node.js 18+** - For Next.js frontend
- **pip** and **npm** package managers

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Optional: Set up environment variables
# Copy env.example to .env and add OPENAI_API_KEY if you want LLM features
cp env.example .env
```

### Step 2: Start Backend Server

```bash
# From backend directory
uvicorn backend.main:app --reload --port 8000

# Server will run at http://localhost:8000
# API docs available at http://localhost:8000/docs
```

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Optional: Set up environment variables
# Copy env.example to .env.local and set NEXT_PUBLIC_API_BASE_URL if needed
cp env.example .env.local
```

### Step 4: Start Frontend Server

```bash
# From frontend directory
npm run dev

# Frontend will run at http://localhost:3000
```

### Step 5: Access Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## 🔌 API Endpoints

### Public Endpoints

| Method | Path | Description | Request Body |
|--------|------|-------------|--------------|
| GET | `/api/health` | Health check | - |
| GET | `/api/destinations` | List all 62+ destinations | - |
| GET | `/api/destination/{slug}` | Get destination details | - |
| POST | `/api/itinerary` | Generate personalized itinerary | `{destination, days, budget, traveler_type, interests[], month, use_llm?}` |
| POST | `/api/chat` | Chat with AI assistant | `{message, context?}` |
| GET | `/api/alerts` | Get active alerts for destination | `?destination={slug}` |

### Admin Endpoints

| Method | Path | Description | Request Body |
|--------|------|-------------|--------------|
| GET | `/api/admin/scraped` | Get all scraped content | `?destination={slug}` (optional) |
| POST | `/api/admin/tag` | Tag item as hidden gem | `{itemId}` |
| POST | `/api/admin/refresh` | Reload mock data from disk | - |

### Example API Calls

**Generate Itinerary:**
```bash
curl -X POST http://localhost:8000/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "shimla",
    "days": 2,
    "budget": "low",
    "traveler_type": "solo",
    "interests": ["trekking", "photography"],
    "month": "November"
  }'
```

**Chat Query:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is Kufri crowded today?",
    "context": {"interests": ["trekking"]}
  }'
```

## 🎯 Key Features Explained

### 1. Interest-Based Customization

The itinerary **MUST** change based on selected interests. Each interest type has different activity patterns:

- **Trekking**: Long hikes, forest trails, hill viewpoints, early morning starts
- **Food**: Local markets, iconic eateries, café hopping, street food walks
- **Photography**: Sunrise points, scenic lakes, historic spots, golden hour timing
- **Relaxation**: Spas, peaceful parks, lakesides, slow-paced afternoons
- **Culture**: Temples, museums, historic monuments, heritage walks
- **Adventure**: Paragliding, rafting, zipline, off-roading, safari
- **Nature**: Waterfalls, lakes, botanical gardens, forests
- **Shopping**: Local markets, handicrafts, street shopping, flea markets

**Implementation**: See `INTEREST_BEHAVIORS` dictionary in `backend/services/itinerary.py` (lines 621-694)

### 2. Multi-Destination Support

- **Shimla**: Has detailed spot data (15 attractions with coordinates, opening hours, crowd scores)
- **Other destinations**: Use catalog-based generation with region-specific templates
- **Region mapping**: North, South, East, West India with appropriate best-time windows

**Data Source**: `data/destinations_catalog.json` (generated from `content.md` via `scripts/build_catalog.py`)

### 3. Itinerary Generation Logic

**Scoring Algorithm** (in `_score_spot` function):
```
Base Score = 50 + (Interest Overlap × 12)
Crowd Factor = 10 - crowdScore (lower crowds = higher score)
Budget Bonus = +5 if budget is "low" and entry is free
Hidden Gem Bonus = +15 if spot is tagged as hidden gem
Final Score = Base + Crowd Factor + Budget Bonus + Gem Bonus
```

**Day Planning**:
- Groups spots by geographic proximity (Haversine distance)
- Minimizes travel time between segments
- Adjusts difficulty based on interests (trekking ≠ relaxation)
- Includes travel suggestions (walk/taxi/bus) with time estimates

### 4. Chat Assistant Intelligence

**Rule-based NLP** that recognizes:
- Crowd queries: "Is [place] crowded?"
- Weather queries: "What's the weather?"
- Road conditions: "Any road closures?"
- Alternatives: "Alternative to [place]?"
- Hidden gems: "Show me hidden gems"

**Context Sources**:
- Instagram posts (real-time crowd sentiment)
- Blog posts (local insights)
- Government alerts (road closures, weather)

### 5. Hidden Gem System

**Workflow**:
1. Admin views scraped content in Admin Panel
2. Tags an Instagram post or blog as "hidden gem"
3. System matches geo-tags to spots in database
4. Marks matching spots with `isHiddenGem: 1`
5. Future itineraries boost these spots by +15 points

**Implementation**: `DataStore.mark_hidden_gem()` in `backend/data_loader.py`

## 🔧 Important Code Patterns

### Data Loading
- All data loaded at startup into `DataStore` singleton
- Thread-safe with locks for concurrent access
- Refresh capability to reload from disk

### Error Handling
- Never outputs "No itinerary found" - always generates a valid plan
- Falls back to catalog-based generation if destination has no detailed spots
- Graceful degradation if LLM API key missing

### Type Safety
- Pydantic models for request/response validation
- TypeScript types in frontend for type safety
- Shared type definitions in `frontend/lib/types.ts`

## 🐛 Known Issues & Limitations

1. **Python Version**: Requires Python 3.8+ (FastAPI dependency)
2. **Mock Data Only**: No real web scraping or LLM calls (unless API key provided)
3. **Shimla Detail**: Only Shimla has detailed spot data; others use templates
4. **Single Language**: Currently English-only (designed for Indian destinations)

## 📝 Development Notes

### Adding New Destinations

1. **Option A - Detailed Spots** (like Shimla):
   - Create `data/{destination}_spots.json` with same structure as `shimla_spots.json`
   - Update `DataStore.refresh()` to load it
   - Add destination-specific logic in itinerary generator

2. **Option B - Catalog Entry**:
   - Add entry to `data/region_guide.md`
   - Run `python scripts/build_catalog.py` to regenerate catalog
   - System will use template-based generation

### Extending Interests

1. Add interest to `INTEREST_BEHAVIORS` in `backend/services/itinerary.py`
2. Add to `INTEREST_OPTIONS` in `frontend/components/TripForm.tsx`
3. Update interest matching logic in `_interest_overlap()` function

### Adding Real LLM Integration

1. Set `OPENAI_API_KEY` in `backend/.env`
2. Call `generate_itinerary_with_llm()` instead of `generate_itinerary_local()`
3. Implement LLM prompt in `generate_itinerary_with_llm()` function (currently placeholder)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads and displays destination selector
- [ ] Can generate itinerary for Shimla
- [ ] Can generate itinerary for other destinations
- [ ] Chat assistant responds to queries
- [ ] Alerts panel displays active alerts
- [ ] Admin panel shows scraped content
- [ ] Tagging hidden gem updates itinerary scoring
- [ ] Download JSON works
- [ ] Different interests produce different itineraries

### Automated Testing

Run syntax validation:
```bash
python -m py_compile backend/**/*.py
```

Validate JSON files:
```bash
python -c "import json; json.load(open('data/destinations_catalog.json', encoding='utf-8'))"
```

## 📊 Data Structure Examples

### Destination Catalog Entry
```json
{
  "id": "shimla",
  "name": "Shimla",
  "region": "North India",
  "state": "Himachal Pradesh",
  "primaryCategory": "Hill Stations & Mountain Regions",
  "interests": ["trekking", "photography", "relaxation", "nature", "adventure"],
  "bestTime": "March–June & Sept–Nov",
  "summary": "Shimla is a classic hill circuit for pine walks, sunrise viewpoints, and chai pauses."
}
```

### Spot Entry (Shimla)
```json
{
  "id": "spot-jakhu-temple",
  "name": "Jakhu Temple",
  "description": "Ancient Hindu temple...",
  "lat": 31.1070,
  "lng": 77.1734,
  "bestTime": "Early morning (6:00 AM - 9:00 AM)",
  "entryFee": "Free",
  "openingHours": "6:00 AM - 9:00 PM",
  "crowdScore": 7,
  "tags": ["trekking", "culture", "nature", "photography"],
  "isHiddenGem": 0
}
```

### Itinerary Request
```json
{
  "destination": "shimla",
  "days": 2,
  "budget": "low",
  "traveler_type": "solo",
  "interests": ["trekking", "photography"],
  "month": "November",
  "use_llm": false
}
```

## 🎬 Demo Flow (for Investors)

1. **Landing**: Show destination selector, select Shimla
2. **Form**: Fill 2 days, low budget, solo, interests: trekking + photography
3. **Generate**: Click "Generate Itinerary" → show loading → display day-by-day plan
4. **Highlight**: Point out hidden gems, cost breakdown, travel times
5. **Chat**: Ask "Is Kufri crowded today?" → show context-aware response
6. **Admin**: Navigate to Admin → tag Instagram post as hidden gem → regenerate itinerary
7. **Download**: Show offline JSON download capability

## 🔮 Future Enhancements (TODO Markers in Code)

1. **LLM Integration**: `backend/services/itinerary.py` line 613-619
2. **Live Web Scraping**: `backend/scraper_stub.py` - replace with real scraper
3. **Vector Database**: Add semantic search for better content matching
4. **User Accounts**: Add authentication and saved itineraries
5. **Mobile Apps**: iOS/Android versions
6. **Multi-language**: Support for Hindi and regional languages

## 📚 Additional Resources

- **README.md**: Main project documentation
- **demo_script.md**: Step-by-step investor demo script
- **TEST_RESULTS.md**: Test validation results
- **content.md**: Source data for destinations (in attached_assets)

## 💡 Quick Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.8+)
- Check dependencies: `pip list | grep fastapi`
- Check port 8000 is available

**Frontend won't start:**
- Check Node.js: `node --version` (need 18+)
- Check dependencies: `npm list`
- Check port 3000 is available

**API calls fail:**
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `NEXT_PUBLIC_API_BASE_URL` in frontend `.env.local`

**No data showing:**
- Verify JSON files exist in `data/` directory
- Check `DataStore.refresh()` is called
- Verify file encoding is UTF-8

---

**Last Updated**: Current session
**Maintainer**: Development team
**Status**: Production-ready POC

