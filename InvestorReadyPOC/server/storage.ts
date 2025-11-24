import {
  type Spot,
  type InsertSpot,
  type Itinerary,
  type InsertItinerary,
  type Alert,
  type InsertAlert,
  type ScrapedContent,
  type InsertScrapedContent,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

export interface IStorage {
  // Spots
  getAllSpots(): Promise<Spot[]>;
  getSpotById(id: string): Promise<Spot | undefined>;
  updateSpotHiddenGem(id: string, isHiddenGem: number): Promise<void>;

  // Itineraries
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  getItineraryById(id: string): Promise<Itinerary | undefined>;

  // Alerts
  getAllAlerts(): Promise<Alert[]>;
  getAlertById(id: string): Promise<Alert | undefined>;

  // Scraped Content
  getAllScrapedContent(): Promise<ScrapedContent[]>;
  getScrapedContentById(id: string): Promise<ScrapedContent | undefined>;
  tagScrapedContent(id: string, tag: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private spots: Map<string, Spot>;
  private itineraries: Map<string, Itinerary>;
  private alerts: Map<string, Alert>;
  private scrapedContent: Map<string, ScrapedContent>;
  private currentDestination: string = "shimla";

  constructor() {
    this.spots = new Map();
    this.itineraries = new Map();
    this.alerts = new Map();
    this.scrapedContent = new Map();

    // Load initial data from JSON files
    this.loadInitialData();
  }

  setDestination(destination: string) {
    this.currentDestination = destination;
  }

  private loadInitialData() {
    try {
      // Load spots for all destinations
      const allSpotsData = JSON.parse(
        readFileSync(join(process.cwd(), "data", "spots-data.json"), "utf-8")
      );
      
      // Add destination info to spots
      for (const [destination, spots] of Object.entries(allSpotsData)) {
        (spots as Spot[]).forEach((spot: Spot) => {
          const spotWithDest = { ...spot, destination };
          this.spots.set(spot.id, spotWithDest as Spot);
        });
      }

      // Load alerts for all destinations
      const alertsData = JSON.parse(
        readFileSync(join(process.cwd(), "data", "multi-alerts.json"), "utf-8")
      );
      alertsData.forEach((alert: Alert) => {
        this.alerts.set(alert.id, alert);
      });

      // Load blog posts
      const blogPosts = JSON.parse(
        readFileSync(join(process.cwd(), "data", "blog_posts.json"), "utf-8")
      );
      blogPosts.forEach((post: ScrapedContent) => {
        this.scrapedContent.set(post.id, post);
      });

      // Load Instagram posts
      const instaPosts = JSON.parse(
        readFileSync(join(process.cwd(), "data", "insta_posts.json"), "utf-8")
      );
      instaPosts.forEach((post: ScrapedContent) => {
        this.scrapedContent.set(post.id, post);
      });

      console.log(`Loaded ${this.spots.size} spots from all destinations, ${this.alerts.size} alerts, ${this.scrapedContent.size} scraped items`);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }

  // Spots
  async getAllSpots(destination?: string): Promise<Spot[]> {
    const dest = destination || this.currentDestination;
    const allSpots = Array.from(this.spots.values());
    // Filter spots by destination if in spots data
    return allSpots.filter((spot: any) => !spot.destination || spot.destination === dest);
  }

  async getSpotById(id: string): Promise<Spot | undefined> {
    return this.spots.get(id);
  }

  async updateSpotHiddenGem(id: string, isHiddenGem: number): Promise<void> {
    const spot = this.spots.get(id);
    if (spot) {
      spot.isHiddenGem = isHiddenGem;
      this.spots.set(id, spot);
    }
  }

  // Itineraries
  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = randomUUID();
    const itinerary: Itinerary = {
      ...insertItinerary,
      id,
      createdAt: new Date().toISOString(),
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  async getItineraryById(id: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  // Alerts
  async getAllAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async getAlertById(id: string): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  // Scraped Content
  async getAllScrapedContent(): Promise<ScrapedContent[]> {
    return Array.from(this.scrapedContent.values());
  }

  async getScrapedContentById(id: string): Promise<ScrapedContent | undefined> {
    return this.scrapedContent.get(id);
  }

  async tagScrapedContent(id: string, tag: string): Promise<void> {
    const content = this.scrapedContent.get(id);
    if (content) {
      if (!content.tags.includes(tag)) {
        content.tags.push(tag);
      }
      this.scrapedContent.set(id, content);

      // If tagging as hidden gem, also update related spot
      if (tag === "hidden_gem" && content.geoTags && content.geoTags.length > 0) {
        // Find spots mentioned in geo tags
        const allSpots = Array.from(this.spots.values());
        for (const spot of allSpots) {
          if (content.geoTags.some(geoTag => spot.name.includes(geoTag) || geoTag.includes(spot.name))) {
            spot.isHiddenGem = 1;
            this.spots.set(spot.id, spot);
          }
        }
      }
    }
  }
}

export const storage = new MemStorage();
