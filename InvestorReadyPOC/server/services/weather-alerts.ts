// Weather alerts and notifications

export interface WeatherAlert {
  id: string;
  destination: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  condition: string;
  message: string;
  recommendation: string;
  timestamp: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  chanceOfRain: number;
}

// Mock weather data
export const weatherAlerts: WeatherAlert[] = [
  {
    id: "alert-1",
    destination: "shimla",
    severity: "medium",
    condition: "Light Rain Expected",
    message: "Light to moderate rain expected in Shimla tomorrow afternoon",
    recommendation: "Carry umbrella, avoid high-altitude treks, best for indoor activities",
    timestamp: new Date().toISOString()
  },
  {
    id: "alert-2",
    destination: "manali",
    severity: "high",
    condition: "Heavy Snow Warning",
    message: "Heavy snow expected on Rohtang Pass - road may close",
    recommendation: "Delay trekking, check road status before travel, carry heavy winter gear",
    timestamp: new Date().toISOString()
  },
  {
    id: "alert-3",
    destination: "goa",
    severity: "low",
    condition: "High UV Index",
    message: "Strong UV rays - high risk of sunburn",
    recommendation: "Apply SPF 50+ sunscreen, drink extra water, avoid midday sun",
    timestamp: new Date().toISOString()
  }
];

export const weatherForecasts: Record<string, WeatherForecast[]> = {
  shimla: [
    { date: "2024-11-24", high: 18, low: 8, condition: "Partly Cloudy", humidity: 65, windSpeed: 15, uvIndex: 5, chanceOfRain: 20 },
    { date: "2024-11-25", high: 16, low: 6, condition: "Light Rain", humidity: 75, windSpeed: 20, uvIndex: 3, chanceOfRain: 70 },
    { date: "2024-11-26", high: 17, low: 7, condition: "Cloudy", humidity: 70, windSpeed: 12, uvIndex: 4, chanceOfRain: 30 },
  ],
  manali: [
    { date: "2024-11-24", high: 12, low: 2, condition: "Clear", humidity: 45, windSpeed: 10, uvIndex: 6, chanceOfRain: 0 },
    { date: "2024-11-25", high: 8, low: -2, condition: "Heavy Snow", humidity: 85, windSpeed: 35, uvIndex: 1, chanceOfRain: 100 },
    { date: "2024-11-26", high: 5, low: -5, condition: "Snow", humidity: 80, windSpeed: 25, uvIndex: 2, chanceOfRain: 80 },
  ],
  goa: [
    { date: "2024-11-24", high: 32, low: 26, condition: "Sunny", humidity: 70, windSpeed: 8, uvIndex: 9, chanceOfRain: 0 },
    { date: "2024-11-25", high: 31, low: 25, condition: "Sunny", humidity: 72, windSpeed: 9, uvIndex: 8, chanceOfRain: 5 },
    { date: "2024-11-26", high: 30, low: 24, condition: "Partly Cloudy", humidity: 75, windSpeed: 10, uvIndex: 7, chanceOfRain: 10 },
  ]
};

export function getWeatherAlerts(destination: string): WeatherAlert[] {
  return weatherAlerts.filter(a => a.destination === destination.toLowerCase());
}

export function getWeatherForecast(destination: string): WeatherForecast[] {
  return weatherForecasts[destination.toLowerCase()] || [];
}

export function getWeatherRecommendations(forecast: WeatherForecast): string[] {
  const recommendations: string[] = [];

  if (forecast.chanceOfRain > 70) {
    recommendations.push("☔ High rain chance - carry umbrella and waterproof gear");
  }
  
  if (forecast.uvIndex >= 8) {
    recommendations.push("☀️ Strong UV rays - apply SPF 50+ sunscreen, wear hat");
  }
  
  if (forecast.high > 30) {
    recommendations.push("🌞 Very hot - drink plenty of water, avoid midday activity");
  }
  
  if (forecast.low < 5) {
    recommendations.push("❄️ Very cold - wear thermal layers and heavy winter gear");
  }
  
  if (forecast.windSpeed > 20) {
    recommendations.push("💨 Strong winds - secure loose items, be careful on heights");
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Great weather for outdoor activities!");
  }

  return recommendations;
}
