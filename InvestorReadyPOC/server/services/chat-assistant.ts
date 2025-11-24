import type { Alert, Spot, ScrapedContent, ChatMessage } from "@shared/schema";

export async function generateChatResponse(
  message: string,
  spots: Spot[],
  alerts: Alert[],
  scrapedContent: ScrapedContent[]
): Promise<ChatMessage> {
  const lowerMessage = message.toLowerCase();
  const response: ChatMessage = {
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString(),
    context: {},
  };

  // Check for crowd-related queries
  if (lowerMessage.includes("crowd") || lowerMessage.includes("busy") || lowerMessage.includes("packed")) {
    const spotName = extractSpotName(lowerMessage, spots);

    if (spotName) {
      const spot = spots.find((s) => s.name.toLowerCase().includes(spotName.toLowerCase()));

      if (spot) {
        response.context!.spots = [spot];

        if (spot.crowdScore >= 7) {
          response.content = `${spot.name} tends to be quite crowded (crowd level: ${spot.crowdScore}/10). ${getAlternativeSuggestion(spot, spots)}`;
        } else {
          response.content = `Good news! ${spot.name} is relatively peaceful with a crowd level of ${spot.crowdScore}/10. ${spot.bestTime ? `Best time to visit: ${spot.bestTime}` : ""}`;
        }

        // Add Instagram insights
        const relatedPosts = scrapedContent.filter(
          (item) =>
            item.source.includes("Instagram") &&
            (item.content.toLowerCase().includes(spotName.toLowerCase()) || item.geoTags?.some((tag) => tag.toLowerCase().includes(spotName.toLowerCase())))
        );

        if (relatedPosts.length > 0) {
          const crowdPost = relatedPosts.find((post) => post.content.toLowerCase().includes("crowd"));
          if (crowdPost) {
            response.content += `\n\n📱 Recent visitor feedback: "${crowdPost.content.split(".")[0]}."`;
          }
        }
      }
    } else {
      // General crowd info
      const peacefulSpots = spots.filter((s) => s.crowdScore <= 4);
      response.context!.spots = peacefulSpots.slice(0, 3);
      response.content = `Looking for peaceful places? Here are some less crowded spots:\n\n${peacefulSpots
        .slice(0, 3)
        .map((s) => `• ${s.name} (crowd level: ${s.crowdScore}/10)`)
        .join("\n")}`;
    }
  }

  // Check for road closure / traffic queries
  else if (
    lowerMessage.includes("road") ||
    lowerMessage.includes("traffic") ||
    lowerMessage.includes("closure") ||
    lowerMessage.includes("closed")
  ) {
    const roadAlerts = alerts.filter((a) => a.type === "road_closure" || a.severity === "high");

    if (roadAlerts.length > 0) {
      response.context!.alerts = roadAlerts;
      response.content = `⚠️ Current road alerts:\n\n${roadAlerts
        .map((alert) => `${alert.title}\n${alert.description}${alert.affectedAreas ? `\nAffected: ${alert.affectedAreas.join(", ")}` : ""}`)
        .join("\n\n")}`;
    } else {
      response.content = "No major road closures reported at the moment! Roads are clear for travel. 🚗";
    }
  }

  // Check for weather queries
  else if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || lowerMessage.includes("temperature")) {
    const weatherAlerts = alerts.filter((a) => a.type === "weather");

    if (weatherAlerts.length > 0) {
      response.context!.alerts = weatherAlerts;
      response.content = weatherAlerts.map((alert) => `${alert.title}\n${alert.description}`).join("\n\n");
    } else {
      response.content =
        "No weather alerts at the moment! Expect pleasant mountain weather. Always carry a light jacket as temperatures can drop in the evening. 🌤️";
    }
  }

  // Check for alternative/recommendation queries
  else if (
    lowerMessage.includes("alternative") ||
    lowerMessage.includes("instead") ||
    lowerMessage.includes("recommend") ||
    lowerMessage.includes("suggest")
  ) {
    const spotName = extractSpotName(lowerMessage, spots);

    if (spotName) {
      const originalSpot = spots.find((s) => s.name.toLowerCase().includes(spotName.toLowerCase()));
      if (originalSpot) {
        const alternatives = getAlternativeSpots(originalSpot, spots);
        response.context!.spots = alternatives;
        response.content = `Great alternatives to ${originalSpot.name}:\n\n${alternatives
          .map(
            (s) =>
              `• ${s.name} - ${s.description.split(".")[0]}. (Crowd: ${s.crowdScore}/10)${s.isHiddenGem ? " ⭐ Hidden Gem" : ""}`
          )
          .join("\n\n")}`;
      }
    } else {
      // General recommendations
      const hiddenGems = spots.filter((s) => s.isHiddenGem === 1);
      response.context!.spots = hiddenGems.slice(0, 3);
      response.content = `✨ Here are some hidden gems you might love:\n\n${hiddenGems
        .slice(0, 3)
        .map((s) => `• ${s.name} - ${s.description.split(".")[0]}`)
        .join("\n\n")}`;
    }
  }

  // Check for food queries
  else if (lowerMessage.includes("food") || lowerMessage.includes("restaurant") || lowerMessage.includes("eat")) {
    const foodPosts = scrapedContent.filter(
      (item) => item.content.toLowerCase().includes("food") || item.tags.includes("food") || item.content.toLowerCase().includes("restaurant")
    );

    if (foodPosts.length > 0) {
      response.context!.posts = foodPosts.slice(0, 2);
      response.content = `🍛 Here's what locals recommend:\n\n${foodPosts
        .slice(0, 2)
        .map((post) => `${post.content.split(".").slice(0, 2).join(".")}`)
        .join("\n\n")}`;
    } else {
      const foodSpots = spots.filter((s) => s.tags.includes("food"));
      response.context!.spots = foodSpots.slice(0, 3);
      response.content = `Check out these areas known for great food:\n\n${foodSpots
        .slice(0, 3)
        .map((s) => `• ${s.name}`)
        .join("\n")}`;
    }
  }

  // Check for event queries
  else if (lowerMessage.includes("event") || lowerMessage.includes("festival") || lowerMessage.includes("happening")) {
    const eventAlerts = alerts.filter((a) => a.type === "event");

    if (eventAlerts.length > 0) {
      response.context!.alerts = eventAlerts;
      response.content = `🎉 Upcoming events:\n\n${eventAlerts.map((alert) => `${alert.title}\n${alert.description}`).join("\n\n")}`;
    } else {
      response.content = "No special events scheduled at the moment. Check back later for festival and cultural event updates!";
    }
  }

  // Check for specific spot information
  else if (lowerMessage.includes("tell me about") || lowerMessage.includes("information about") || lowerMessage.includes("details")) {
    const spotName = extractSpotName(lowerMessage, spots);

    if (spotName) {
      const spot = spots.find((s) => s.name.toLowerCase().includes(spotName.toLowerCase()));

      if (spot) {
        response.context!.spots = [spot];
        response.content = `${spot.name}\n\n${spot.description}\n\n📍 Location: ${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}\n⏰ ${spot.openingHours || "Always open"}\n💰 ${spot.entryFee || "Free"}\n👥 Crowd level: ${spot.crowdScore}/10\n${spot.bestTime ? `⭐ Best time: ${spot.bestTime}` : ""}${spot.isHiddenGem ? "\n✨ This is a hidden gem!" : ""}`;
      }
    }
  }

  // Default response
  if (!response.content) {
    response.content = `I can help you with:
    
• Crowd levels at specific spots (e.g., "Is Kufri crowded?")
• Road conditions and closures
• Weather updates
• Alternative recommendations
• Food suggestions
• Event information
• Spot details

What would you like to know about Shimla?`;
  }

  return response;
}

