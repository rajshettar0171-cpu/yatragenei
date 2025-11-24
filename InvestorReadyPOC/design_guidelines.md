# Design Guidelines: AI Travel Assistant - Shimla POC

## Design Approach
**Reference-Based: Travel + Productivity Hybrid**
- Primary inspiration: Airbnb (travel, visual appeal) + Linear (data clarity, modern typography)
- Travel industry visual standards with productivity tool precision
- Investor-ready polish with wanderlust-inducing aesthetics

## Typography System
**Font Stack:**
- Primary: Inter (Google Fonts) - UI text, forms, data
- Display: Space Grotesk (Google Fonts) - headlines, hero text

**Hierarchy:**
- Hero headlines: text-5xl/6xl, font-bold, tracking-tight
- Section titles: text-3xl/4xl, font-semibold
- Spot names/cards: text-xl, font-semibold
- Body text: text-base/lg, font-normal, leading-relaxed
- Metadata (times/prices): text-sm, font-medium
- Chat messages: text-base, font-normal

## Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-6, p-8
- Section gaps: gap-8, gap-12
- Card spacing: space-y-4, space-y-6
- Hero padding: py-16 md:py-24

**Container Strategy:**
- Landing page: max-w-7xl mx-auto
- Itinerary view: max-w-6xl mx-auto
- Chat modal: max-w-2xl
- Admin page: max-w-7xl mx-auto

## Landing Page Layout

**Hero Section (80vh):**
- Full-width hero image of Shimla (snow-capped mountains, colonial architecture backdrop)
- Center-aligned content overlay with backdrop-blur-sm on text container
- Headline + subheadline + form contained in max-w-2xl centered card with translucent background (bg-white/90 backdrop-blur-md)
- No hover states on buttons over images - buttons maintain consistent appearance

**Form Design:**
- Single-column form layout within hero card
- Input groups with icon prefixes (Heroicons: calendar, currency, users, heart)
- Rounded inputs (rounded-lg) with generous padding (p-4)
- Multi-select interest tags as pill buttons (rounded-full, px-4, py-2)
- Primary CTA: Large button (px-8, py-4, rounded-lg, font-semibold)

**Quick Stats Bar (below hero):**
- 4-column grid (grid-cols-2 md:grid-cols-4, gap-6)
- Each stat: Large number + small label, centered
- Stats: "150+ Spots", "AI-Powered", "Local Insights", "Real-time Alerts"

## Itinerary View Layout

**Header Bar:**
- Sticky top navigation (sticky top-0, z-40)
- Trip summary: Days, Budget, Traveler type in pill badges
- Action buttons: Download JSON, Ask Assistant (right-aligned)

**Day Cards:**
- Vertical timeline with connector lines (border-l-2 with absolute positioning)
- Each day: Large card (rounded-xl, p-8, shadow-lg)
- Day header: "Day 1" badge + date + time range + cost summary (grid layout)

**Spot Cards (within days):**
- Grid: 1 column mobile, 2 columns desktop (grid-cols-1 lg:grid-cols-2, gap-6)
- Each card structure:
  - Spot image placeholder (aspect-video, rounded-lg) with overlay gradient
  - Name + time estimate header (flex justify-between)
  - Description text (2-3 lines, text-ellipsis)
  - Metadata grid: Opening hours | Entry fee | Crowd score (3 columns, text-sm)
  - Tags row: Pills for categories (rounded-full, text-xs)
  - "Hidden Gem" badge if applicable (absolute top-right with star icon)

**Travel Segments (between spots):**
- Compact row with travel icon (walk/taxi), duration, distance
- Indented slightly from spot cards for visual hierarchy

**Summary Footer:**
- Total cost, total time, spots count in prominent card
- Weather forecast widget (3-day mini cards)

## Chat Assistant Modal

**Modal Structure:**
- Fixed overlay (fixed inset-0, z-50, backdrop-blur-sm)
- Centered modal (max-w-2xl, max-h-[80vh])
- Rounded-2xl with shadow-2xl

**Chat Layout:**
- Header: Title + close button (flex justify-between, p-6, border-b)
- Messages area: Scrollable (flex-1, overflow-y-auto, p-6, space-y-4)
- Input footer: Sticky bottom with input + send button (p-4, border-t)

