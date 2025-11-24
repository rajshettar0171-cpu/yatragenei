import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Compass, Zap, Users, Star, ArrowRight, Waves } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      title: "34 Destinations",
      description: "Explore India's most beautiful locations across all regions"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Smart Itineraries",
      description: "AI-powered personalized travel plans tailored to your style"
    },
    {
      icon: <Compass className="w-8 h-8 text-green-500" />,
      title: "Hidden Gems",
      description: "Discover lesser-known spots curated by travel experts"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Travel Assistant",
      description: "Chat with our AI for instant travel advice and recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              TravelAI
            </h2>
          </div>
          <Link href="/destinations">
            <Button variant="outline" size="sm" className="text-white border-blue-400 hover:bg-blue-400/10">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Discover India's Most Incredible Places
                </h1>
                <p className="text-xl text-slate-300">
                  From misty mountains to tropical beaches, from ancient temples to vibrant cities. Plan your perfect journey across India with AI-powered recommendations.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Link href="/destinations">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto" size="lg">
                    Start Exploring <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-blue-400">34</p>
                  <p className="text-sm text-slate-400">Destinations</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-400">4</p>
                  <p className="text-sm text-slate-400">Regions</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-purple-400">100K+</p>
                  <p className="text-sm text-slate-400">Possible Plans</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:block hidden">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 h-96 flex items-center justify-center">
                <Waves className="w-32 h-32 text-white/20 absolute" />
                <div className="relative z-10 text-center">
                  <Compass className="w-20 h-20 text-white mx-auto mb-4" />
                  <p className="text-white/70 text-lg font-semibold">Explore India</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Why Choose TravelAI?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Plan smarter, travel better, discover more with our intelligent travel companion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-slate-700/50 w-fit rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Preview */}
      <section className="py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Explore by Region
            </h2>
            <p className="text-slate-300 text-lg">Discover destinations across all of India</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: "North India", color: "from-blue-600 to-blue-400", destinations: "11 Destinations" },
              { region: "South India", color: "from-green-600 to-green-400", destinations: "8 Destinations" },
              { region: "West India", color: "from-orange-600 to-orange-400", destinations: "7 Destinations" },
              { region: "East India", color: "from-purple-600 to-purple-400", destinations: "8 Destinations" }
            ].map((reg) => (
              <Card key={reg.region} className={`bg-gradient-to-br ${reg.color} border-0 overflow-hidden group cursor-pointer hover:shadow-xl transition-all`}>
                <CardContent className="p-8 h-48 flex flex-col justify-between relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{reg.region}</h3>
                    <p className="text-white/80">{reg.destinations}</p>
                  </div>
                  <div className="relative z-10">
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Ready to Plan Your Adventure?
              </h2>
              <p className="text-xl text-slate-300">
                Choose a destination and let our AI create the perfect itinerary for you
              </p>
            </div>
            <Link href="/destinations">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg h-auto" size="lg">
                Explore 34 Destinations <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400">© 2024 TravelAI. Discover India.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
