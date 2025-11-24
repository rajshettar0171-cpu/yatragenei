import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, MapPin, Users, Clock, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Season {
  season: string;
  months: string;
  weather: string;
  bestFor: string[];
  crowdLevel: string;
  crowdScore: number;
  temperature: string;
  recommendations: string[];
}

interface Place {
  name: string;
  description: string;
  crowdScore: number;
  bestTime: string;
  entryFee: string;
  openingHours: string;
  imageUrl: string;
  tags: string[];
}

interface TravelGuide {
  destination: string;
  region: string;
  state: string;
  description: string;
  imageUrl: string;
  totalPlaces: number;
  topPlaces: Place[];
  hiddenGems: Place[];
  seasons: Season[];
  bestTimeToVisit: string;
  smartTips: string[];
  highlights: string[];
  activities: string[];
}

export default function TravelPlanner() {
  const [, setLocation] = useLocation();
  const [guide, setGuide] = useState<TravelGuide | null>(null);
  const [loading, setLoading] = useState(true);

  // Get destination from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get("destination") || "shimla";

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await fetch(`/api/destination-guide/${destination}`);
        if (!response.ok) throw new Error("Failed to load guide");
        const data = await response.json();
        setGuide(data);
      } catch (error) {
        console.error("Error loading travel guide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [destination]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading Smart Travel Guide...</div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Destination not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/destinations")} className="p-2 hover:bg-slate-800 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Smart Travel Planner</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(${guide.imageUrl})`,
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h2 className="text-5xl font-bold mb-2">{guide.destination}</h2>
          <p className="text-xl text-slate-300">{guide.region} • {guide.state}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-400" size={24} />
              <div>
                <div className="text-slate-400 text-sm">Places to Visit</div>
                <div className="text-2xl font-bold">{guide.totalPlaces}</div>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-green-400" size={24} />
              <div>
                <div className="text-slate-400 text-sm">Best Time</div>
                <div className="text-lg font-bold leading-tight">{guide.seasons[0]?.months}</div>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Users className="text-purple-400" size={24} />
              <div>
                <div className="text-slate-400 text-sm">Crowd Level</div>
                <div className="text-2xl font-bold">{guide.seasons[0]?.crowdLevel}</div>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-400" size={24} />
              <div>
                <div className="text-slate-400 text-sm">Temperature</div>
                <div className="text-2xl font-bold">{guide.seasons[0]?.temperature}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="seasons" className="mb-8">
          <TabsList className="bg-slate-800 border-slate-700 grid w-full grid-cols-4">
            <TabsTrigger value="seasons">📅 Seasons</TabsTrigger>
            <TabsTrigger value="places">📍 Places</TabsTrigger>
            <TabsTrigger value="gems">✨ Hidden Gems</TabsTrigger>
            <TabsTrigger value="tips">💡 Smart Tips</TabsTrigger>
          </TabsList>

          {/* Seasons Tab */}
          <TabsContent value="seasons" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.seasons.map((season, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-2xl font-bold mb-2">{season.season}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-slate-400 text-sm">📅 Months</div>
                      <div className="text-lg font-semibold">{season.months}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">🌡️ Weather</div>
                      <div className="text-lg font-semibold">{season.weather}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">👥 Crowd Level</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-semibold">{season.crowdLevel}</div>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${i < season.crowdScore ? "bg-red-500" : "bg-slate-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-2">🎯 Best For</div>
                      <div className="flex flex-wrap gap-2">
                        {season.bestFor.map((activity, i) => (
                          <span key={i} className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-2">💡 Recommendations</div>
                      <ul className="space-y-1">
                        {season.recommendations.map((rec, i) => (
                          <li key={i} className="text-slate-300 text-sm">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Places Tab */}
          <TabsContent value="places" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guide.topPlaces.map((place, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 overflow-hidden">
                  <img src={place.imageUrl} alt={place.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="text-xl font-bold mb-2">{place.name}</h4>
                    <p className="text-slate-300 text-sm mb-3">{place.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-400">⏰ Best Time:</span> {place.bestTime}
                      </div>
                      <div>
                        <span className="text-slate-400">💰 Entry:</span> {place.entryFee}
                      </div>
                      <div>
                        <span className="text-slate-400">🕐 Hours:</span> {place.openingHours}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👥 Crowd:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${i < place.crowdScore ? "bg-red-500" : "bg-slate-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {place.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="bg-slate-700 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hidden Gems Tab */}
          <TabsContent value="gems" className="space-y-4">
            {guide.hiddenGems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.hiddenGems.map((gem, idx) => (
                  <Card key={idx} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-600/30 p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">✨</span>
                      <div>
                        <h4 className="text-xl font-bold">{gem.name}</h4>
                        <p className="text-slate-300 text-sm">{gem.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-slate-400">👥 Crowd Score:</span> {gem.crowdScore}/10
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">⏰ Best Time:</span> {gem.bestTime}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {gem.tags.map((tag, i) => (
                          <span key={i} className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <p className="text-slate-300">No hidden gems discovered yet. Explore and help us find them!</p>
              </Card>
            )}
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-4">
            <div className="grid gap-3">
              {guide.smartTips.map((tip, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 p-4 flex items-start gap-4">
                  <Lightbulb className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                  <p className="text-slate-300">{tip}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Best Time Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-600/30 p-6 mb-8">
          <div className="flex items-start gap-4">
            <Calendar className="text-blue-400 flex-shrink-0" size={32} />
            <div>
              <h3 className="text-2xl font-bold mb-2">🌟 Perfect Time to Visit</h3>
              <p className="text-lg text-slate-200">{guide.bestTimeToVisit}</p>
            </div>
          </div>
        </Card>

        {/* Activities */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Activities Available</h3>
          <div className="flex flex-wrap gap-2">
            {guide.activities.map((activity, idx) => (
              <span key={idx} className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full font-semibold capitalize">
                {activity}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center mb-8">
          <h3 className="text-3xl font-bold mb-3">Ready to Plan Your Trip?</h3>
          <p className="text-xl text-blue-100 mb-6">Generate a personalized itinerary based on your preferences</p>
          <Button
            onClick={() => setLocation(`/itinerary?destination=${destination}`)}
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
          >
            Create Your Itinerary →
          </Button>
        </div>
      </div>
    </div>
  );
}