**Message Bubbles:**
- User messages: Right-aligned, rounded-2xl rounded-tr-sm, max-w-[80%]
- Assistant messages: Left-aligned, rounded-2xl rounded-tl-sm, max-w-[80%]
- Avatar icons (user: Heroicons user-circle, AI: sparkles icon)
- Timestamp below each message (text-xs, opacity-70)

**Context Cards (in assistant replies):**
- Referenced spots/alerts as mini cards within messages
- Compact layout: icon + title + snippet (p-3, rounded-lg)

## Alerts Panel

**Layout:**
- Sidebar or top banner on itinerary page (w-full lg:w-80)
- Stack of alert cards (space-y-3)

**Alert Card Structure:**
- Icon (warning/info/event) + type badge at top
- Title (font-semibold)
- Description (text-sm, 2-3 lines)
- Timestamp (text-xs)
- Severity indicator: Border accent (border-l-4)

## Admin Dashboard

**Grid Layout:**
- 3-column grid for scraped items (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Filters/search bar at top (sticky, py-4)

**Scraped Item Cards:**
- Image thumbnail (if available, aspect-square, rounded-t-lg)
- Source badge (Instagram/Blog/Alert)
- Content preview (truncated text, 4 lines max)
- Tag interface: Dropdown or toggle for "Hidden Gem" (bottom of card)
- Action button: "Tag as Hidden Gem" with star icon

**Tagged Items Highlight:**
- Visual badge/ribbon on cards already tagged
- Count summary at page top

## Component Library

**Buttons:**
- Primary: Large rounded-lg, px-6 py-3, font-semibold
- Secondary: Same size, stroke border (border-2)
- Icon buttons: Square (w-10 h-10), rounded-full for close buttons
- Pill buttons (interests): rounded-full, px-4 py-2, text-sm

**Input Fields:**
- Rounded-lg borders
- Padding: px-4 py-3
- Focus rings (ring-2, ring-offset-2)
- Label above with text-sm font-medium

**Cards:**
- Standard: rounded-xl, shadow-md, p-6
- Elevated: rounded-2xl, shadow-xl, p-8 (for main content)
- Compact: rounded-lg, shadow-sm, p-4 (for lists)

**Badges/Pills:**
- rounded-full with px-3 py-1
- text-xs or text-sm font-medium
- Icon + text combination where applicable

**Loading States:**
- Skeleton screens: animate-pulse with bg-gray-200/bg-gray-300 alternating blocks
- Shimmer effect for cards
- Spinner for inline actions (from Heroicons)

## Icons
**Icon Library:** Heroicons (via CDN)
- Navigation: home, map, chat-bubble, cog
- Itinerary: clock, currency-dollar, users, map-pin
- Travel: truck, walking, star (for gems)
- Alerts: exclamation-triangle, information-circle, calendar
- Admin: tag, eye, pencil

## Responsive Breakpoints
- Mobile-first approach
- Key breakpoints: md: (768px), lg: (1024px)
- Hero form: Stack on mobile, same layout on desktop
- Itinerary spots: 1 column mobile, 2 columns desktop
- Admin grid: 1→2→3 columns across breakpoints
- Chat modal: Full-screen on mobile, centered on desktop

## Images

**Required Images:**
1. **Hero Background (Landing)**: Panoramic Shimla landscape - snow-capped Himalayas, colonial architecture (Christ Church or Mall Road), warm golden hour lighting. Full-width, high-resolution, subtle gradient overlay for text legibility.

2. **Spot Thumbnails (10-15 images)**: Individual images for each Shimla attraction - Jakhu Temple, Kufri, Mall Road, Christ Church, Shimla State Museum, Summer Hill, Ridge, Annandale, Chadwick Falls, Green Valley. Landscape aspect ratio (16:9), vibrant, tourism-quality photos.

3. **Loading Placeholder**: Generic mountain/travel illustration for image lazy-load states.

---

**Visual Principles:**
- Generous whitespace, never cramped
- Clear visual hierarchy through size and weight, not visual treatment
- Consistent rounded corners (lg/xl/2xl progression)
- Subtle shadows for depth
- Mobile-responsive, touch-friendly targets (min 44px)
- Accessible contrast ratios maintained throughout