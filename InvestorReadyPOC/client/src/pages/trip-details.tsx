import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, AlertCircle, Package, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  id: string;
  text: string;
  rating: number;
  crowdLevel: number;
  helpful: number;
  date: string;
}

interface WeatherAlert {
  severity: string;
  condition: string;
  message: string;
  recommendation: string;
}

interface PackingItem {
  category: string;
  items: string[];
}

interface CostEstimate {
  total: number;
  daily: number;
  breakdown: Record<string, number>;
}

export default function TripDetails() {
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [packing, setPacking] = useState<any>(null);
  const [costs, setCosts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get("destination") || "shimla";
  const spot = searchParams.get("spot") || "Jakhu Temple";
  const season = searchParams.get("season") || "Autumn";
  const days = parseInt(searchParams.get("days") || "3");
  const budget = searchParams.get("budget") || "medium";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [reviewRes, weatherRes, packingRes, costRes] = await Promise.all([
          fetch(`/api/reviews/${spot}`),
          fetch(`/api/weather-alerts/${destination}`),
          fetch(`/api/packing-list/${destination}/${season}/${days}`),
          fetch(`/api/cost-estimate/${destination}/${days}/${budget}/${season}`)
        ]);

        const reviewData = await reviewRes.json();
        const weatherData = await weatherRes.json();
        const packingData = await packingRes.json();
        const costData = await costRes.json();

        setReviews(reviewData);
        setWeather(weatherData);
        setPacking(packingData);
        setCosts(costData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [destination, spot, season, days, budget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading trip details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/destinations")} className="p-2 hover:bg-slate-800 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{destination.toUpperCase()} - Trip Details</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="reviews" className="mb-8">
          <TabsList className="bg-slate-800 border-slate-700 grid w-full grid-cols-4">
            <TabsTrigger value="reviews">👥 Reviews</TabsTrigger>
            <TabsTrigger value="weather">🌤️ Weather</TabsTrigger>
            <TabsTrigger value="packing">🎒 Packing</TabsTrigger>
            <TabsTrigger value="costs">💰 Costs</TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="grid gap-4">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{reviews?.spot}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-yellow-400">{reviews?.stats?.averageRating}</span>
                    <span className="text-slate-400">/ 5.0 ({reviews?.stats?.totalReviews} reviews)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-300">👥 Avg Crowd Level: {reviews?.stats?.averageCrowdLevel}/10</p>
                  {reviews?.liveUpdate && (
                    <div className="bg-blue-600/20 border border-blue-600/30 rounded p-3">
                      <p className="font-semibold">Live Update: {reviews.liveUpdate.currentCrowd}/10</p>
                      <p className="text-sm text-slate-300">{reviews.liveUpdate.prediction}</p>
                    </div>
                  )}
                </div>
              </Card>

              {reviews?.reviews?.map((review: any, idx: number) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-slate-600"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Crowd: {review.crowdLevel}/10</p>
                    </div>
                    <span className="text-slate-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-slate-300 mb-2">{review.text}</p>
                  <p className="text-xs text-slate-500">👍 {review.helpful} found helpful</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-4">
            {weather?.alerts?.map((alert: any, idx: number) => (
              <Card key={idx} className={`border-l-4 p-4 ${alert.severity === "critical" ? "bg-red-900/20 border-red-600 border-l-red-600" : alert.severity === "high" ? "bg-orange-900/20 border-orange-600 border-l-orange-600" : "bg-slate-800 border-slate-700 border-l-yellow-600"}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold">{alert.condition}</h4>
                    <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                    <p className="text-slate-400 text-sm">✅ {alert.recommendation}</p>
                  </div>
                </div>
              </Card>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weather?.forecast?.map((day: any, idx: number) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
                  <h4 className="font-bold mb-2">{day.date}</h4>
                  <div className="space-y-1 text-sm">
                    <p>🌡️ {day.low}°C - {day.high}°C</p>
                    <p>{day.condition}</p>
                    <p>💧 Humidity: {day.humidity}%</p>
                    <p>💨 Wind: {day.windSpeed} km/h</p>
                    <p>☔ Rain: {day.chanceOfRain}%</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-800 border-slate-700 p-4">
              <h4 className="font-bold mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {weather?.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx} className="text-slate-300 text-sm">• {rec}</li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* Packing Tab */}
          <TabsContent value="packing" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700 p-4 border-l-4 border-l-blue-600">
              <div className="flex items-start gap-2">
                <Package className="text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">{packing?.packingList?.weather}</p>
                  <p className="text-slate-400 text-sm">{packing?.weight_warning}</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(packing?.packingList || {}).map(([category, items]: [string, any]) => {
                if (Array.isArray(items) && category !== "tips") {
                  return (
                    <Card key={category} className="bg-slate-800 border-slate-700 p-4">
                      <h4 className="font-bold mb-3 capitalize">{category}</h4>
                      <ul className="space-y-2">
                        {items.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-300">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  );
                }
                return null;
              })}
            </div>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-600/20 to-green-900/20 border-green-600/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-400" size={20} />
                  <span className="text-slate-400 text-sm">Daily Budget</span>
                </div>
                <p className="text-3xl font-bold text-green-400">{costs?.formatted?.daily}</p>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-600/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-400" size={20} />
                  <span className="text-slate-400 text-sm">Total ({costs?.days} days)</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">{costs?.formatted?.total}</p>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-600/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-purple-400" size={20} />
                  <span className="text-slate-400 text-sm">Budget Level</span>
                </div>
                <p className="text-3xl font-bold text-purple-400 capitalize">{costs?.budget}</p>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Cost Breakdown (Daily)</h3>
              <div className="space-y-2">
                {costs?.costBreakdown && Object.entries(costs.costBreakdown).map(([category, amount]: [string, any]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-slate-300">{category}</span>
                    <span className="font-semibold">₹{Math.round(amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-3">💡 Money Saving Tips</h3>
              <ul className="space-y-2">
                {costs?.savingsTips?.map((tip: string, idx: number) => (
                  <li key={idx} className="text-slate-300 text-sm">✓ {tip}</li>
                ))}
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
