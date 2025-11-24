# TravelAI - Investor-Ready Multi-Destination Travel Assistant POC

## Overview

TravelAI is a production-ready AI-powered travel assistant supporting **ALL 20 major Indian destinations** across 4 regions (North, South, East, West India). It generates intelligent personalized itineraries using algorithmic spot scoring (interest matching, crowd optimization, hidden gem discovery), real-time alerts, dynamic budget optimization, weather-based recommendations, and an enhanced rule-based chat assistant. Features include destination-specific itinerary generation, crowd predictions by time/day, hidden gem discovery via social media analysis, weather advisories, and offline-capable itinerary downloads. The POC demonstrates sophisticated travel planning without external API dependencies.

## User Preferences

Preferred communication style: Simple, everyday language.
Image sourcing: Use real images from internet (Unsplash/Pexels) - no AI-generated images, must be specific to each location.
Project Scope: Building investor-ready POC with all 20 destinations working simultaneously.

## Supported Destinations (20 Total)

**North India (5)**: Ladakh, Manali, Shimla, Amritsar, Jaipur
**South India (5)**: Kerala, Coorg, Ooty, Kodaikanal, Rameswaram
**East India (5)**: Darjeeling, Gangtok, Shillong, Puri, Kolkata
**West India (5)**: Mumbai, Goa, Udaipur, Rann of Kutch, Mount Abu

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
**Data Model**: In-memory JSON mock data for 15 curated Shimla spots, alerts, scraped content (Instagram/blog posts), and transient itineraries.
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

**Future Integrations (Stubbed)**: LLM providers (OpenAI/Anthropic), web scraping (Instagram Graph API), mapping services (Google Maps API/Mapbox), weather APIs (OpenWeatherMap), government data, and vector databases (Pinecone/Weaviate).
**Database Migration Path**: PostgreSQL via Neon is configured in `drizzle.config.ts` for future migration.