import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Star, Search, Tag, Instagram, FileText, AlertTriangle, ArrowLeft } from "lucide-react";
import type { ScrapedContent } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: scrapedItems = [], isLoading } = useQuery<ScrapedContent[]>({
    queryKey: ["/api/admin/scraped"],
  });

  const tagMutation = useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: string }) => {
      return apiRequest("POST", "/api/admin/tag", { id, tag });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scraped"] });
      toast({
        title: "Success",
        description: "Item tagged as hidden gem!",
      });
    },
  });

  const filteredItems = scrapedItems.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hiddenGemsCount = scrapedItems.filter((item) =>
    item.tags.includes("hidden_gem")
  ).length;

  const getSourceIcon = (source: string) => {
    if (source.toLowerCase().includes("instagram")) return Instagram;
    if (source.toLowerCase().includes("blog")) return FileText;
    return AlertTriangle;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} data-testid="button-back-home">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Content Admin
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage scraped content and tag hidden gems
                </p>
              </div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2" data-testid="badge-hidden-gems-count">
              <Star className="w-4 h-4 mr-2" />
              {hiddenGemsCount} Hidden Gems
            </Badge>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search scraped content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No content found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const SourceIcon = getSourceIcon(item.source);
              const isHiddenGem = item.tags.includes("hidden_gem");

              return (
                <Card
                  key={item.id}
                  className={`relative hover-elevate ${isHiddenGem ? 'border-accent-foreground/30' : ''}`}
                  data-testid={`card-content-${item.id}`}
                >
                  {/* Hidden Gem Badge */}
                  {isHiddenGem && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Hidden Gem
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <SourceIcon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {item.source}
                        </Badge>
                        {item.title && (
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Content Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                      {item.content}
                    </p>

                    {/* Geo Tags */}
                    {item.geoTags && item.geoTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.geoTags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <Button
                        size="sm"
                        variant={isHiddenGem ? "secondary" : "default"}
                        disabled={isHiddenGem || tagMutation.isPending}
                        onClick={() => tagMutation.mutate({ id: item.id, tag: "hidden_gem" })}
                        data-testid={`button-tag-${item.id}`}
                      >
                        <Tag className="w-3 h-3 mr-2" />
                        {isHiddenGem ? "Tagged" : "Tag as Gem"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
