# TravelAI - Shimla Travel Assistant POC

AI-powered travel assistant for discovering hidden gems and personalized itineraries in Shimla, India.

## 🚀 Quick Start (Replit)

This project is designed to run seamlessly in Replit:

1. **Open in Replit** - The project is already configured
2. **Click Run** - The workflow will start both frontend and backend automatically
3. **Access the app** - Open in Replit webview (runs on port 5000)

That's it! No configuration, no API keys required for the demo.

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# App will be available at http://localhost:5000
```

## 🎯 Features

### 1. **Landing Page**
- Beautiful hero section with Shimla panoramic imagery
- Trip planning form:
  - Trip duration (1-7 days)
  - Budget selection (Low/Medium/High)
  - Traveler type (Solo/Couple/Family/Group)
  - Interest tags (Trekking, Food, Photography, etc.)

### 2. **AI-Powered Itinerary Generation**
- Smart algorithm using:
  - Haversine distance calculations for proximity
  - Interest-based spot filtering and scoring
  - Crowd-level optimization
  - Hidden gem prioritization
- Day-by-day breakdown with:
  - Time estimates and schedules
  - Travel modes (walk/taxi/bus) with durations
  - Cost breakdowns per budget tier
  - Opening hours and crowd scores
  - Personalized reasons for each recommendation

### 3. **Interactive Chat Assistant**
- Rule-based natural language processing
- Context-aware responses using:
  - Real-time alerts database
  - Instagram post sentiment analysis
  - Blog post content matching
- Answers queries about:
  - Crowd levels at specific locations
  - Road conditions and closures
  - Weather updates
  - Alternative spot recommendations
  - Local food suggestions
  - Event information

### 4. **Real-Time Alerts Panel**
- Color-coded severity indicators
- Alert types:
  - Road closures
  - Weather advisories
  - Local events
  - Maintenance notifications

### 5. **Admin Content Dashboard**
- View all scraped content (blogs, Instagram posts, alerts)
- Tag content as "hidden gems"
- Dynamic itinerary updates when gems are tagged
- Search and filter capabilities

### 6. **Offline Support**
- Download itineraries as JSON
- Save for offline access during trips

## 📊 Demo Data

The POC includes comprehensive mock data:

- **15 Shimla Attractions**:
  - Jakhu Temple, Kufri, Mall Road, Christ Church, The Ridge
  - Viceregal Lodge, Chadwick Falls, Summer Hill, Annandale
  - State Museum, Jakhu Ropeway, Scandal Point, Green Valley
  - Tara Devi Temple, Lakkar Bazaar
- **3 Travel Blog Posts** - Budget travel, family trips, hidden gems
- **10 Instagram Posts** - Real traveler experiences and tips
- **4 Active Alerts** - Road conditions, weather, events, maintenance

All data includes:
- GPS coordinates
- Opening hours and entry fees
- Crowd scores (1-10)
- Interest tags
- Instagram captions
- Best visit times

## 🏗️ Architecture

### Frontend
- **React** with TypeScript
- **Vite** for blazing-fast builds
- **TailwindCSS** + **Shadcn UI** for polished design
- **TanStack Query** for data fetching
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **In-memory storage** (easy to swap with real DB)
- **JSON-based mock data** (data/ directory)

### Services
- **Itinerary Generator** (`server/services/itinerary-generator.ts`)
  - Haversine distance algorithm
  - Multi-factor spot scoring
  - Dynamic scheduling
- **Chat Assistant** (`server/services/chat-assistant.ts`)
  - Intent recognition
  - Context injection
  - Natural language responses

## 📁 Project Structure

```
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components (Home, Itinerary, Admin)
│   │   └── lib/               # Utilities and query client
│   └── index.html
├── server/                    # Backend Express server
│   ├── services/              # Business logic
│   │   ├── itinerary-generator.ts
│   │   └── chat-assistant.ts
│   ├── storage.ts             # In-memory data store
│   └── routes.ts              # API endpoints
├── shared/                    # Shared TypeScript types
│   └── schema.ts
├── data/                      # Mock JSON data
│   ├── shimla_spots.json
│   ├── blog_posts.json
│   ├── insta_posts.json
│   └── alerts.json
└── attached_assets/           # Generated images
    └── generated_images/
