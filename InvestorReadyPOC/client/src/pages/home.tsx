import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Users, Sparkles, TrendingUp, Shield, Bell, Settings } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/shimla_panoramic_hero_image.png";

const interests = [
  { id: "trekking", label: "Trekking", icon: "🥾" },
  { id: "food", label: "Food", icon: "🍛" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "relaxation", label: "Relaxation", icon: "🧘" },
  { id: "culture", label: "Culture", icon: "🏛️" },
  { id: "adventure", label: "Adventure", icon: "⛰️" },
  { id: "nature", label: "Nature", icon: "🌲" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    days: "2",
    budget: "medium",
    travelerType: "solo",
    selectedInterests: [] as string[],
  });

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const handleGenerateItinerary = () => {
    const params = new URLSearchParams({
      days: formData.days,
      budget: formData.budget,
      travelerType: formData.travelerType,
      interests: formData.selectedInterests.join(","),
    });
    setLocation(`/itinerary?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Link */}
      <div className="absolute top-4 right-4 z-50">
        <Link href="/admin">
          <Button variant="ghost" size="icon" data-testid="button-admin">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Hero Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Shimla panoramic view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl" data-testid="card-hero-form">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-8 h-8 text-primary" />
                <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Shimla Travel AI
                </h1>
              </div>
              <CardDescription className="text-lg text-foreground/80 leading-relaxed">
                Discover hidden gems, personalized itineraries, and real-time insights powered by AI
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Days */}
              <div className="space-y-2">
                <Label htmlFor="days" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Trip Duration
                </Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  className="h-12"
                  data-testid="input-days"
                />
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Budget
                </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger className="h-12" data-testid="select-budget">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (₹500-1000/day)</SelectItem>
                    <SelectItem value="medium">Medium (₹1000-2500/day)</SelectItem>
                    <SelectItem value="high">High (₹2500+/day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Traveler Type */}
              <div className="space-y-2">
                <Label htmlFor="travelerType" className="flex items-center gap-2 text-sm font-medium">
                  <Users className="w-4 h-4 text-primary" />
                  Traveler Type
                </Label>
                <Select value={formData.travelerType} onValueChange={(value) => setFormData({ ...formData, travelerType: value })}>
                  <SelectTrigger className="h-12" data-testid="select-traveler-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="couple">Couple</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge
                      key={interest.id}
                      variant={formData.selectedInterests.includes(interest.id) ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm hover-elevate active-elevate-2"
                      onClick={() => toggleInterest(interest.id)}
                      data-testid={`badge-interest-${interest.id}`}
                    >
                      <span className="mr-1">{interest.icon}</span>
                      {interest.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold"
                onClick={handleGenerateItinerary}
                disabled={formData.selectedInterests.length === 0}
                data-testid="button-generate-itinerary"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Itinerary
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2" data-testid="stat-spots">
              <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>150+</div>
              <div className="text-sm text-muted-foreground font-medium">Curated Spots</div>
            </div>
            <div className="text-center space-y-2" data-testid="stat-ai">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground font-medium">AI-Powered</div>
            </div>
            <div className="text-center space-y-2" data-testid="stat-insights">
              <div className="flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground font-medium">Local Insights</div>
            </div>
            <div className="text-center space-y-2" data-testid="stat-alerts">
              <div className="flex items-center justify-center">
                <Bell className="w-10 h-10 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground font-medium">Real-time Alerts</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
