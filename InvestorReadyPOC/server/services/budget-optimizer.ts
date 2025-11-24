// Advanced budget optimizer for personalized cost breakdown

export interface BudgetBreakdown {
  accommodation: number;
  meals: number;
  transportation: number;
  activities: number;
  contingency: number;
  total: number;
}

export function calculateBudgetBreakdown(totalBudget: number, days: number, budget: "low" | "medium" | "high"): BudgetBreakdown {
  let dailyBudget = totalBudget / days;
  
  let breakdown: BudgetBreakdown;
  
  if (budget === "low") {
    // Budget guesthouse stays, street food, shared transport
    breakdown = {
      accommodation: totalBudget * 0.40,  // ₹400-600/night
      meals: totalBudget * 0.25,           // ₹250-350/day
      transportation: totalBudget * 0.15,  // Buses, shared cabs
      activities: totalBudget * 0.15,      // Free/cheap activities
      contingency: totalBudget * 0.05,     // Emergency buffer
      total: totalBudget
    };
  } else if (budget === "medium") {
    // Mid-range hotels, restaurant food, private transport
    breakdown = {
      accommodation: totalBudget * 0.45,
      meals: totalBudget * 0.25,
      transportation: totalBudget * 0.15,
      activities: totalBudget * 0.10,
      contingency: totalBudget * 0.05,
      total: totalBudget
    };
  } else {
    // Premium hotels, fine dining, private taxis
    breakdown = {
      accommodation: totalBudget * 0.50,
      meals: totalBudget * 0.25,
      transportation: totalBudget * 0.10,
      activities: totalBudget * 0.10,
      contingency: totalBudget * 0.05,
      total: totalBudget
    };
  }
  
  return breakdown;
}

export function estimateTransportationCost(distanceKm: number, budget: "low" | "medium" | "high"): number {
  if (distanceKm < 1) return 0;
  
  if (budget === "low") {
    // Shared transport: ₹10-15 per km
    return Math.ceil(distanceKm * 12);
  } else if (budget === "medium") {
    // Taxi: ₹20-25 per km
    return Math.ceil(distanceKm * 22);
  } else {
    // Private car/Uber: ₹35-40 per km
    return Math.ceil(distanceKm * 38);
  }
}

export function estimateMealCost(budget: "low" | "medium" | "high"): number {
  const mealCosts = {
    low: { breakfast: 80, lunch: 150, dinner: 150 },
    medium: { breakfast: 150, lunch: 250, dinner: 300 },
    high: { breakfast: 250, lunch: 400, dinner: 500 }
  };
  
  const costs = mealCosts[budget];
  return costs.breakfast + costs.lunch + costs.dinner;
}

export function getSavingsTips(budget: "low" | "medium" | "high"): string[] {
  const tips = {
    low: [
      "Eat at local dhabas for authentic, cheap meals (₹80-120)",
      "Use local buses instead of taxis (saves 60-70%)",
      "Book homestays or guesthouses (₹300-500/night)",
      "Visit free attractions: temples, viewpoints, nature walks",
      "Travel during off-peak seasons for 30-40% discounts"
    ],
    medium: [
      "Look for mid-range hotels with breakfast included",
      "Mix restaurants with local eateries (save ₹150-200/meal)",
      "Use shared cabs or local buses for short distances",
      "Buy activity passes if visiting multiple sites",
      "Eat lunch (biggest meal) at cheaper places, dinner at restaurants"
    ],
    high: [
      "Book premium hotels with good rates during shoulder seasons",
      "Reserve fine dining for special occasions",
      "Use private taxis or Uber for convenience",
      "Get activity guides or tour operators for unique experiences",
      "Consider luxury homestays for personalized service"
    ]
  };
  
  return tips[budget];
}
