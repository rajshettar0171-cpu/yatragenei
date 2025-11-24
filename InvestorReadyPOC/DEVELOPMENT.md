# TravelAI Development Guide

## Project Structure

```
InvestorReadyPOC/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (landing, destinations, home, itinerary, trip-details, etc.)
│   │   ├── components/    # Reusable UI components (chat-modal, alerts-panel, ui/ primitives)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── index.css      # Global styles with TailwindCSS
│   └── public/            # Static assets
├── server/                 # Express backend
│   ├── services/          # Business logic
│   │   ├── itinerary-generator.ts    # Smart itinerary algorithm
│   │   ├── chat-assistant.ts         # NLP chat logic
│   │   ├── destination-guide.ts      # Travel guides
│   │   ├── community-reviews.ts      # Review system
│   │   ├── packing-list.ts           # Packing recommendations
│   │   ├── weather-alerts.ts         # Weather service
│   │   └── cost-calculator.ts        # Budget estimation
│   ├── routes.ts          # API endpoints (15+ routes)
│   ├── storage.ts         # Data layer with IStorage interface
│   ├── app.ts             # Express setup
│   └── index-dev.ts       # Development entry
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Zod schemas and TypeScript types
├── data/                  # JSON data files
│   ├── destinations.json  # 34 destinations metadata
│   ├── spots-data.json    # 28+ attractions with details
│   ├── multi-alerts.json  # Destination alerts
│   ├── blog_posts.json    # Travel blog content
│   └── insta_posts.json   # Social media posts
└── dist/                  # Production build output
    ├── index.js           # Backend bundle
    └── public/            # Frontend bundle
```

## Running the Application

### Development
```bash
npm run dev
```
- Starts Vite dev server (port 5000)
- Express server with hot reload
- All destinations pre-loaded in memory

### Production Build
```bash
npm run build
```
- Builds frontend: `dist/public/`
- Bundles backend: `dist/index.js`
- Ready to deploy on Replit

### Local Testing
```bash
npm start
# After running build
```

## Core Algorithms

### 1. Itinerary Generation Algorithm
**Location**: `server/services/itinerary-generator.ts`

**Process**:
1. **Scoring** - Each spot gets scored based on:
   - Interest matching (0-100 points)
   - Crowd level inversion (0-50 points)
   - Hidden gem bonus (50 points)

2. **Selection** - Top-scored spots chosen based on:
   - Traveler type (solo: 5, couple: 4, family: 3 spots/day)
   - Total days requested

3. **Scheduling** - Spots organized by:
   - Proximity (Haversine distance)
   - Opening hours
   - Travel time estimation
   - Daily time accumulation (9 AM start)

4. **Costing** - Each spot priced based on:
   - Base entry fee
   - Budget tier (low/medium/high)
   - Meal/shopping allowance

### 2. Chat Assistant NLP
**Location**: `server/services/chat-assistant.ts`

**Intent Matching**:
- Budget queries → Cost info + savings tips
- Crowd queries → Crowd prediction + alternatives
- Weather queries → 3-day forecast + safety tips
- Hidden gems → Discovery recommendations
- General → Contextual responses

### 3. Smart Services

#### Packing Lists (`packing-list.ts`)
- Season-based items (spring/summer/fall/winter)
- Weather-specific adjustments
- Travel type considerations
- Printable checklist generation

#### Weather Alerts (`weather-alerts.ts`)
- 3-day forecast for destinations
- Safety recommendations
- Activity suitability by weather
- Real-time alerts mock

#### Cost Calculator (`cost-calculator.ts`)
- Seasonal multipliers
- Budget tier breakdown
- Daily vs. total estimates
- Savings tips by category

#### Community Reviews (`community-reviews.ts`)
- 5-star rating system
- Crowd prediction metrics
- Live update simulation
- Trend analysis (increasing/decreasing/stable)

## API Endpoints Reference

### Destinations
- `GET /api/destinations` - List all 34 destinations
- `GET /api/destination/:name` - Destination details

### Itinerary
- `POST /api/itinerary` - Generate multi-day itinerary
  ```json
  {
    "destination": "manali",
    "days": 3,
    "budget": "medium",
    "travelerType": "solo",
    "interests": ["adventure", "photography", "nature"]
  }
  ```

### Smart Services
- `GET /api/reviews/:spot` - Community reviews
- `GET /api/weather-alerts/:destination` - Weather forecasts
- `GET /api/packing-list/:destination/:season/:days` - Packing guide
- `GET /api/cost-estimate/:destination/:days/:budget/:season` - Trip costs
- `GET /api/travel-guide/:destination` - Travel recommendations

### Chat & Alerts
- `POST /api/chat` - Chat assistant
- `GET /api/alerts` - All alerts

