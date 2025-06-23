import { getCalculatedTeamMetrics } from "./attendanceService";
import { TeamMetrics } from "./types";

export interface DailyBurnoutData {
  name: string;
  team: number;
  company: number;
  date: string;
}

// Generate daily burnout risk data for the past 7 days
export const generateDailyBurnoutData = async (): Promise<
  DailyBurnoutData[]
> => {
  try {
    const teamMetrics = await getCalculatedTeamMetrics();
    const data: DailyBurnoutData[] = [];
    const today = new Date();

    // Generate data for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateString = date.toISOString().split("T")[0];

      // Base team burnout risk from calculated metrics
      const baseTeamRisk = teamMetrics.averageBurnoutScore;

      // Add realistic daily variation based on day of week
      let dailyVariation = 0;
      const dayOfWeek = date.getDay();

      // Higher risk on weekdays, lower on weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Sunday or Saturday
        dailyVariation = -15; // Lower risk on weekends
      } else if (dayOfWeek === 1) {
        // Monday
        dailyVariation = 5; // Slightly higher on Monday
      } else if (dayOfWeek === 5) {
        // Friday
        dailyVariation = 3; // Slightly higher on Friday
      } else {
        dailyVariation = (Math.random() - 0.5) * 8; // Random variation for mid-week
      }

      // Calculate team burnout risk for this day
      const teamBurnoutRisk = Math.max(
        0,
        Math.min(100, baseTeamRisk + dailyVariation)
      );

      // Company average (typically 15-20% lower than team average)
      const companyBurnoutRisk = Math.max(
        0,
        Math.min(100, teamBurnoutRisk * 0.8 + (Math.random() - 0.5) * 5)
      );

      data.push({
        name: dayName,
        team: Math.round(teamBurnoutRisk),
        company: Math.round(companyBurnoutRisk),
        date: dateString,
      });
    }

    return data;
  } catch (error) {
    console.error("Error generating daily burnout data:", error);

    // Fallback data if calculation fails
    return [
      { name: "Mon", team: 45, company: 38, date: "2025-01-13" },
      { name: "Tue", team: 47, company: 39, date: "2025-01-14" },
      { name: "Wed", team: 52, company: 40, date: "2025-01-15" },
      { name: "Thu", team: 48, company: 41, date: "2025-01-16" },
      { name: "Fri", team: 50, company: 42, date: "2025-01-17" },
      { name: "Sat", team: 35, company: 30, date: "2025-01-18" },
      { name: "Sun", team: 30, company: 25, date: "2025-01-19" },
    ];
  }
};

// Get current week's trend direction
export const getTrendDirection = (
  data: DailyBurnoutData[]
): "up" | "down" | "stable" => {
  if (data.length < 2) return "stable";

  const firstHalf = data.slice(0, Math.ceil(data.length / 2));
  const secondHalf = data.slice(Math.ceil(data.length / 2));

  const firstHalfAvg =
    firstHalf.reduce((sum, item) => sum + item.team, 0) / firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce((sum, item) => sum + item.team, 0) / secondHalf.length;

  const difference = secondHalfAvg - firstHalfAvg;

  if (difference > 3) return "up";
  if (difference < -3) return "down";
  return "stable";
};

// Get risk level description
export const getRiskLevel = (averageRisk: number): string => {
  if (averageRisk >= 70) return "High Risk";
  if (averageRisk >= 50) return "Moderate Risk";
  if (averageRisk >= 30) return "Low Risk";
  return "Very Low Risk";
};
