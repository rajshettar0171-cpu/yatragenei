import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary, calculateItinerarySummary } from "./services/itinerary-generator";
import { generateChatResponse } from "./services/chat-assistant";
import {
  generateItineraryRequestSchema,
  chatRequestSchema,
  tagContentRequestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/destination/shimla - Get destination info, top spots, and alerts
  app.get("/api/destination/shimla", async (req, res) => {
    try {
      const spots = await storage.getAllSpots();
      const alerts = await storage.getAllAlerts();

      res.json({
        destination: "Shimla",
        description: "The Queen of Hills - Colonial charm meets Himalayan beauty",
        topSpots: spots.slice(0, 10),
        alerts: alerts.slice(0, 3),
      });
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({ error: "Failed to fetch destination data" });
    }
  });

  // POST /api/itinerary - Generate personalized itinerary
  app.post("/api/itinerary", async (req, res) => {
    try {
      const validated = generateItineraryRequestSchema.parse(req.body);

      const allSpots = await storage.getAllSpots();
      const plan = await generateItinerary(validated, allSpots);
      const summary = calculateItinerarySummary(plan);

      const itinerary = await storage.createItinerary({
        days: validated.days,
        budget: validated.budget,
        travelerType: validated.travelerType,
        interests: validated.interests,
        plan,
        totalCost: summary.totalCost,
        totalTime: summary.totalTime,
      });

      // Explicitly serialize the response to ensure plan is included
      const response = {
        id: itinerary.id,
        days: itinerary.days,
        budget: itinerary.budget,
        travelerType: itinerary.travelerType,
        interests: itinerary.interests,
        plan: itinerary.plan,
        totalCost: itinerary.totalCost,
        totalTime: itinerary.totalTime,
        createdAt: itinerary.createdAt,
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error generating itinerary:", error);
      res.status(400).json({ error: error.message || "Failed to generate itinerary" });
    }
  });

  // GET /api/alerts - Get all active alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // POST /api/chat - Chat with travel assistant
  app.post("/api/chat", async (req, res) => {
    try {
      const validated = chatRequestSchema.parse(req.body);

      const spots = await storage.getAllSpots();
      const alerts = await storage.getAllAlerts();
      const scrapedContent = await storage.getAllScrapedContent();

      const chatResponse = await generateChatResponse(
        validated.message,
        spots,
        alerts,
        scrapedContent
      );

      res.json(chatResponse);
    } catch (error: any) {
      console.error("Error in chat:", error);
      res.status(400).json({ error: error.message || "Failed to process chat message" });
    }
  });

  // GET /api/admin/scraped - Get all scraped content
  app.get("/api/admin/scraped", async (req, res) => {
    try {
      const content = await storage.getAllScrapedContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching scraped content:", error);
      res.status(500).json({ error: "Failed to fetch scraped content" });
    }
  });

  // POST /api/admin/tag - Tag content (e.g., as hidden gem)
  app.post("/api/admin/tag", async (req, res) => {
    try {
      const validated = tagContentRequestSchema.parse(req.body);

      await storage.tagScrapedContent(validated.id, validated.tag);

      res.json({ success: true, message: "Content tagged successfully" });
    } catch (error: any) {
      console.error("Error tagging content:", error);
      res.status(400).json({ error: error.message || "Failed to tag content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
