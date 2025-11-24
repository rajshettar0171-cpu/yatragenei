// Enhanced hidden gem discovery and ranking

import type { Spot, ScrapedContent } from "@shared/schema";

export interface HiddenGem {
  spot: Spot;
  score: number;
  reasons: string[];
  instagramMentions: number;
  trustScore: number;
}

export function scoreHiddenGem(
  spot: Spot,
  scrapedContent: ScrapedContent[],
  userInterests: string[]
): HiddenGem {
  let score = 0;
  const reasons: string[] = [];
  
  // Low crowd score (1-3 = excellent, 4-6 = good)
  if (spot.crowdScore <= 3) {
    score += 40;
    reasons.push("Very peaceful, minimal tourists");
  } else if (spot.crowdScore <= 6) {
    score += 20;
    reasons.push("Relatively peaceful");
  }
  
  // Low Instagram presence = hidden
  const mentionCount = scrapedContent.filter(content =>
    content.content.toLowerCase().includes(spot.name.toLowerCase()) ||
    content.geoTags?.some(tag => tag.toLowerCase().includes(spot.name.toLowerCase()))
  ).length;
  
  if (mentionCount === 0) {
    score += 30;
    reasons.push("Undiscovered gem - no Instagram mentions");
  } else if (mentionCount <= 2) {
    score += 15;
    reasons.push("Rarely featured on social media");
  }
  
  // Interest match bonus
  const interestMatch = spot.tags.filter(tag => userInterests.includes(tag)).length;
  score += interestMatch * 10;
  
  // Quality of experience
  if (spot.tags.includes("nature") || spot.tags.includes("photography")) {
    score += 10;
    reasons.push("Great for authentic experiences");
  }
  
  // Already marked as hidden gem
  if (spot.isHiddenGem === 1) {
    score += 20;
    reasons.push("Verified hidden gem");
  }
  
  const trustScore = Math.min(100, score);
  
  return {
    spot,
    score,
    reasons: reasons.slice(0, 3),
    instagramMentions: mentionCount,
    trustScore: Math.round((trustScore / 100) * 100)
  };
}

export function findHiddenGems(
  spots: Spot[],
  scrapedContent: ScrapedContent[],
  userInterests: string[],
  limit: number = 5
): HiddenGem[] {
  return spots
    .map(spot => scoreHiddenGem(spot, scrapedContent, userInterests))
    .filter(gem => gem.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
