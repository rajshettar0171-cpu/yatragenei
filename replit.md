# TravelAI - Shimla Travel Assistant POC

## Overview

TravelAI is an AI-powered travel assistant proof-of-concept focused on personalized itinerary planning for Indian destinations, starting with Shimla. The application generates intelligent, personalized travel itineraries using algorithmic spot scoring (interest matching, crowd optimization, hidden gem discovery), real-time alerts, and a rule-based chat assistant. Built as an investor-ready demo, it showcases the core value proposition: discovering hidden gems through social media analysis, optimizing routes using Haversine distance calculations, and providing context-aware travel recommendations—all without requiring external API dependencies in the POC phase.

## User Preferences

Preferred communication style: Simple, everyday language.
Image sourcing: Use real images from internet (Unsplash/Pexels) - no AI-generated images, must be specific to each location.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 + TypeScript + Vite, with Wouter for client-side routing and TanStack Query for server state management.

**UI Framework**: Shadcn UI component library built on Radix UI primitives, styled with TailwindCSS using a custom design system inspired by Airbnb (visual appeal) and Linear (data clarity). Typography uses Inter for UI text and Space Grotesk for display headlines.

**State Management**: Client state handled through React hooks; server state managed via TanStack Query with aggressive caching (staleTime: Infinity) to minimize refetches. No global state management library required due to simple data flow.

**Component Structure**:
- **Pages**: Home (landing/trip planner), Itinerary (generated plans), Admin (content tagging), NotFound
- **Shared Components**: AlertsPanel (real-time alerts), ChatModal (travel assistant), UI primitives (40+ Shadcn components)
- **Data Flow**: URL parameters pass trip preferences from Home → Itinerary; mutation-based API calls for itinerary generation and chat

**Design Rationale**: Chose Vite over Create React App for faster hot module replacement during development. Wouter over React Router for smaller bundle size (1.7KB vs 10KB). TanStack Query eliminates manual loading/error state management and provides built-in caching.

### Backend Architecture

**Technology Stack**: Express.js + TypeScript with ESM modules, running on Node.js.

**Data Storage**: In-memory storage implemented via `MemStorage` class (Map-based) for POC simplicity. Designed with interface abstraction (`IStorage`) to enable seamless migration to PostgreSQL/Drizzle ORM in production without changing business logic.

**API Design**: RESTful endpoints with Zod schema validation:
- `GET /api/destination/shimla` - Destination overview with top spots and alerts
- `POST /api/itinerary` - Generate personalized itinerary (validates: days, budget, travelerType, interests)
- `POST /api/chat` - Chat assistant (validates: message, optional context)
- `GET /api/alerts` - Active alerts (road closures, weather, events)
- `GET /api/admin/scraped` - Content management for hidden gem tagging
- `POST /api/admin/tag` - Tag content as hidden gem

**Core Algorithms**:

1. **Itinerary Generation** (`server/services/itinerary-generator.ts`):
   - **Spot Scoring**: `Score = (InterestMatch × 25) + ((10 - CrowdScore) × 5) + (HiddenGemBonus × 50)`
   - **Distance Calculation**: Haversine formula for accurate GPS-based proximity
   - **Route Optimization**: Sorts spots by opening hours + proximity to minimize backtracking
   - **Travel Mode Selection**: Walk (<1km), Taxi (1-5km), Bus (>5km) with time estimates
   - **Cost Tiering**: Budget-dependent pricing (Low: ₹500-1000/day, Medium: ₹1000-2000, High: ₹2000-4000)

2. **Chat Assistant** (`server/services/chat-assistant.ts`):
   - **Rule-based NLP**: Keyword matching for intents (crowd queries, road conditions, alternatives)
   - **Context-aware**: Searches alerts + Instagram posts + spot data based on query
   - **Fallback Responses**: Suggests peaceful spots if no specific match found
   - **LLM-ready**: Structured to accept OpenAI/Anthropic integration via stub functions

**Data Model** (Drizzle schema defined but using JSON mock data):
- **Spots**: 15 curated Shimla attractions with coordinates, crowd scores, tags, Instagram captions
- **Alerts**: 4 active alerts (road closure, weather, event, maintenance)
- **Scraped Content**: 10 Instagram posts + 3 blog posts with geo-tags for hidden gem discovery
- **Itineraries**: Generated plans with day-by-day breakdown stored transiently

**Development vs. Production**:
- **Dev Mode** (`server/index-dev.ts`): Vite middleware integration for HMR, auto-restart on file changes
- **Prod Mode** (`server/index-prod.ts`): Serves static assets from `dist/public`, single-process deployment
- **Build Process**: Vite bundles frontend, esbuild bundles backend into ESM module

**Rationale**: In-memory storage avoids database provisioning complexity for POC while maintaining production-ready interface contracts. Express chosen over Next.js API routes to demonstrate full-stack separation and easier scaling to microservices. Zod validation prevents malformed requests from reaching business logic.

### Design System & UI Patterns

**Color System**: HSL-based with CSS custom properties for light mode, using neutral grays (210° hue) for backgrounds, blue primary (210° 85% 52%), and accent colors for alerts/badges.

**Spacing Scale**: Tailwind's default scale (units of 4px) with consistent component padding (p-6 for cards, p-8 for sections).