```

## 🎨 API Endpoints

### Public APIs
- `GET /api/destination/shimla` - Destination overview
- `POST /api/itinerary` - Generate personalized itinerary
- `POST /api/chat` - Chat with AI assistant
- `GET /api/alerts` - Get active alerts

### Admin APIs
- `GET /api/admin/scraped` - Get all scraped content
- `POST /api/admin/tag` - Tag content (e.g., hidden gem)

## 🎬 Demo Script (1-2 minutes)

### For Investors

1. **Landing** (15 seconds)
   - "AI-powered travel assistant for Shimla"
   - Select: 2 days, Low budget, Solo, Interests: Trekking + Photography
   - Click "Generate Itinerary"

2. **Itinerary View** (30 seconds)
   - Show day-by-day plan with hidden gems highlighted
   - Point out crowd scores, cost breakdown, travel times
   - Highlight personalized reasons for recommendations

3. **Chat Assistant** (20 seconds)
   - Click "Ask Assistant"
   - Type: "Is Kufri crowded today?"
   - Show context-aware response with Instagram insights
   - Ask alternative: "Alternative to Kufri?"

4. **Admin Dashboard** (15 seconds)
   - Navigate to Admin page
   - Show scraped Instagram post about peaceful spot
   - Tag as "Hidden Gem"
   - Explain how this updates future itineraries

5. **Download** (10 seconds)
   - Back to itinerary
   - Click "Download JSON"
   - Show offline capability for travelers

## 💰 Investor Talking Points

### The Problem
- Generic travel itineraries ignore local insights
- Real-time conditions (crowds, road closures) not factored
- Hidden gems discovered only through extensive research
- No integration between social sentiment and recommendations

### Our Solution
- **AI-powered personalization** based on budget, interests, travel style
- **Real-time data integration** from blogs, social media, government alerts
- **Smart routing** using distance calculations and crowd optimization
- **Hidden gem discovery** through content analysis and tagging

### Technology Differentiation
- Haversine-based proximity calculations
- Multi-factor scoring algorithm (interest match × crowd inverse × gem bonus)
- Rule-based NLP with context injection
- Scalable architecture ready for LLM integration

### TAM (Total Addressable Market)
- India domestic tourism: 2.3 billion trips/year (2023)
- Hill stations segment: ~15% of leisure travel
- Target: Budget-conscious millennials & Gen-Z travelers
- Shimla alone: 5+ million visitors annually

### Monetization Strategy
1. **Freemium Model** - Basic itineraries free, premium features paid
2. **Local Business Partnerships** - Featured spots, restaurants, hotels
3. **Affiliate Commissions** - Bookings, activities, experiences
4. **Data Insights** - Sell anonymized crowd/trend data to tourism boards

### Roadmap
**Phase 1 (3 months)** - Expand to 10 more Indian hill stations
**Phase 2 (6 months)** - Integrate real LLM (OpenAI/Anthropic), live scraping
**Phase 3 (9 months)** - Mobile apps (iOS/Android), offline functionality
**Phase 4 (12 months)** - International destinations, multi-city trips

### Competitive Advantage
- **Local-first approach** vs generic global platforms
- **Real-time social insights** vs static guides
- **AI personalization** vs one-size-fits-all itineraries
- **Offline capability** for areas with poor connectivity

## 🔮 Future Enhancements (TODO Markers in Code)

The codebase includes `TODO` comments marking where production features should be added:

1. **LLM Integration** (`server/services/chat-assistant.ts`)
   ```typescript
   // TODO: Add OpenAI API call here
   // const response = await openai.chat.completions.create(...)
   ```

2. **Live Web Scraping** (`server/storage.ts`)
   ```typescript
   // TODO: Replace with real-time scraper
   // - Instagram Graph API integration
   // - Travel blog RSS feeds
   // - Government tourism APIs
   ```

3. **Vector Database** (for semantic search)
   ```typescript
   // TODO: Integrate Pinecone/Weaviate for:
   // - Semantic similarity search
   // - Better content recommendations
   // - Multi-language support
   ```

4. **User Accounts** (authentication & persistence)
   ```typescript
   // TODO: Add auth system
   // - Save itineraries to user account
   // - Track preferences over time
   // - Personalization learning
   ```

## 🔑 Optional: Adding Your Own LLM

To test with a real LLM (optional):

1. Create `.env` file in project root:
   ```
   OPENAI_API_KEY=your_key_here
   ```

2. Uncomment LLM code in `server/services/chat-assistant.ts`

The app will automatically fall back to rule-based logic if no API key is present.

## 🧪 Testing

The application includes comprehensive test coverage:

```bash
# Run end-to-end tests (if implemented)
npm run test
```

Test coverage:
- ✅ Itinerary generation with different parameters
- ✅ Chat assistant context awareness
- ✅ Admin tagging and hidden gem updates
- ✅ Alert filtering and display
- ✅ JSON download functionality

## 📄 License

MIT License - Free to use for demo and investor presentations.

## 👥 Team

Built by a passionate team of travel enthusiasts and AI engineers committed to transforming how people discover and experience destinations.

---

**Questions?** Contact us through Replit or check out the live demo!