### Admin
- `GET /api/admin/scraped` - Content management
- `POST /api/admin/tag` - Tag hidden gems

## Data Model

### Destination
```typescript
{
  id: string;
  name: string;
  region: "North" | "South" | "East" | "West";
  description: string;
  state: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  highlights: string[];
  bestTime: string;
}
```

### Spot (Attraction)
```typescript
{
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  bestTime: string;
  entryFee: string;
  openingHours: string;
  crowdScore: number; // 1-10
  tags: string[];
  instagramCaptions: string[];
  imageUrl: string;
  isHiddenGem: 0 | 1;
}
```

### Itinerary Response
```typescript
{
  id: string;
  days: number;
  budget: "low" | "medium" | "high";
  travelerType: "solo" | "couple" | "family";
  interests: string[];
  plan: ItineraryDay[];
  totalCost: string;
  totalTime: string;
  createdAt: string;
}
```

### Itinerary Day
```typescript
{
  day: number;
  date: string;
  spots: ItinerarySpot[];
  totalCost: string;
  totalTime: string;
}
```

## Adding New Destinations

1. **Add to `data/destinations.json`**:
```json
{
  "id": "new-destination",
  "name": "New Destination",
  "region": "North|South|East|West",
  "description": "...",
  "state": "State Name",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "imageUrl": "https://...",
  "highlights": ["Attraction 1", "Attraction 2"],
  "bestTime": "October-March"
}
```

2. **Add spots to `data/spots-data.json`**:
```json
{
  "new-destination": [
    {
      "id": "spot-unique-id",
      "name": "Attraction Name",
      "description": "...",
      "lat": 28.6139,
      "lng": 77.2090,
      "bestTime": "...",
      "entryFee": "₹100",
      "openingHours": "9:00 AM - 6:00 PM",
      "crowdScore": 7,
      "tags": ["adventure", "photography"],
      "instagramCaptions": ["Caption 1", "Caption 2"],
      "imageUrl": "https://...",
      "isHiddenGem": 0
    }
  ]
}
```

3. **Restart the workflow** - Data loads on startup

## Key Technologies

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn UI, Wouter, TanStack Query
- **Backend**: Express.js, TypeScript, ESM modules, Zod validation
- **Data**: JSON files with in-memory caching (ready for PostgreSQL migration)
- **Styling**: HSL color system, mobile-first responsive design
- **Images**: Unsplash/Pexels CDN for real location photos

## Environment Variables

**Development**: Configured automatically via Replit
**Production**: No external API keys needed for POC

Future integrations will use Replit's secret management.

## Performance Metrics

- API response time: <10ms (in-memory data)
- Frontend bundle: 408KB (124KB gzipped)
- Backend bundle: 75.4KB
- No cold starts (data pre-loaded)
- Supports 34 destinations + 28+ attractions instantly

## Testing Checklist

- [ ] Multi-day itinerary (2+ days generate unique days)
- [ ] Destination filtering (different destinations load correct spots)
- [ ] Chat responses (contextual and helpful)
- [ ] Community features (reviews, ratings, weather, packing, costs)
- [ ] Admin tagging (hidden gems reflected in future generations)
- [ ] Regional organization (correct destination grouping)
- [ ] Error handling (proper error messages)
- [ ] Mobile responsiveness (tested on mobile browsers)

## Deployment

Ready to deploy on Replit:
1. Click "Publish" button in Replit UI
2. App served on public URL
3. No database configuration needed
4. All data self-contained

## Future Enhancements

1. **Real LLM Integration** - OpenAI/Claude for natural chat
2. **Live Data** - Instagram Graph API, OpenWeatherMap API, Google Maps API
3. **User System** - Authentication, saved itineraries, preferences
4. **Social Features** - User reviews, ratings, community posts
5. **Mobile Apps** - React Native for iOS/Android
6. **Monetization** - Premium features, hotel/tour partnerships
7. **Multi-Language** - i18n support
8. **Analytics** - User behavior tracking, popular routes

## Troubleshooting

### Build Issues
- Clear `dist/` folder
- Run `npm install` to ensure dependencies
- Check Node version (v18+)

### Data Not Loading
- Verify JSON syntax in `data/` files
- Check destination IDs match exactly (case-sensitive)
- Restart workflow

### Frontend Not Updating
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors
- Verify Vite dev server is running

### API Errors
- Check server logs in workflow console
- Verify request payload matches schema
- Test endpoints with curl first

## Contributing Guidelines

1. Follow existing code style and patterns
2. Keep components focused and modular
3. Add TypeScript types for new functions
4. Test endpoint locally before committing
5. Update documentation for new features
6. Keep data files clean and validated