**Responsive Strategy**: Mobile-first with breakpoints at 768px (tablet) and 1024px (desktop). Hero section uses full viewport height (80vh) with backdrop blur on overlays.

**Interaction Patterns**:
- **Loading States**: Skeleton loaders for all async data fetches
- **Error Handling**: Toast notifications for mutations, inline error messages for validation
- **Accessibility**: ARIA labels on all interactive elements, keyboard navigation support via Radix primitives

### Deployment Architecture

**Replit-Specific**:
- **Workflow**: `.replit` file auto-starts both frontend (Vite dev server) and backend (Express) via workflow
- **Port Configuration**: App serves on port 5000, exposed via Replit webview
- **Hot Reload**: Workflow watches `package.json` and TypeScript files for auto-restart
- **Environment**: No API keys required for demo; `.env` optional for future LLM integration

**Build Output**:
- Frontend: `dist/public` (static HTML, CSS, JS bundles)
- Backend: `dist/index.js` (single ESM bundle with external packages)
- Assets: All images sourced from internet (Unsplash/Pexels CDN, no local assets)

**Image Strategy**: 
- All 34 destination images use direct Unsplash CDN URLs (CC0 licensed, no attribution required)
- Image sources curated from provided Pexels & Unsplash collections mapped to each destination
- Each destination has a specific, location-relevant image (e.g., Manali snow peaks, Shimla colonial architecture, Goa beaches, Jaisalmer dunes, Taj Mahal, Hawa Mahal)
- All attraction images use location-specific URLs for rich visual experience
- Images load directly from CDN with quality parameters (w=800&q=80 for destinations, w=600&q=80 for attractions)
- Images embedded directly into React components (destinations.tsx, itinerary.tsx, home.tsx)
- No local image generation or storage required - all from Unsplash/Pexels CDN

**Scalability Considerations**: Monorepo structure allows future extraction of backend into separate service. Storage interface enables database swap without refactoring. API design follows RESTful conventions for easy client generation (e.g., OpenAPI).

## External Dependencies

### Core Runtime Dependencies

**Frontend**:
- **React Ecosystem**: `react@18`, `react-dom` (UI rendering), `wouter` (routing, 1.7KB alternative to React Router)
- **Data Fetching**: `@tanstack/react-query@5` (server state management, caching, mutations)
- **Forms**: `react-hook-form` (performant forms), `@hookform/resolvers` (Zod integration)
- **UI Framework**: Shadcn UI (40+ components built on Radix UI primitives: dialogs, dropdowns, tooltips, etc.)
- **Styling**: `tailwindcss`, `tailwind-merge`, `clsx` (conditional classes), `class-variance-authority` (component variants)
- **Icons**: `lucide-react` (tree-shakeable icon library)
- **Utilities**: `date-fns` (date manipulation), `cmdk` (command palette), `embla-carousel-react` (carousels)

**Backend**:
- **Server**: `express@4` (HTTP server), `tsx` (TypeScript execution in dev mode), `esbuild` (production bundling)
- **Validation**: `zod` (runtime type validation), `drizzle-zod` (schema-to-Zod converter)
- **Database ORM** (prepared for future): `drizzle-orm@0.39`, `@neondatabase/serverless` (Postgres driver)
- **Utilities**: `nanoid` (ID generation), `connect-pg-simple` (session store, unused in POC)

**Development Tools**:
- **Build Tools**: `vite@5`, `@vitejs/plugin-react` (JSX transformation, HMR)
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`
- **TypeScript**: `typescript@5`, type definitions for React and Node
- **Database Tooling**: `drizzle-kit` (schema migrations, push commands)

### Third-Party Services (CDN Only for Images)

**Current State**: Fully self-contained with JSON mock data. Uses Unsplash/Pexels CDN for high-quality destination and attraction images (CC0 licensed). No other external API calls, no authentication, no payment processing.

**Image Sources**:
- **Unsplash** (https://unsplash.com): 28+ high-quality travel photos with quality parameters
- **Pexels** (https://www.pexels.com): Supplementary images for specific destinations
- **License**: Creative Commons Zero (CC0) - free for commercial use, no attribution required
- **URL Format**: `https://images.unsplash.com/photo-{id}?w={width}&q={quality}` for responsive loading

**Future Integrations** (noted in code as TODO/stub functions):
- **LLM Providers**: OpenAI GPT-4 or Anthropic Claude for dynamic chat responses (stub: `generate_itinerary_with_llm()`)
- **Web Scraping**: Instagram Graph API, travel blog RSS feeds for real-time content discovery
- **Mapping**: Google Maps API or Mapbox for route visualization and distance validation
- **Weather**: OpenWeatherMap API for real-time forecasts
- **Government Data**: Ministry of Tourism APIs for official alerts and crowd data
- **Vector Database**: Pinecone or Weaviate for semantic search of scraped content

**Database Migration Path**: 
- PostgreSQL via Neon (serverless Postgres) already configured in `drizzle.config.ts`
- Schema defined in `shared/schema.ts` with Drizzle ORM tables
- Migration command ready: `npm run db:push` (currently fails without `DATABASE_URL`)

**Rationale**: POC avoids external dependencies to ensure instant demo-ability in Replit without API key management. Production-ready stubs allow rapid integration when transitioning from POC to MVP.