function extractSpotName(message: string, spots: Spot[]): string | null {
  const lowerMessage = message.toLowerCase();

  // Try to find spot names in the message
  for (const spot of spots) {
    const spotNameLower = spot.name.toLowerCase();
    if (lowerMessage.includes(spotNameLower)) {
      return spot.name;
    }

    // Also check for partial matches
    const words = spotNameLower.split(" ");
    for (const word of words) {
      if (word.length > 4 && lowerMessage.includes(word)) {
        return spot.name;
      }
    }
  }

  return null;
}

function getAlternativeSuggestion(spot: Spot, allSpots: Spot[]): string {
  const alternatives = getAlternativeSpots(spot, allSpots);
  if (alternatives.length > 0) {
    return `Consider visiting ${alternatives[0].name} instead - similar vibe but less crowded (${alternatives[0].crowdScore}/10).`;
  }
  return "Visit during early morning or late afternoon for a better experience.";
}

function getAlternativeSpots(originalSpot: Spot, allSpots: Spot[]): Spot[] {
  // Find spots with similar tags but lower crowd scores
  return allSpots
    .filter((s) => {
      if (s.id === originalSpot.id) return false;

      // Check for tag overlap
      const commonTags = s.tags.filter((tag) => originalSpot.tags.includes(tag));
      return commonTags.length >= 1 && s.crowdScore < originalSpot.crowdScore;
    })
    .sort((a, b) => a.crowdScore - b.crowdScore)
    .slice(0, 3);
}
