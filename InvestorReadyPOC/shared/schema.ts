import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Spot (tourist attraction)
export const spots = pgTable("spots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  bestTime: text("best_time"),
  entryFee: text("entry_fee"),
  openingHours: text("opening_hours"),
  crowdScore: integer("crowd_score").notNull().default(5),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  instagramCaptions: text("instagram_captions").array(),
  imageUrl: text("image_url"),
  isHiddenGem: integer("is_hidden_gem").notNull().default(0),
});

export const insertSpotSchema = createInsertSchema(spots).omit({ id: true });
export type InsertSpot = z.infer<typeof insertSpotSchema>;
export type Spot = typeof spots.$inferSelect;

// Itinerary
export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  days: integer("days").notNull(),
  budget: text("budget").notNull(),
  travelerType: text("traveler_type").notNull(),
  interests: text("interests").array().notNull(),
  plan: jsonb("plan").notNull(),
  totalCost: text("total_cost").notNull(),
  totalTime: text("total_time").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({ id: true, createdAt: true });
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

// Alert
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  timestamp: text("timestamp").notNull(),
  affectedAreas: text("affected_areas").array(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Scraped Content (blogs, Instagram posts)
export const scrapedContent = pgTable("scraped_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  geoTags: text("geo_tags").array(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  url: text("url"),
  timestamp: text("timestamp").notNull(),
});

export const insertScrapedContentSchema = createInsertSchema(scrapedContent).omit({ id: true });
export type InsertScrapedContent = z.infer<typeof insertScrapedContentSchema>;
export type ScrapedContent = typeof scrapedContent.$inferSelect;

// Chat Message (for context)
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  context?: {
    spots?: Spot[];
    alerts?: Alert[];
    posts?: ScrapedContent[];
  };
}

// API Request/Response Types
export const generateItineraryRequestSchema = z.object({
  days: z.number().min(1).max(7),
  budget: z.enum(["low", "medium", "high"]),
  travelerType: z.enum(["solo", "couple", "family", "group"]),
  interests: z.array(z.enum(["trekking", "food", "photography", "relaxation", "culture", "adventure", "nature", "shopping"])),
});

export type GenerateItineraryRequest = z.infer<typeof generateItineraryRequestSchema>;

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    itineraryId: z.string().optional(),
  }).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const tagContentRequestSchema = z.object({
  id: z.string(),
  tag: z.string(),
});

export type TagContentRequest = z.infer<typeof tagContentRequestSchema>;

// Itinerary Plan Structure
export interface ItineraryDay {
  day: number;
  date: string;
  spots: ItinerarySpot[];
  totalCost: string;
  totalTime: string;
}

export interface ItinerarySpot {
  spotId: string;
  name: string;
  description: string;
  time: string;
  duration: string;
  cost: string;
  travelMode: "walk" | "taxi" | "bus";
  travelTime: string;
  travelDistance: string;
  reason: string;
  isHiddenGem: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours?: string;
  crowdScore?: number;
  tags: string[];
}
