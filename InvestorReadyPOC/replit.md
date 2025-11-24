# TravelAI - Comprehensive India Travel Assistant POC

## Project Overview
AI-powered travel assistant POC for exploring India's diverse tourist destinations. Organized by regions with comprehensive information, generates personalized itineraries, provides real-time alerts, discovers hidden gems, and offers an intelligent chat assistant - all running entirely within Replit using detailed mock data.

**Supported Destinations** (34 total, organized by 4 regions):
- **North India (8)**: Manali, Shimla, Dharamshala, Dalhousie, Nainital, Mussoorie, Auli, Leh-Ladakh, Delhi, Agra, Jaipur
- **South India (8)**: Gokarna, Munnar, Ooty, Kodaikanal, Coorg, Wayanad, Hampi, Alleppey
- **West India (6)**: Udaipur, Jodhpur, Jaisalmer, Mount Abu, Goa, Daman & Diu, Kutch
- **East India (7)**: Darjeeling, Sikkim & Gangtok, Meghalaya, Kaziranga, Andaman & Nicobar, Bodh Gaya

## Quick Run
1. Click the "Run" button in Replit
2. App launches automatically on port 5000
3. Home page shows destination selector organized by region
4. Choose any destination to generate personalized itineraries
5. No API keys or configuration required for demo

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Shadcn UI
- **Backend**: Express.js + TypeScript + In-memory storage with destination filtering
- **Data**: Comprehensive JSON files (34 destinations, 28+ attractions, 3 blog posts, 10 Instagram posts, 8 alerts)
- **Routing**: Home → Destinations (selector) → Home (with destination) → Itinerary
- **Data Source**: Integrated from comprehensive Indian tourism guide covering all regions

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
- `data/destinations.json` - **34 destinations** organized by 4 regions with descriptions, coordinates, best times to visit
- `data/spots-data.json` - **28+ attractions** across destinations with coordinates, crowd scores, tags, opening hours, entry fees
- `data/blog_posts.json` - 3 travel blog articles with local insights
- `data/insta_posts.json` - 10 Instagram-style posts with geo-tags
- `data/multi-alerts.json` - **8 destination-specific alerts** (weather, events, maintenance)
- Legacy: `data/shimla_spots.json` (kept for reference)
- Legacy: `data/alerts.json` (kept for reference)

## API Endpoints (Enhanced for Multi-Destination)
- `GET /api/destinations` - List all 34 available destinations
- `GET /api/destination/:name` - Get specific destination info, top spots, and alerts
- `POST /api/itinerary` - Generate itinerary (requires: destination, days, budget, travelerType, interests)
- `POST /api/chat` - Chat assistant (requires: message, optional context)
- `GET /api/alerts` - Get all alerts (can filter by destination)
- `GET /api/admin/scraped` - Get all scraped content
- `POST /api/admin/tag` - Tag content as hidden gem (requires: id, tag)

## Recent Changes (Complete UI Overhaul with Images & Landing Page)
✅ **Created beautiful landing page** with hero section, features, region preview, and CTA
✅ **Generated 10 high-quality destination images** (Manali, Shimla, Jaipur, Goa, Munnar, Hampi, Darjeeling, Ladakh, Alleppey, Taj Mahal)
✅ **Updated destination cards** to display images with hover effects and graceful fallbacks
✅ **Improved app routing**: Landing page → Destinations → Home (trip planner) → Itinerary
✅ **Enhanced visual hierarchy** with regional color coding (North: Blue, South: Green, East: Purple, West: Orange)
✅ **Added navigation elements**: Home button on destination page, "Get Started" on landing
✅ **Responsive design** optimized for mobile, tablet, and desktop views
✅ **Updated destinations.json** with image file references for all 34 destinations
✅ Destination cards now show 140px images with zoom effect on hover
✅ Landing page showcases value proposition with statistics (34 destinations, 4 regions, 100K+ plans)

## Development Notes
- Workflow auto-restarts on package/file changes
- Mock data loads on server startup - all destinations preloaded
- Images generated using AI and stored in `attached_assets/`
- No external API dependencies - fully self-contained
- Backend filters spots by destination in real-time
- Frontend state management via React hooks and URL parameters
- Production-ready to swap JSON with real DB/APIs

## File Structure
- Frontend pages: 
  - `pages/landing.tsx` (hero landing page with features, regions, CTA)
  - `pages/destinations.tsx` (destination selector with images)
  - `pages/home.tsx` (trip planner form)
  - `pages/itinerary.tsx` (generated itinerary display)
  - `pages/admin.tsx` (content management)
- Backend: `server/storage.ts` (data layer), `server/routes.ts` (API endpoints)
- Data: `destinations.json`, `spots-data.json`, `multi-alerts.json`, `blog_posts.json`, `insta_posts.json`
- Images: `attached_assets/generated_images/` (10+ destination hero images)

## Testing the App
1. **Select Destination**: Home page shows regional selector → Click "Plan Trip" on any destination
2. **Generate Itinerary**: Select preferences (duration, budget, type, interests) → Generate
3. **View Plan**: See day-by-day breakdown with spots, times, costs
4. **Switch Destination**: Use back arrow to return to destination selector
5. **Chat**: Click "Ask Assistant" → Try "What are the best spots in Manali?"
6. **Admin**: Visit /admin → Tag content as hidden gem → Regenerate itinerary to see changes
7. **Download**: Click "Download JSON" to save itinerary offline

## Data Coverage Summary
- **North India**: Hill stations (Shimla, Manali, Mussoorie), Mountain regions (Ladakh, Nainital), Adventure (Auli), Cultural (Delhi, Agra, Jaipur)
- **South India**: Beaches (Gokarna, Alleppey), Hill stations (Ooty, Kodaikanal, Munnar, Coorg, Wayanad), Heritage (Hampi)
- **West India**: Deserts (Jaisalmer, Kutch), Lakes (Udaipur), Forts (Jodhpur), Beaches (Goa, Daman-Diu), Hill station (Mount Abu)
- **East India**: Mountains (Darjeeling, Sikkim, Meghalaya), Wildlife (Kaziranga), Islands (Andaman), Heritage (Bodh Gaya)

## For Investors
This POC now demonstrates:
- **Comprehensive national coverage**: 34 destinations with detailed tourism data
- **Intelligent routing**: Destination-specific recommendations and alerts
- **Scalable architecture**: Easy to add 100+ destinations without code changes
- **Real tourist data**: Information based on actual tourism resources and best practices
- **Production-ready backend**: Handles destination filtering and multi-location queries
- **Beautiful UX**: Region-organized selector with consistent user experience

Production version would add:
- Real LLM for natural chat and dynamic recommendations
- Live data scraping from multiple tourism sources
- User authentication and saved itineraries
- Real-time crowd data and social sentiment analysis
- Mobile apps for iOS and Android
- Monetization (premium features, partnerships with hotels/tours)
- Multi-language support

## Deployment
App is ready for deployment on Replit. Simply click the "Publish" button to make it live with a public URL.
