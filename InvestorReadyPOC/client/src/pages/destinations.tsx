import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Home } from "lucide-react";
import { Link } from "wouter";

interface Destination {
  id: string;
  name: string;
  region: string;
  description: string;
  state: string;
  imageUrl: string;
  highlights: string[];
}

const regionColors = {
  North: "from-blue-600 to-blue-400",
  South: "from-green-600 to-green-400",
  East: "from-purple-600 to-purple-400",
  West: "from-orange-600 to-orange-400",
};

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations");
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDestination = (destinationId: string) => {
    // Store destination in sessionStorage for use in home page
    sessionStorage.setItem("selectedDestination", destinationId);
    setLocation(`/home?destination=${destinationId}`);
  };

  const groupedDestinations = destinations.reduce((acc, dest) => {
    if (!acc[dest.region]) {
      acc[dest.region] = [];
    }
    acc[dest.region].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);

  const regionOrder = ["North", "South", "East", "West"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Explore India
            </h1>
            <p className="text-slate-300 text-lg">Choose your destination and discover hidden gems</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="text-white border-white hover:bg-white/10">
              <Home className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-white py-12">Loading destinations...</div>
        ) : (
          <div className="space-y-12">
            {regionOrder.map((region) => {
              const regionDests = groupedDestinations[region];
              if (!regionDests) return null;

              const colorClass = regionColors[region as keyof typeof regionColors];

              return (
                <div key={region}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${colorClass}`} />
                    <h2 className="text-3xl font-bold text-white">{region} India</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regionDests.map((dest) => (
                      <Card
                        key={dest.id}
                        className="group cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                        onClick={() => handleSelectDestination(dest.id)}
                      >
                        <div className={`h-40 bg-gradient-to-br ${colorClass} overflow-hidden relative`}>
                          <img 
                            src={dest.imageUrl}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>

                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-xl text-white mb-1">{dest.name}</CardTitle>
                              <CardDescription className="text-slate-400 text-sm">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {dest.state}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <p className="text-sm text-slate-300">{dest.description}</p>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase">Highlights</p>
                            <div className="flex flex-wrap gap-2">
                              {dest.highlights.map((highlight) => (
                                <span
                                  key={highlight}
                                  className="px-2 py-1 text-xs bg-slate-700 text-slate-200 rounded-full"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>

                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white group"
                            onClick={() => handleSelectDestination(dest.id)}
                          >
                            Plan Trip
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
