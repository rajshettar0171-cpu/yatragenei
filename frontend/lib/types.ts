export type Alert = {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  affectedAreas: string[];
  timestamp: string;
};

export type Spot = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  bestTime: string;
  entryFee: string;
  openingHours: string;
  crowdScore: number;
  tags: string[];
  isHiddenGem?: number;
};

export type ItinerarySegment = {
  timeOfDay: string;
  startTime: string;
  durationHours: number;
  spotId: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  entryFee: string;
  travelDistanceKm: number;
  travelSuggestion: string;
  foodStop: string;
  interestMatchScore: number;
  notes: string;
};

export type DayPlan = {
  day: number;
  theme: string;
  segments: ItinerarySegment[];
  whyPlan: Record<string, string>;
};

export type ItineraryResponse = {
  destination: string;
  month?: string;
  days: DayPlan[];
  summary: Record<string, unknown>;
};

export type ScrapedFeed = {
  blogs: Record<string, any>[];
  insta: Record<string, any>[];
  alerts: Alert[];
};

export type DestinationMeta = {
  id: string;
  name: string;
  region: string;
  interests: string[];
  bestTime?: string;
  summary?: string;
};

export type DestinationSnapshot = {
  name: string;
  region: string;
  bestTime?: string;
  summary?: string;
  interests: string[];
  topSpots: Spot[];
  experienceIdeas: string[];
  alerts: Alert[];
  roadTripPlan: string;
  bikePlan: string;
  adventureHighlights: string;
  foodHighlights: string;
};

