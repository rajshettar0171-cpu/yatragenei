import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Download, MessageCircle, ArrowLeft, Clock, DollarSign, MapPin, Star, Users, TrendingUp } from "lucide-react";
import type { ItineraryDay } from "@shared/schema";
import ChatModal from "@/components/chat-modal";
import AlertsPanel from "@/components/alerts-panel";
import { apiRequest } from "@/lib/queryClient";

type ItineraryResponse = {
  id: string;
  days: number;
  budget: string;
  travelerType: string;
  interests: string[];
  plan: ItineraryDay[];
  totalCost: string;
  totalTime: string;
};

export default function Itinerary() {
  const [, navigate] = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const searchParams = new URLSearchParams(window.location.search);

  const params = {
    destination: searchParams.get("destination") || "shimla",
    days: parseInt(searchParams.get("days") || "2"),
    budget: searchParams.get("budget") || "medium",
    travelerType: searchParams.get("travelerType") || "solo",
    interests: searchParams.get("interests")?.split(",").filter(Boolean) || [],
  };

  const generateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/itinerary", params);
    },
    onSuccess: (data) => {
      if (data && data.plan && Array.isArray(data.plan)) {
        setItinerary(data as ItineraryResponse);
      }
    },
    onError: (error) => {
      console.error("Failed to generate itinerary:", error);
    },
  });

  useEffect(() => {
    if (params.interests.length > 0 && !itinerary && !generateMutation.isPending && !generateMutation.isError) {
      console.log("Triggering itinerary generation with params:", params);
      generateMutation.mutate();
    }
  }, []);

  const isLoading = generateMutation.isPending;

  const handleDownload = () => {
    if (!itinerary) return;
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${params.destination}-itinerary-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 bg-card border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-48 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!itinerary || !itinerary.plan || itinerary.plan.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Itinerary Found</CardTitle>
            <CardDescription>Please generate an itinerary from the home page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-card border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" data-testid="badge-days">{itinerary.days} Days</Badge>
                <Badge variant="secondary" data-testid="badge-budget">{itinerary.budget}</Badge>
                <Badge variant="secondary" data-testid="badge-traveler">{itinerary.travelerType}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDownload} data-testid="button-download">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              <Button onClick={() => setIsChatOpen(true)} data-testid="button-open-chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Itinerary Timeline */}
          <div className="lg:col-span-3 space-y-8">
            {itinerary.plan.map((day, dayIndex) => (
              <Card key={day.day} className="overflow-hidden" data-testid={`card-day-${day.day}`}>
                <CardHeader className="bg-muted/30">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold">Day {day.day}</CardTitle>
                      <CardDescription className="text-base mt-1">{day.date}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{day.totalTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{day.totalCost}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {day.spots.map((spot, spotIndex) => (
                      <div key={spotIndex}>
                        <Card className="hover-elevate overflow-hidden" data-testid={`card-spot-${spot.spotId}`}>
                          {/* Spot Image */}
                          <div className="relative h-48 w-full bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                            {spot.imageUrl && (
                              <img 
                                src={spot.imageUrl}
                                alt={spot.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Spot Header */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-xl font-semibold">{spot.name}</h3>
                                    {spot.isHiddenGem && (
                                      <Badge variant="default" className="bg-accent text-accent-foreground">
                                        <Star className="w-3 h-3 mr-1" />
                                        Hidden Gem
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">{spot.description}</p>
                                </div>
                                <div className="text-right text-sm space-y-1">
                                  <div className="font-semibold text-primary">{spot.time}</div>
                                  <div className="text-muted-foreground">{spot.duration}</div>
                                </div>
                              </div>

                              {/* Metadata Grid */}
                              <div className="grid grid-cols-3 gap-4 pt-2">
                                <div className="space-y-1">
                                  <div className="text-xs text-muted-foreground">Entry Fee</div>
                                  <div className="text-sm font-medium">{spot.cost}</div>
                                </div>
                                {spot.openingHours && (
                                  <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Hours</div>
                                    <div className="text-sm font-medium">{spot.openingHours}</div>
                                  </div>
                                )}
                                {spot.crowdScore && (
                                  <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Crowd</div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className={`w-3 h-3 ${spot.crowdScore > 7 ? 'text-destructive' : spot.crowdScore > 4 ? 'text-accent-foreground' : 'text-chart-2'}`} />
                                      <span className="text-sm font-medium">{spot.crowdScore}/10</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap items-center gap-2 pt-2">
                                {spot.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Reason */}
                              <div className="bg-muted/50 rounded-md p-3">
                                <p className="text-sm text-muted-foreground italic">
                                  <span className="font-medium text-foreground">Why visit:</span> {spot.reason}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Travel Segment */}
                        {spotIndex < day.spots.length - 1 && (
                          <div className="flex items-center gap-3 py-3 px-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                              <span className="capitalize">{day.spots[spotIndex + 1].travelMode}</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{day.spots[spotIndex + 1].travelTime}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span>{day.spots[spotIndex + 1].travelDistance}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Summary Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Duration</div>
                    <div className="text-2xl font-bold">{itinerary.totalTime}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                    <div className="text-2xl font-bold">{itinerary.totalCost}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Spots</div>
                    <div className="text-2xl font-bold">
                      {itinerary.plan.reduce((sum, day) => sum + day.spots.length, 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Sidebar */}
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        itineraryId={itinerary.id}
      />
    </div>
  );
}
