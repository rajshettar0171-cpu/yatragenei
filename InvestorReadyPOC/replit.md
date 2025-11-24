# TravelAI - Shimla Travel Assistant POC

## Project Overview
AI-powered travel assistant POC focused on Indian destinations, starting with Shimla. Generates personalized itineraries, provides real-time alerts, discovers hidden gems, and offers an intelligent chat assistant - all running entirely within Replit using mock data.

## Quick Run
1. Click the "Run" button in Replit
2. App launches automatically on port 5000
3. No API keys or configuration required for demo

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Shadcn UI
- **Backend**: Express.js + TypeScript + In-memory storage
- **Data**: JSON files in `data/` directory (15 spots, 3 blog posts, 10 Instagram posts, 4 alerts)

## Key Features Implemented
✅ Landing page with trip planning form (days, budget, traveler type, interests)
✅ Smart itinerary generator using Haversine distance & interest matching
✅ Day-by-day plans with time/cost/travel mode estimates
✅ Rule-based chat assistant with context-aware responses
✅ Real-time alerts panel (road closures, weather, events)
✅ Admin dashboard to tag hidden gems
✅ JSON download for offline itineraries
✅ Beautiful, investor-ready UI with Shimla imagery

## Data Files
- `data/shimla_spots.json` - 15 curated attractions with coordinates, crowd scores, tags
- `data/blog_posts.json` - 3 travel blog articles with local insights
- `data/insta_posts.json` - 10 Instagram-style posts with geo-tags
- `data/alerts.json` - 4 active alerts (road, weather, events, maintenance)

## API Endpoints
- `GET /api/destination/shimla` - Destination overview
- `POST /api/itinerary` - Generate itinerary (requires: days, budget, travelerType, interests)
- `POST /api/chat` - Chat assistant (requires: message, optional context)
- `GET /api/alerts` - Get active alerts
- `GET /api/admin/scraped` - Get all scraped content
- `POST /api/admin/tag` - Tag content as hidden gem (requires: id, tag)

## Development Notes
- Workflow auto-restarts on package/file changes
- Mock data loads on server startup
- Images generated using AI and stored in `attached_assets/`
- No external API dependencies - fully self-contained
- Production-ready to swap JSON with real DB/APIs

## Future Enhancements (See TODO markers in code)
- LLM integration (OpenAI/Anthropic) for dynamic chat
- Live web scraping from Instagram, blogs, government sources
- Vector database for semantic content search
- User accounts with saved itineraries
- Expand to multiple Indian destinations
- Mobile app versions

## Testing the App
1. **Generate Itinerary**: Home page → Select preferences → Generate
2. **View Plan**: See day-by-day breakdown with spots, times, costs
3. **Chat**: Click "Ask Assistant" → Try "Is Kufri crowded today?"
4. **Admin**: Visit /admin → Tag content as hidden gem → Regenerate itinerary to see changes
5. **Download**: Click "Download JSON" to save itinerary offline

## For Investors
This POC demonstrates the core technology stack and user experience. Production version would add:
- Real LLM for natural chat
- Live data scraping
- User authentication
- Multiple destinations
- Mobile apps

See README.md for full investor pitch and demo script.
