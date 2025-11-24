import type { Spot } from "@shared/schema";

export interface SeasonalInfo {
  season: string;
  months: string;
  weather: string;
  bestFor: string[];
  crowdLevel: string;
  crowdScore: number;
  temperature: string;
  recommendations: string[];
}

export interface DestinationGuide {
  destinationName: string;
  description: string;
  regions: string;
  seasons: SeasonalInfo[];
  allPlaces: Spot[];
  topPlaces: Spot[];
  hiddenGems: Spot[];
  bestTimeOverall: string;
  travelTips: string[];
  activities: string[];
}

export function getSeasonalInfo(destinationId: string): SeasonalInfo[] {
  const seasonalData: Record<string, SeasonalInfo[]> = {
    shimla: [
      {
        season: "Spring",
        months: "March - May",
        weather: "Pleasant, 15-25°C",
        bestFor: ["Trekking", "Photography", "Sightseeing"],
        crowdLevel: "Moderate",
        crowdScore: 6,
        temperature: "15-25°C",
        recommendations: [
          "Visit Kufri for adventure sports",
          "Trek to Nagtibba & Triund",
          "Explore Jakhu Temple early morning",
          "Perfect time for outdoor photography"
        ]
      },
      {
        season: "Summer",
        months: "June - August",
        weather: "Cool, 10-20°C (Monsoon)",
        bestFor: ["Nature walks", "Indoor activities", "Monsoon treks"],
        crowdLevel: "High",
        crowdScore: 8,
        temperature: "10-20°C",
        recommendations: [
          "Avoid high-altitude treks due to rain",
          "Visit museums and heritage sites",
          "Explore Mall Road shopping",
          "Enjoy local cafés and restaurants"
        ]
      },
      {
        season: "Autumn",
        months: "September - November",
        weather: "Clear, 10-20°C",
        bestFor: ["Trekking", "Photography", "Adventure"],
        crowdLevel: "Moderate-High",
        crowdScore: 7,
        temperature: "10-20°C",
        recommendations: [
          "Best time for high-altitude treks",
          "Golden hour photography perfect",
          "Clear mountain views",
          "Comfortable hiking conditions"
        ]
      },
      {
        season: "Winter",
        months: "December - February",
        weather: "Snow, 0-10°C",
        bestFor: ["Snow activities", "Photography", "Skiing"],
        crowdLevel: "High",
        crowdScore: 8,
        temperature: "0-10°C",
        recommendations: [
          "Check road conditions before traveling",
          "Winter sports at Kufri",
          "Bring warm clothing",
          "Early morning visits for less crowds"
        ]
      }
    ],
    manali: [
      {
        season: "Spring",
        months: "March - May",
        weather: "Pleasant, 15-25°C",
        bestFor: ["Trekking", "Adventure", "Photography"],
        crowdLevel: "Moderate-High",
        crowdScore: 7,
        temperature: "15-25°C",
        recommendations: [
          "Solang Valley for paragliding",
          "Rohtang Pass now open",
          "Trek to Bhrigu Lake",
          "Visit Hadimba Temple"
        ]
      },
      {
        season: "Summer",
        months: "June - August",
        weather: "Warm, 20-30°C",
        bestFor: ["Trekking", "Paragliding", "Adventure"],
        crowdLevel: "Very High",
        crowdScore: 9,
        temperature: "20-30°C",
        recommendations: [
          "Peak season - very crowded",
          "Best for adventure activities",
          "Adi Kailash trek open",
          "Visit early morning or evening"
        ]
      },
      {
        season: "Autumn",
        months: "September - November",
        weather: "Clear, 10-25°C",
        bestFor: ["Trekking", "Photography", "Hiking"],
        crowdLevel: "Moderate",
        crowdScore: 6,
        temperature: "10-25°C",
        recommendations: [
          "Perfect weather for all activities",
          "Fewer crowds than summer",
          "Beautiful mountain views",
          "Ideal for solo travelers"
        ]
      },
      {
        season: "Winter",
        months: "December - February",
        weather: "Snow, -5 to 5°C",
        bestFor: ["Photography", "Skiing", "Snow activities"],
        crowdLevel: "Low-Moderate",
        crowdScore: 5,
        temperature: "-5 to 5°C",
        recommendations: [
          "Road to Rohtang often closed",
          "Winter sports available",
          "Snow photography opportunities",
          "Bring extreme cold weather gear"
        ]
      }
    ]
  };

  return seasonalData[destinationId.toLowerCase()] || [];
}

