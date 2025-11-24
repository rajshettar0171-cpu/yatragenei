// Predict crowds based on time of day, day of week, and season

export interface CrowdPrediction {
  currentCrowd: number;
  predictedCrowd: number;
  bestTime: string;
  worstTime: string;
  recommendation: string;
}

export function predictCrowdByTime(baseCrowdScore: number, hour: number): number {
  // Morning (6-9am): -30% crowd
  // Mid-morning (9am-12pm): base crowd
  // Afternoon (12pm-3pm): +20% crowd
  // Evening (3pm-7pm): +10% crowd
  // Night (7pm-10pm): -40% crowd

  if (hour >= 6 && hour < 9) {
    return Math.max(1, Math.floor(baseCrowdScore * 0.7));
  } else if (hour >= 9 && hour < 12) {
    return baseCrowdScore;
  } else if (hour >= 12 && hour < 15) {
    return Math.min(10, Math.floor(baseCrowdScore * 1.2));
  } else if (hour >= 15 && hour < 19) {
    return Math.min(10, Math.floor(baseCrowdScore * 1.1));
  } else {
    return Math.max(1, Math.floor(baseCrowdScore * 0.6));
  }
}

export function predictCrowdByDayOfWeek(baseCrowdScore: number, dayOfWeek: number): number {
  // Sunday (0): +30% weekend crowd
  // Saturday (6): +30% weekend crowd
  // Mon-Fri (1-5): base crowd
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return Math.min(10, Math.floor(baseCrowdScore * 1.3));
  }
  return baseCrowdScore;
}

export function getCrowdPrediction(baseScore: number): CrowdPrediction {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const currentCrowd = predictCrowdByTime(
    predictCrowdByDayOfWeek(baseScore, day),
    hour
  );
  
  // Predict for next 3 hours
  const nextHour = (hour + 3) % 24;
  const predictedCrowd = predictCrowdByTime(
    predictCrowdByDayOfWeek(baseScore, day),
    nextHour
  );
  
  let bestTime = "Early morning (6-8 AM)";
  let worstTime = "Afternoon (1-3 PM)";
  let recommendation = "Visit in early morning for fewer crowds";
  
  if (baseScore >= 8) {
    bestTime = "Night (7-10 PM) or before 7 AM";
    worstTime = "12 PM - 5 PM";
    recommendation = "This is a popular spot. Visit very early morning or late evening";
  } else if (baseScore >= 5) {
    bestTime = "Morning (8-11 AM)";
    worstTime = "2-4 PM";
    recommendation = "Good time to visit morning or late evening";
  }
  
  return {
    currentCrowd,
    predictedCrowd,
    bestTime,
    worstTime,
    recommendation
  };
}
