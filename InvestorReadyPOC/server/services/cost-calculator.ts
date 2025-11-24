// Smart cost calculator for trip planning

export interface CostEstimate {
  accommodation: number;
  meals: number;
  transport: number;
  activities: number;
  shopping: number;
  emergency: number;
  total: number;
  daily: number;
  breakdown: Record<string, number>;
}

export function calculateTripCost(
  destination: string,
  days: number,
  budget: "low" | "medium" | "high",
  season: string
): CostEstimate {
  // Base costs by destination (daily rates in INR)
  const destinationCosts: Record<string, Record<string, number>> = {
    shimla: { accommodation: 600, meals: 400, transport: 200, activities: 300 },
    manali: { accommodation: 700, meals: 500, transport: 250, activities: 400 },
    goa: { accommodation: 800, meals: 600, transport: 150, activities: 500 },
    jaipur: { accommodation: 500, meals: 350, transport: 150, activities: 250 },
    delhi: { accommodation: 800, meals: 500, transport: 200, activities: 300 },
    bangalore: { accommodation: 700, meals: 450, transport: 150, activities: 300 },
    mumbai: { accommodation: 900, meals: 600, transport: 200, activities: 400 },
    default: { accommodation: 650, meals: 450, transport: 200, activities: 350 }
  };

  // Seasonal multipliers (peak/off-season)
  const seasonMultipliers: Record<string, number> = {
    "Spring": 1.2,
    "Summer": 1.0,
    "Autumn": 1.3,  // Peak season
    "Winter": 1.25,
    "default": 1.0
  };

  // Budget level multipliers
  const budgetMultipliers = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };

  const baseCosts = destinationCosts[destination.toLowerCase()] || destinationCosts.default;
  const seasonMult = seasonMultipliers[season] || seasonMultipliers.default;
  const budgetMult = budgetMultipliers[budget];

  // Apply season and budget multipliers
  const accommodation = Math.round(baseCosts.accommodation * seasonMult * budgetMult);
  const meals = Math.round(baseCosts.meals * budgetMult);
  const transport = Math.round(baseCosts.transport * seasonMult);
  const activities = Math.round(baseCosts.activities * budgetMult);
  const shopping = Math.round((accommodation + meals) * 0.2); // 20% of acc + meals
  const emergency = Math.round((accommodation + meals + transport + activities) * 0.1); // 10% buffer

  const dailyCost = accommodation + meals + transport + activities + shopping + emergency;
  const totalCost = dailyCost * days;

  return {
    accommodation: accommodation * days,
    meals: meals * days,
    transport: transport * days,
    activities: activities * days,
    shopping: shopping * days,
    emergency: emergency * days,
    total: totalCost,
    daily: dailyCost,
    breakdown: {
      "Accommodation": accommodation,
      "Meals": meals,
      "Transport": transport,
      "Activities": activities,
      "Shopping": shopping,
      "Emergency Buffer": emergency
    }
  };
}

export function getSavingsTipsByDate(season: string, dayOfWeek: number): string[] {
  const tips: string[] = [];

  // Season tips
  if (season === "Monsoon" || season === "Summer") {
    tips.push("💧 Travel during monsoon for 20-30% discounts on hotels");
    tips.push("🏨 Book hotel deals - many empty rooms in off-season");
  } else if (season === "Autumn" || season === "Spring") {
    tips.push("⚠️ Peak season prices - book 2-3 months in advance for discounts");
    tips.push("💳 Look for combo deals (hotel + transport packages)");
  }

  // Weekday vs weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    tips.push("📅 Weekend rates are 15-20% higher - consider weekday travel");
  } else {
    tips.push("✅ Weekday travel = better prices + fewer crowds");
  }

  tips.push("🍽️ Eat at local dhabas instead of tourist restaurants (save 50-70%)");
  tips.push("🚌 Use buses instead of taxis (save 40-60%)");
  tips.push("🎟️ Buy combo passes for multiple attractions");

  return tips;
}

export function getPriceComparison(destination: string, budget: "low" | "medium" | "high", days: number): Record<string, number> {
  const estimates = {
    low: calculateTripCost(destination, days, "low", "Summer"),
    medium: calculateTripCost(destination, days, "medium", "Summer"),
    high: calculateTripCost(destination, days, "high", "Summer")
  };

  return {
    "Budget": estimates.low.total,
    "Standard": estimates.medium.total,
    "Premium": estimates.high.total,
    "Savings (Budget vs Standard)": estimates.medium.total - estimates.low.total,
    "Savings (Standard vs Premium)": estimates.high.total - estimates.medium.total
  };
}
