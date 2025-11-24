// Community reviews and real-time crowd updates

export interface Review {
  id: string;
  userId: string;
  spotName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  crowdLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  text: string;
  date: string;
  helpful: number;
  visitedDate?: string;
  photos?: string[];
}

export interface CrowdUpdate {
  spotName: string;
  currentCrowd: number;
  timestamp: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  prediction: string;
}

// Mock community data
export const communityReviews: Review[] = [
  {
    id: "rev-1",
    userId: "user-123",
    spotName: "Jakhu Temple",
    rating: 5,
    crowdLevel: 7,
    text: "Beautiful views! Early morning is best. Avoid 2-4 PM when tourists crowd.",
    date: "2024-11-23",
    helpful: 45,
    visitedDate: "2024-11-20"
  },
  {
    id: "rev-2",
    userId: "user-456",
    spotName: "Mall Road",
    rating: 4,
    crowdLevel: 8,
    text: "Great shopping and cafes. Go on weekday mornings for best experience.",
    date: "2024-11-22",
    helpful: 32,
    visitedDate: "2024-11-18"
  },
  {
    id: "rev-3",
    userId: "user-789",
    spotName: "Solang Valley",
    rating: 5,
    crowdLevel: 9,
    text: "Amazing for paragliding! Summers get very crowded. Go in September for fewer people.",
    date: "2024-11-21",
    helpful: 67,
    visitedDate: "2024-10-15"
  }
];

export const crowdUpdates: CrowdUpdate[] = [
  {
    spotName: "Jakhu Temple",
    currentCrowd: 6,
    timestamp: new Date().toISOString(),
    trend: "increasing",
    prediction: "Will peak around 2-3 PM"
  },
  {
    spotName: "Mall Road",
    currentCrowd: 7,
    timestamp: new Date().toISOString(),
    trend: "stable",
    prediction: "Expect crowds until evening"
  },
  {
    spotName: "Solang Valley",
    currentCrowd: 8,
    timestamp: new Date().toISOString(),
    trend: "increasing",
    prediction: "Peak crowd expected by noon"
  }
];

export function getReviewsForSpot(spotName: string): Review[] {
  return communityReviews.filter(r => r.spotName.toLowerCase().includes(spotName.toLowerCase()));
}

export function getAverageRating(spotName: string): number {
  const reviews = getReviewsForSpot(spotName);
  if (reviews.length === 0) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) as any;
}

export function getAverageCrowdLevel(spotName: string): number {
  const reviews = getReviewsForSpot(spotName);
  if (reviews.length === 0) return 5;
  return Math.round(reviews.reduce((sum, r) => sum + r.crowdLevel, 0) / reviews.length);
}

export function getCrowdUpdate(spotName: string): CrowdUpdate | null {
  return crowdUpdates.find(u => u.spotName.toLowerCase().includes(spotName.toLowerCase())) || null;
}

export function addReview(review: Omit<Review, 'id' | 'date'>): Review {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString()
  };
  communityReviews.push(newReview);
  return newReview;
}