export function getDestinationTips(destinationId: string): string[] {
  const tips: Record<string, string[]> = {
    shimla: [
      "🎫 Mall Road is the heart of Shimla - explore local shops and cafés",
      "🚡 Use the Ridge Cable Car for quick ascent to Jakhu Temple",
      "🥾 Popular treks: Nagtibba, Triund, Chail to Tani Jabbar",
      "🍽️ Try local Himachali cuisine at local dhabas",
      "🚌 Local buses are cheap and connect all major points",
      "📸 Best photography: Early morning at Jakhu Temple",
      "💰 Budget: ₹50-200 for most attractions",
      "🏨 Stay on Mall Road for easy access to everything"
    ],
    manali: [
      "🧗 Adventure Capital: Paragliding, skiing, rafting, rock climbing",
      "🌲 Solang Valley - 16km from town center, must visit",
      "🏔️ Rohtang Pass (51km) - often closed in winter",
      "🥾 Trek to Beas Kund - 5km, moderate difficulty",
      "🍽️ Try Tibetan momos and local trout fish",
      "🚌 Shared taxis are cheapest for local travel",
      "📸 Golden hour views at Solang Valley",
      "💰 Budget: ₹100-300 for activities"
    ],
    jaipur: [
      "🏛️ Hawa Mahal (Palace of Winds) - iconic 5-story pink building",
      "🕌 City Palace still houses the royal family",
      "🐯 Nahargarh Fort - panoramic city views",
      "🚲 Cycle rickshaws for local transportation",
      "🍛 Try local Rajasthani cuisine",
      "🛍️ Johari Bazaar - traditional jewelry market",
      "📸 Pink City photography best early morning",
      "💰 Budget: ₹50-150 for sightseeing"
    ],
    goa: [
      "🏖️ Beaches: Baga (crowded), Anjuna (laid-back), Paloliem (quiet)",
      "💧 Dudhsagar Falls - 60km trek worth the effort",
      "🏴 Forts: Aguada, Chapora with sea views",
      "🍻 Beach shacks with local Goan food",
      "🚲 Rent scooters for exploring",
      "🕺 Nightlife in North Goa, peace in South Goa",
      "📸 Sunset photography at any beach",
      "💰 Budget: ₹100-300 for food and activities"
    ]
  };

  return tips[destinationId.toLowerCase()] || [];
}

export function getOptimalVisitTime(destinationId: string): string {
  const optimalTimes: Record<string, string> = {
    shimla: "September-November (Autumn) - Clear skies, moderate crowds, perfect weather",
    manali: "September-October (Autumn) - Perfect weather, fewer crowds than summer",
    jaipur: "October-March (Winter) - Pleasant weather, ideal for sightseeing",
    dharamshala: "March-June & September-November (Spring & Autumn)",
    dalhousie: "April-June & September-October (Spring & Autumn)",
    goa: "November-February (Winter) - Perfect beach weather",
    nainital: "March-June (Spring) - Pleasant weather, lake activities",
    mussoorie: "April-June (Summer) - Cloud walks, pleasant weather",
    auli: "December-February (Winter) - Skiing & snow activities",
    rishikesh: "October-March (Cooler months)",
    haridwar: "October-March (Winter) - Pleasant weather for pilgrimage",
    delhi: "October-March (Winter) - Best weather for sightseeing",
    agra: "October-March (Winter) - Comfortable weather for Taj Mahal",
    lucknow: "October-March (Winter)",
    varanasi: "October-March (Winter)",
    ayodhya: "October-March (Winter)",
    gwalior: "October-March (Winter)",
    khajuraho: "October-March (Winter)",
    mumbai: "October-April (Cool season)",
    pune: "October-April (Cool season)",
    aurangabad: "October-March (Winter)",
    hyderabad: "October-April (Cool season)",
    bangalore: "September-May (Throughout year pleasant)",
    mysore: "September-May (Pleasant weather)",
    coorg: "September-May (Throughout year)"
  };

  return optimalTimes[destinationId.toLowerCase()] || "Year-round destination with varying experiences per season";
}
