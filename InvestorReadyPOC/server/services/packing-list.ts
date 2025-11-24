// Personalized packing lists by season and weather

export interface PackingList {
  season: string;
  weather: string;
  essential: string[];
  clothing: string[];
  gear: string[];
  toiletries: string[];
  electronics: string[];
  documents: string[];
  tips: string[];
}

export function getPackingList(season: string, weather: string): PackingList {
  const packingGuides: Record<string, Record<string, PackingList>> = {
    Spring: {
      sunny: {
        season: "Spring",
        weather: "Sunny",
        essential: ["Light backpack", "Water bottle (2L)", "Sunscreen (SPF 50)", "Insect repellent"],
        clothing: ["T-shirts (2-3)", "Light jacket", "Shorts", "Comfortable trekking shoes", "Hat/cap", "Sunglasses"],
        gear: ["Camera for photography", "Powerbank", "Light sleeping bag if camping"],
        toiletries: ["Deodorant", "Moisturizer", "Lip balm", "Basic first-aid kit"],
        electronics: ["Phone charger", "Headphones", "Portable speaker optional"],
        documents: ["ID/Passport", "Travel insurance", "Hotel bookings"],
        tips: ["Pack light - you'll want to explore", "Layers help with temperature changes", "Good shoes are essential"]
      },
      cloudy: {
        season: "Spring",
        weather: "Cloudy",
        essential: ["Light backpack", "Water bottle", "Light rain jacket", "Flashlight"],
        clothing: ["Long-sleeve shirt", "Light sweater", "Rain pants", "Waterproof shoes", "Hat"],
        gear: ["Umbrella", "Poncho", "Dry bags"],
        toiletries: ["Waterproof bag", "Moisturizer", "Basic meds"],
        electronics: ["Phone charger", "Waterproof case"],
        documents: ["ID", "Travel insurance"],
        tips: ["Clouds can mean rain - always carry jacket", "Visibility lower - headlamp useful", "Great for photography in clouds"]
      }
    },
    Summer: {
      sunny: {
        season: "Summer",
        weather: "Sunny/Hot",
        essential: ["Large water bottle (3L)", "High SPF sunscreen (50+)", "Hat/cap", "Sunglasses"],
        clothing: ["Light cotton clothes (4-5)", "Light shorts", "Breathable shoes", "Sandals for camp"],
        gear: ["Cooling towel", "Portable fan", "Lightweight poncho for sun"],
        toiletries: ["Sunscreen", "Aloe vera gel", "Lip balm", "Moisture-wicking deodorant"],
        electronics: ["Phone charger", "Powerbank (essential)", "Water-resistant case"],
        documents: ["ID", "Travel insurance", "Medical prescriptions"],
        tips: ["Drink 3-4L water daily", "Avoid midday sun (11 AM - 4 PM)", "Light colors keep you cool"]
      },
      rainy: {
        season: "Summer",
        weather: "Monsoon/Rainy",
        essential: ["Quality waterproof bag", "Water bottles", "Quick-dry towel", "Flashlight"],
        clothing: ["Waterproof jacket", "Waterproof pants", "Water-resistant shoes", "Wool sweater for cold"],
        gear: ["Umbrella", "Poncho", "Dry bags for electronics", "Trekking poles"],
        toiletries: ["Antifungal powder", "Moisturizer", "Bandages"],
        electronics: ["Waterproof phone case", "Waterproof powerbank"],
        documents: ["ID", "Insurance", "Travel permits"],
        tips: ["Leeches common - salt helpful", "Don't trek alone in rain", "Check road conditions before travel"]
      }
    },
    Autumn: {
      sunny: {
        season: "Autumn",
        weather: "Clear/Sunny",
        essential: ["Backpack (50L)", "Water bottle", "Sunscreen", "Layers"],
        clothing: ["Light jacket", "T-shirts (3)", "Long pants", "Comfortable trekking shoes", "Sweater"],
        gear: ["Camera for golden hour shots", "Tripod", "Journal for writing"],
        toiletries: ["Sunscreen", "Lip balm", "Basic first-aid"],
        electronics: ["Phone charger", "Powerbank", "Headlamp"],
        documents: ["ID", "Travel insurance"],
        tips: ["Best season - pack for all activities", "Golden hour amazing (6-7 AM & 5-6 PM)", "Layers essential - temperature swings"]
      }
    },
    Winter: {
      sunny: {
        season: "Winter",
        weather: "Cold/Snow",
        essential: ["Heavy winter coat", "Thermal layers", "Wool socks (5-6 pairs)", "Insulated boots"],
        clothing: ["Thermal underwear", "Sweaters (2)", "Waterproof jacket", "Snow boots", "Waterproof pants"],
        gear: ["Beanie/balaclava", "Gloves/mittens", "Thermal sleeping bag"],
        toiletries: ["Lip balm", "Moisturizer", "Hand cream"],
        electronics: ["Hand warmer", "Powerbank (battery drains fast in cold)"],
        documents: ["ID", "Travel insurance", "Medical info"],
        tips: ["Extreme cold - check weather hourly", "Layers are KEY (3-4 layers)", "Waterproof everything", "Heavy gear = slow trekking"]
      }
    }
  };

  const seasonGuide = packingGuides[season] || packingGuides.Spring;
  const weatherGuide = seasonGuide[weather] || Object.values(seasonGuide)[0];
  
  return weatherGuide;
}

export function getPackingChecklist(destination: string, season: string, duration: number): string[] {
  const checklist = [
    "📋 Trip Documents: Passport, ID, Insurance, Hotel Bookings, Flight Tickets",
    "🎒 Backpack: 40-50L capacity, comfortable straps",
    "👕 Clothes: Check destination weather (3-4 tops, 2 bottoms, undergarments for duration+1)",
    "👟 Footwear: Comfortable shoes, backup pair, socks",
    "💧 Hydration: Water bottle/bladder, water purification tablets",
    "🧴 Toiletries: Toothbrush, soap, shampoo, deodorant, medications",
    "📱 Electronics: Phone charger, powerbank, headphones",
    "💰 Money: Cash, credit card, travel card",
    "🆔 Safety: First-aid kit, insurance card, emergency contacts",
    "📷 Camera: Phone + external camera if photographer",
    "🗺️ Maps: Offline maps downloaded, guidebook",
    "🏕️ Weather-Specific: (Check forecast and pack accordingly)",
  ];

  if (duration > 3) {
    checklist.push("🧺 Laundry: Detergent for washing clothes, drying towel");
  }

  return checklist;
}
