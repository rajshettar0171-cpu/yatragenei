# TravelAI - Shimla Travel Assistant POC

## Overview

TravelAI is an AI-powered travel assistant proof-of-concept for personalized itinerary planning, starting with Indian destinations like Shimla. It generates intelligent itineraries using algorithmic spot scoring (interest matching, crowd optimization, hidden gem discovery), real-time alerts, and a rule-based chat assistant. The project aims to showcase discovering hidden gems through social media analysis, optimizing routes with Haversine distance, and providing context-aware travel recommendations without external API dependencies in its POC phase. Its core value proposition lies in personalized discovery and optimized planning.

## User Preferences

Preferred communication style: Simple, everyday language.
Image sourcing: Use real images from internet (Unsplash/Pexels) - no AI-generated images, must be specific to each location.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 + TypeScript + Vite, Wouter for routing, TanStack Query for server state management.
**UI Framework**: Shadcn UI built on Radix UI primitives, styled with TailwindCSS (Airbnb/Linear inspired design system). Typography uses Inter and Space Grotesk.
**State Management**: React hooks for client state; TanStack Query with aggressive caching for server state.
**Component Structure**: Pages (Home, Itinerary, Admin, NotFound), Shared Components (AlertsPanel, ChatModal, UI primitives). Data flow via URL parameters and mutation-based API calls.
**Design Rationale**: Vite for faster HMR, Wouter for smaller bundle, TanStack Query for simplified data fetching.

### Backend Architecture

**Technology Stack**: Express.js + TypeScript with ESM modules on Node.js.
**Data Storage**: In-memory `MemStorage` (Map-based) with an `IStorage` interface for future PostgreSQL/Drizzle ORM migration.
**API Design**: RESTful endpoints with Zod schema validation. Includes core endpoints for destinations, itinerary generation, chat, and alerts, plus AI intelligence endpoints for budget, crowd prediction, weather advice, hidden gems, and personalized recommendations. Admin endpoints for content management also exist.
**Core Algorithms**:
1.  **Itinerary Generation**: Spot scoring based on interest, crowd, and hidden gem bonuses. Haversine formula for distance, route optimization by opening hours and proximity, intelligent travel mode selection, and cost tiering.
2.  **Chat Assistant**: Enhanced rule-based NLP for intent matching (budget, crowd, weather, hidden gems, alternatives). Provides intelligent responses with savings tips, crowd predictions, weather advisories, and hidden gem discovery. Designed to be LLM-ready.
**Data Model**: In-memory JSON mock data for 34 Indian destination spots with alerts, scraped content, itineraries, and transient data. Expandable storage interface for PostgreSQL migration.
**Community & Real-Time**: User reviews with 1-5 star ratings, real-time crowd predictions, live updates with trend analysis (increasing/decreasing/stable).
**Smart Features**: Weather alerts with 3-day forecasts and safety recommendations. Personalized packing lists by season/weather with categorized checklists. Dynamic trip cost calculator with seasonal multipliers and budget tiers (low/medium/high). All features use mock data but designed for real API integration.
**Development vs. Production**: Dev mode with Vite middleware and auto-restart; Prod mode serves static assets.
**Design System & UI Patterns**: HSL-based color system with CSS custom properties, Tailwind's spacing scale, mobile-first responsive strategy. Interaction patterns include skeleton loaders, toast notifications for errors, and ARIA-compliant accessibility.
**Image Strategy**: All images sourced directly from Unsplash/Pexels CDN, location-specific and CC0 licensed.

### Deployment Architecture

**Replit-Specific**: `.replit` auto-starts frontend (Vite) and backend (Express). App serves on port 5000. Workflow watches `package.json` and TS files for auto-restart. No API keys needed for POC.
**Build Output**: Frontend in `dist/public`, backend as single ESM bundle in `dist/index.js`.
**Scalability Considerations**: Monorepo for service extraction, storage interface for database swaps, RESTful API design.

## External Dependencies

### Core Runtime Dependencies

**Frontend**: `react`, `react-dom`, `wouter`, `@tanstack/react-query`, `react-hook-form`, `shadcn/ui` components (Radix UI), `tailwindcss`, `lucide-react`, `date-fns`, `cmdk`, `embla-carousel-react`.
**Backend**: `express`, `tsx`, `esbuild`, `zod`, `drizzle-zod`, `nanoid`. (Drizzle ORM and Neon database drivers are prepared for future use but not active in POC).
**Development Tools**: `vite`, `@vitejs/plugin-react`, Replit-specific Vite plugins, `typescript`, `drizzle-kit`.

### Third-Party Services

**Current State**: Fully self-contained with JSON mock data. Uses **Unsplash** (https://unsplash.com) and **Pexels** (https://www.pexels.com) CDNs for CC0 licensed, high-quality destination and attraction images. No other external APIs are integrated.

**Currently Implemented Services**:
- **Community Reviews** (`services/community-reviews.ts`) - User ratings, crowd metrics, live updates
- **Packing Lists** (`services/packing-list.ts`) - Season/weather-based personalized packing
- **Weather Alerts** (`services/weather-alerts.ts`) - 3-day forecasts, safety recommendations
- **Cost Calculator** (`services/cost-calculator.ts`) - Budget estimation with seasonal pricing

**New Frontend Pages**:
- **Trip Details** (`pages/trip-details.tsx`) - Tabbed interface (Reviews, Weather, Packing, Costs)
- **Travel Planner Enhanced** - Added "Trip Details" button for quick access

**Future Integrations (Stubbed)**: LLM providers (OpenAI/Anthropic), web scraping (Instagram Graph API), mapping services (Google Maps API/Mapbox), real weather APIs (OpenWeatherMap), government data, and vector databases (Pinecone/Weaviate). Real-time IoT crowd sensors for attractions.
**Database Migration Path**: PostgreSQL via Neon is configured in `drizzle.config.ts` for future migration. Storage interface supports seamless swap from in-memory to Drizzle ORM.

## Recent Changes (November 24, 2025)

**Smart Travel Planning Feature** - Added comprehensive travel guide with seasonal recommendations, best visit times, hidden gems discovery, and smart tips for all 34 destinations.

**4 New Community-Focused Services**:
1. **Community Reviews & Crowd Updates** - 5-star reviews with real-time crowd predictions, helpful metrics
2. **Personalized Packing Lists** - Season/weather-specific items, checklists, smart packing tips
3. **Weather Integration** - 3-day forecasts, safety alerts, activity recommendations
4. **Smart Cost Calculator** - Dynamic pricing by season/budget tier, daily/total estimates, savings tips

**API Endpoints** (4 new):
- `GET /api/reviews/:spot` - Community reviews and crowd data
- `GET /api/weather-alerts/:destination` - Weather intelligence
- `GET /api/packing-list/:destination/:season/:days` - Personalized packing
- `GET /api/cost-estimate/:destination/:days/:budget/:season` - Trip costs