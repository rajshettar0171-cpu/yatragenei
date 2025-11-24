import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary, calculateItinerarySummary } from "./services/itinerary-generator";
import { generateChatResponse } from "./services/chat-assistant";
import { calculateBudgetBreakdown, estimateTransportationCost, getSavingsTips } from "./services/budget-optimizer";
import { getCrowdPrediction } from "./services/crowd-predictor";
import { getWeatherAdvice, suggestAlternativeSpots } from "./services/weather-advisor";
import { findHiddenGems } from "./services/hidden-gems-finder";
import {
  generateItineraryRequestSchema,
  chatRequestSchema,
  tagContentRequestSchema,
} from "@shared/schema";
import { readFileSync } from "fs";
import { join } from "path";

// Load destinations data at module level
function getDestinations() {
  try {
    return JSON.parse(
      readFileSync(join(process.cwd(), "data", "destinations.json"), "utf-8")
    );
  } catch (error) {
    console.error("Error loading destinations:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/destinations - Get all destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = getDestinations();
      res.json(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  // GET /api/destination/:name - Get destination info, top spots, and alerts
  app.get("/api/destination/:name", async (req, res) => {
    try {
      const destination = req.params.name;
      storage.setDestination(destination);
      
      const spots = await storage.getAllSpots(destination);
      const allAlerts = await storage.getAllAlerts();
      const alerts = allAlerts.filter((alert: any) => alert.destination === destination);

      const destInfo = getDestinations();
      const destDetails = destInfo.find((d: any) => d.id === destination);

      res.json({
        destination: destDetails?.name || destination,
        description: destDetails?.description || "",
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
      storage.setDestination(validated.destination || "shimla");

      const allSpots = await storage.getAllSpots(validated.destination || "shimla");
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

  // GET /api/budget/:days/:budget - Get detailed budget breakdown
  app.get("/api/budget/:days/:budget", async (req, res) => {
    try {
      const days = parseInt(req.params.days);
      const budget = req.params.budget as "low" | "medium" | "high";
      
      if (!days || days < 1 || !["low", "medium", "high"].includes(budget)) {
        return res.status(400).json({ error: "Invalid days or budget parameters" });
      }

      // Calculate for a sample total budget
      const totalBudget = budget === "low" ? 5000 : budget === "medium" ? 12000 : 25000;
      const breakdown = calculateBudgetBreakdown(totalBudget, days, budget);
      const tips = getSavingsTips(budget);

      res.json({
        totalBudget,
        days,
        budgetLevel: budget,
        breakdown,
        dailyBudget: Math.round(totalBudget / days),
        savingsTips: tips,
      });
    } catch (error: any) {
      console.error("Error calculating budget:", error);
      res.status(400).json({ error: error.message || "Failed to calculate budget" });
    }
  });

  // GET /api/crowd-prediction/:spotId - Get crowd prediction for a spot
  app.get("/api/crowd-prediction/:spotId", async (req, res) => {
    try {
      const spotId = req.params.spotId;
      const spots = await storage.getAllSpots();
      const spot = spots.find((s: any) => s.id === spotId);

      if (!spot) {
        return res.status(404).json({ error: "Spot not found" });
      }

      const prediction = getCrowdPrediction(spot.crowdScore);
      res.json({
        spotName: spot.name,
        ...prediction,
        currentTime: new Date().toLocaleTimeString("en-IN"),
      });
    } catch (error: any) {
      console.error("Error predicting crowd:", error);
      res.status(400).json({ error: error.message || "Failed to predict crowd" });
    }
  });

  // GET /api/weather-advice/:weather - Get weather-based travel recommendations
  app.get("/api/weather-advice/:weather", async (req, res) => {
    try {
      const weather = req.params.weather.toLowerCase();
      const advice = getWeatherAdvice(weather);
      const alternatives = suggestAlternativeSpots("Mountain Peak", weather);

      res.json({
        weather,
        advice,
        alternativeActivities: alternatives,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error getting weather advice:", error);
      res.status(400).json({ error: error.message || "Failed to get weather advice" });
    }
  });

  // GET /api/hidden-gems/:destination - Discover hidden gems for a destination
  app.get("/api/hidden-gems/:destination", async (req, res) => {
    try {
      const destination = req.params.destination;
      storage.setDestination(destination);

      const spots = await storage.getAllSpots(destination);
      const scrapedContent = await storage.getAllScrapedContent();
      const userInterests = req.query.interests ? (req.query.interests as string).split(",") : ["nature", "culture", "photography"];

      const gems = findHiddenGems(spots, scrapedContent, userInterests, 5);

      res.json({
        destination,
        count: gems.length,
        hiddenGems: gems.map(gem => ({
          spot: gem.spot,
          discoveryScore: gem.score,
          whyHidden: gem.reasons,
          socialMediaMentions: gem.instagramMentions,
          trustScore: gem.trustScore,
        })),
      });
    } catch (error: any) {
      console.error("Error finding hidden gems:", error);
      res.status(400).json({ error: error.message || "Failed to find hidden gems" });
    }
  });

  // POST /api/personalized-recommendations - Get personalized recommendations
  app.post("/api/personalized-recommendations", async (req, res) => {
    try {
      const { destination, days, budget, interests, travelStyle, fitnessLevel } = req.body;

      if (!destination) {
        return res.status(400).json({ error: "Destination is required" });
      }

      storage.setDestination(destination);
      const spots = await storage.getAllSpots(destination);
      const scrapedContent = await storage.getAllScrapedContent();
      const alerts = await storage.getAllAlerts();

      // Get hidden gems
      const gems = findHiddenGems(spots, scrapedContent, interests, 3);

      // Get budget breakdown
      const budgetLevel = budget || "medium";
      const totalBudget = budgetLevel === "low" ? 5000 : budgetLevel === "medium" ? 12000 : 25000;
      const budgetBreakdown = calculateBudgetBreakdown(totalBudget, days || 3, budgetLevel as "low" | "medium" | "high");

      // Get weather advice (default to sunny)
      const weather = req.body.weather || "sunny";
      const weatherAdvice = getWeatherAdvice(weather);

      // Get savings tips
      const tips = getSavingsTips(budgetLevel as "low" | "medium" | "high");

      res.json({
        destination,
        personalization: {
          travelStyle: travelStyle || "balanced",
          fitnessLevel: fitnessLevel || "moderate",
          interests: interests || ["nature", "culture"],
        },
        recommendations: {
          hiddenGems: gems.slice(0, 3),
          budgetAllocation: budgetBreakdown,
          weatherPreparation: weatherAdvice,
          savingsTips: tips,
          relevantAlerts: alerts.filter((a: any) => a.destination === destination).slice(0, 2),
        },
      });
    } catch (error: any) {
      console.error("Error generating recommendations:", error);
      res.status(400).json({ error: error.message || "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
