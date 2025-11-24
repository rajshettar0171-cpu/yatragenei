# TravelAI - Multi-Destination Travel Assistant POC

## Project Overview
AI-powered travel assistant POC for exploring major Indian destinations organized by region. Generates personalized itineraries, provides real-time alerts, discovers hidden gems, and offers an intelligent chat assistant - all running entirely within Replit using mock data.

**Supported Destinations** (12 total, organized by region):
- **North**: Shimla, Dharamshala, Jaipur, Mussoorie
- **South**: Munnar, Ooty, Coorg
- **East**: Darjeeling, Sikkim
- **West**: Goa, Udaipur, Mount Abu

## Quick Run
1. Click the "Run" button in Replit
2. App launches automatically on port 5000
3. Home page shows destination selector organized by region
4. Choose any destination to generate personalized itineraries
5. No API keys or configuration required for demo

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Shadcn UI
- **Backend**: Express.js + TypeScript + In-memory storage with destination filtering
- **Data**: Organized JSON files supporting multiple destinations (50+ spots, 3 blog posts, 10 Instagram posts, 5 destination-specific alerts)
- **Routing**: Home → Destinations (selector) → Home (with destination) → Itinerary

## Key Features Implemented
✅ Destination selector page organized by region (North, South, East, West India)
✅ Dynamic landing page that updates based on selected destination
✅ Multi-destination trip planning form (days, budget, traveler type, interests)
✅ Smart itinerary generator using Haversine distance & interest matching
✅ Day-by-day plans with time/cost/travel mode estimates
✅ Rule-based chat assistant with context-aware responses
✅ Real-time alerts panel with destination-specific alerts
✅ Admin dashboard to tag hidden gems
✅ JSON download for offline itineraries
✅ Beautiful, investor-ready UI with regional color themes

## Data Files
- `data/destinations.json` - 12 major Indian destinations organized by region
- `data/spots-data.json` - 50+ curated attractions across destinations with coordinates, crowd scores, tags
- `data/blog_posts.json` - 3 travel blog articles with local insights
- `data/insta_posts.json` - 10 Instagram-style posts with geo-tags
- `data/multi-alerts.json` - 5 destination-specific alerts (road, weather, events, maintenance)
- Legacy: `data/shimla_spots.json` (kept for reference)
- Legacy: `data/alerts.json` (kept for reference)

## API Endpoints (Enhanced for Multi-Destination)
- `GET /api/destinations` - List all available destinations
- `GET /api/destination/:name` - Get specific destination info, top spots, and alerts
- `POST /api/itinerary` - Generate itinerary (requires: destination, days, budget, travelerType, interests)
- `POST /api/chat` - Chat assistant (requires: message, optional context)
- `GET /api/alerts` - Get all alerts (can filter by destination)
- `GET /api/admin/scraped` - Get all scraped content
- `POST /api/admin/tag` - Tag content as hidden gem (requires: id, tag)

## Recent Changes (Multi-Destination Expansion)
✅ Added new destinations.json with 12 major Indian destinations
✅ Restructured spots data into spots-data.json organized by destination
✅ Created multi-alerts.json with destination-specific alerts
✅ New destinations.tsx page with region-based selector
✅ Updated storage.ts to filter spots by destination
✅ Updated routes.ts with new GET /api/destinations and dynamic destination routing
✅ Updated home.tsx to accept destination parameter from URL
✅ Updated schema.ts to include optional destination field in itinerary requests
✅ Added navigation between destinations selector and home page
✅ Backend now loads all destinations' spots on startup and filters as needed

## Development Notes
- Workflow auto-restarts on package/file changes
- Mock data loads on server startup - all destinations preloaded
- Images generated using AI and stored in `attached_assets/`
- No external API dependencies - fully self-contained
- Backend filters spots by destination in real-time
- Frontend state management via React hooks and URL parameters
- Production-ready to swap JSON with real DB/APIs

## File Structure Changes
- Frontend pages: `pages/destinations.tsx` (new), `pages/home.tsx` (updated)
- Backend: `server/storage.ts` (updated), `server/routes.ts` (updated)
- Data: Added `destinations.json`, `spots-data.json`, `multi-alerts.json`

## Future Enhancements (See TODO markers in code)
- LLM integration (OpenAI/Anthropic) for dynamic chat
- Live web scraping from Instagram, blogs, government sources
- Vector database for semantic content search
- User accounts with saved itineraries
- Real-time data for alerts and crowd scores
- Mobile app versions
- More destinations beyond India

## Testing the App
1. **Select Destination**: Home page shows regional selector → Click "Plan Trip" on any destination
2. **Generate Itinerary**: Select preferences (duration, budget, type, interests) → Generate
3. **View Plan**: See day-by-day breakdown with spots, times, costs
4. **Switch Destination**: Use back arrow to return to destination selector
5. **Chat**: Click "Ask Assistant" → Try "What's crowded right now?"
6. **Admin**: Visit /admin → Tag content as hidden gem → Regenerate itinerary to see changes
7. **Download**: Click "Download JSON" to save itinerary offline

## For Investors
This POC now demonstrates:
- Multi-destination architecture ready for scaling
- Regional organization of travel experiences
- Seamless destination switching capability
- Destination-specific alerts and recommendations
- Production-ready backend that can handle 100+ destinations

Production version would add:
- Real LLM for natural chat
- Live data scraping for all destinations
- User authentication and saved itineraries
- Real-time crowd data and alerts
- Mobile apps
- Monetization (premium features, partnerships)

See README.md for full investor pitch and demo script.
