import type { Spot, GenerateItineraryRequest, ItineraryDay, ItinerarySpot } from "@shared/schema";

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Score spots based on interests, crowd level, and hidden gem status
function scoreSpot(spot: Spot, interests: string[]): number {
  let score = 0;

  // Interest matching (0-100 points)
  const matchingInterests = spot.tags.filter((tag) => interests.includes(tag));
  score += matchingInterests.length * 25;

  // Crowd score - invert so lower crowd = higher score (0-50 points)
  score += (10 - spot.crowdScore) * 5;

  // Hidden gem bonus (50 points)
  if (spot.isHiddenGem === 1) {
    score += 50;
  }

  return score;
}

// Generate travel time and mode based on distance
function getTravelInfo(distanceKm: number): { mode: "walk" | "taxi" | "bus"; time: string; distance: string } {
  if (distanceKm < 1) {
    return { mode: "walk", time: `${Math.ceil(distanceKm * 15)} min`, distance: `${(distanceKm * 1000).toFixed(0)}m` };
  } else if (distanceKm < 5) {
    return { mode: "taxi", time: `${Math.ceil(distanceKm * 5)} min`, distance: `${distanceKm.toFixed(1)} km` };
  } else {
    return { mode: "bus", time: `${Math.ceil(distanceKm * 6)} min`, distance: `${distanceKm.toFixed(1)} km` };
  }
}

// Generate reason for visiting based on interests and spot characteristics
function generateReason(spot: Spot, interests: string[], isHiddenGem: boolean): string {
  const reasons = [];

  if (isHiddenGem) {
    reasons.push("Hidden gem with fewer tourists");
  }

  if (spot.crowdScore <= 4) {
    reasons.push("Peaceful atmosphere");
  }

  if (interests.includes("photography") && spot.tags.includes("photography")) {
    reasons.push("Stunning photo opportunities");
  }

  if (interests.includes("culture") && spot.tags.includes("culture")) {
    reasons.push("Rich cultural heritage");
  }

  if (interests.includes("nature") && spot.tags.includes("nature")) {
    reasons.push("Beautiful natural scenery");
  }

  if (interests.includes("trekking") && spot.tags.includes("trekking")) {
    reasons.push("Great trekking experience");
  }

  if (interests.includes("food") && spot.tags.includes("food")) {
    reasons.push("Authentic local cuisine");
  }

  if (interests.includes("adventure") && spot.tags.includes("adventure")) {
    reasons.push("Exciting adventure activities");
  }

  if (reasons.length === 0) {
    reasons.push("Must-visit landmark in Shimla");
  }

  return reasons.slice(0, 2).join(", ");
}

// Estimate cost based on budget and spot
function estimateCost(spot: Spot, budget: string): string {
  if (spot.entryFee === "Free") return "Free";

  // Parse entry fee
  const feeMatch = spot.entryFee?.match(/₹(\d+)/);
  if (!feeMatch) return "Free";

  const baseFee = parseInt(feeMatch[1]);

  if (budget === "low") {
    return `₹${baseFee}`;
  } else if (budget === "medium") {
    return `₹${baseFee + 50}`; // Add meal/snack cost
  } else {
    return `₹${baseFee + 150}`; // Add meal + shopping
  }
}

export async function generateItinerary(
  request: GenerateItineraryRequest,
  allSpots: Spot[]
): Promise<ItineraryDay[]> {
  const { days, budget, interests, travelerType } = request;

  // Filter and score spots
  const scoredSpots = allSpots
    .map((spot) => ({
      spot,
      score: scoreSpot(spot, interests),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Calculate spots per day
  const spotsPerDay = travelerType === "family" ? 3 : travelerType === "couple" ? 4 : 5;
  const totalSpots = Math.min(scoredSpots.length, days * spotsPerDay);

  const selectedSpots = scoredSpots.slice(0, totalSpots).map((item) => item.spot);

  // Create day-by-day plan
  const plan: ItineraryDay[] = [];
  let spotIndex = 0;

  for (let day = 1; day <= days; day++) {
    const daySpots: ItinerarySpot[] = [];
    const spotsForThisDay = Math.min(spotsPerDay, selectedSpots.length - spotIndex);

    let dayStartTime = 9; // Start at 9 AM
    let previousSpot: Spot | null = null;

    for (let i = 0; i < spotsForThisDay; i++) {
      const spot = selectedSpots[spotIndex++];

      const travelInfo = previousSpot
        ? getTravelInfo(haversineDistance(previousSpot.lat, previousSpot.lng, spot.lat, spot.lng))
        : { mode: "walk" as const, time: "0 min", distance: "0 km" };

      // Add travel time
      if (previousSpot) {
        dayStartTime += parseInt(travelInfo.time) / 60;
      }

      const hour = Math.floor(dayStartTime);
      const minute = Math.floor((dayStartTime % 1) * 60);
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

      const duration = travelerType === "family" ? "2 hours" : "1.5 hours";

      daySpots.push({
        spotId: spot.id,
        name: spot.name,
        description: spot.description,
        time: timeString,
        duration,
        cost: estimateCost(spot, budget),
        travelMode: travelInfo.mode,
        travelTime: travelInfo.time,
        travelDistance: travelInfo.distance,
        reason: generateReason(spot, interests, spot.isHiddenGem === 1),
        isHiddenGem: spot.isHiddenGem === 1,
        coordinates: {
          lat: spot.lat,
          lng: spot.lng,
        },
        openingHours: spot.openingHours,
        crowdScore: spot.crowdScore,
        tags: spot.tags,
        imageUrl: spot.imageUrl,
      });

      // Add spot duration to time
      dayStartTime += parseFloat(duration);

      previousSpot = spot;
    }

    // Calculate day totals
    const totalCost = daySpots.reduce((sum, spot) => {
      const cost = spot.cost === "Free" ? 0 : parseInt(spot.cost.replace(/[₹,]/g, "")) || 0;
      return sum + cost;
    }, 0);

    const totalHours = daySpots.reduce((sum, spot) => {
      return sum + parseFloat(spot.duration);
    }, 0);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + day - 1);

    plan.push({
      day,
      date: currentDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      spots: daySpots,
      totalCost: totalCost > 0 ? `₹${totalCost}` : "Free",
      totalTime: `${Math.floor(totalHours)} hours ${Math.floor((totalHours % 1) * 60)} min`,
    });
  }

  return plan;
}

export function calculateItinerarySummary(plan: ItineraryDay[]): { totalCost: string; totalTime: string } {
  const totalCost = plan.reduce((sum, day) => {
    const dayCost = parseInt(day.totalCost.replace(/[₹,]/g, "")) || 0;
    return sum + dayCost;
  }, 0);

  const totalHours = plan.reduce((sum, day) => {
    const match = day.totalTime.match(/(\d+)\s*hours?\s*(\d+)?\s*min/);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return sum + hours + minutes / 60;
    }
    return sum;
  }, 0);

  return {
    totalCost: `₹${totalCost}`,
    totalTime: `${Math.floor(totalHours)} hours`,
  };
}
