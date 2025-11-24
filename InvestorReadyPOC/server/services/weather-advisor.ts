// Weather-based travel recommendations

export interface WeatherAdvice {
  safeActivities: string[];
  riskyActivities: string[];
  warnings: string[];
  recommendations: string[];
}

export function getWeatherAdvice(weatherType: string): WeatherAdvice {
  const weatherConditions = {
    sunny: {
      safeActivities: ["Photography", "Trekking", "Sightseeing", "Outdoor activities", "Adventure sports"],
      riskyActivities: [],
      warnings: ["Apply sunscreen", "Stay hydrated", "Peak heat 12-3 PM"],
      recommendations: ["Visit viewpoints early morning", "Use umbrella for shade", "Take water breaks every 30 min"]
    },
    rainy: {
      safeActivities: ["Indoor attractions", "Museums", "Cafés", "Monasteries", "Shopping"],
      riskyActivities: ["Trekking", "Mountain passes", "Outdoor photography", "Adventure sports"],
      warnings: ["Roads may be slippery", "Landslide risk on mountains", "Visibility reduced"],
      recommendations: ["Postpone treks", "Carry waterproof gear if outdoors", "Check road conditions before traveling"]
    },
    cloudy: {
      safeActivities: ["Trekking", "Photography", "Nature walks", "Light adventure"],
      riskyActivities: ["Extreme altitude trekking"],
      warnings: ["Weather can change quickly", "Visibility limited for photography"],
      recommendations: ["Perfect trekking weather", "Bring layers as temperature can drop", "Check weather updates"]
    },
    snowy: {
      safeActivities: ["Photography", "Skiing", "Snow activities", "Short walks", "Sightseeing"],
      riskyActivities: ["Regular trekking", "Mountain passes", "Driving in high altitude"],
      warnings: ["EXTREME: Road closures likely", "Avalanche risk", "Vehicle chains mandatory"],
      recommendations: ["Only with experienced guide", "Skip passes, visit lower valleys", "Check road status hourly"]
    },
    foggy: {
      safeActivities: ["Local exploration", "Café visits", "Indoor activities"],
      riskyActivities: ["Trekking", "Mountain passes", "Photography"],
      warnings: ["Limited visibility", "Roads dangerous", "Easy to get lost"],
      recommendations: ["Stay in town", "Visit next day", "Great for cozy café time"]
    }
  };
  
  return weatherConditions[weatherType as keyof typeof weatherConditions] || weatherConditions.cloudy;
}

export function suggestAlternativeSpots(originalSpot: string, weather: string): string[] {
  const alternatives: Record<string, Record<string, string[]>> = {
    rainy: {
      "Mountain Peak": ["Local café", "Museum", "Shopping arcade", "Temple"],
      "Outdoor Trek": ["Museum", "Indoor market", "Monastery", "Café"],
      "Beach": ["Water sports indoor facility", "Local restaurant", "Shopping", "Spa"]
    },
    snowy: {
      "Regular Trek": ["Ski slopes", "Short scenic walk", "Photography point", "Café"],
      "Mountain Pass": ["Lower valley walk", "Village exploration", "Cafés in town"]
    },
    foggy: {
      "Viewpoint": ["Local market", "Café", "Monastery", "Temple"],
      "Photography": ["Indoor attractions", "Town walk", "Local food"]
    }
  };
  
  return alternatives[weather]?.[originalSpot] || ["Stay in town and relax", "Visit indoor attractions"];
}
