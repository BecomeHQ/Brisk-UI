import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import {
  generateDailyBurnoutData,
  getTrendDirection,
  getRiskLevel,
  DailyBurnoutData,
} from "@/services/employees/chartDataService";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function BurnoutRiskChart() {
  const [chartData, setChartData] = useState<DailyBurnoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendDirection, setTrendDirection] = useState<
    "up" | "down" | "stable"
  >("stable");
  const [averageRisk, setAverageRisk] = useState(0);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await generateDailyBurnoutData();
        setChartData(data);

        // Calculate trend direction
        const trend = getTrendDirection(data);
        setTrendDirection(trend);

        // Calculate average risk
        const avg =
          data.reduce((sum, item) => sum + item.team, 0) / data.length;
        setAverageRisk(Math.round(avg));
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp size={16} className="text-danger" />;
      case "down":
        return <TrendingDown size={16} className="text-green-600" />;
      default:
        return <Minus size={16} className="text-neutral-500" />;
    }
  };

  const getTrendText = () => {
    switch (trendDirection) {
      case "up":
        return "Increasing";
      case "down":
        return "Decreasing";
      default:
        return "Stable";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
        <h3 className="text-base font-medium mb-4">Burnout Risk Trends</h3>
        <div className="h-60 flex items-center justify-center">
          <div className="text-neutral-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium">Burnout Risk Trends</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-600">Trend:</span>
          {getTrendIcon()}
          <span
            className={`font-medium ${
              trendDirection === "up"
                ? "text-danger"
                : trendDirection === "down"
                ? "text-green-600"
                : "text-neutral-500"
            }`}
          >
            {getTrendText()}
          </span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-neutral-600">Average Risk:</span>
            <span className="ml-2 text-lg font-semibold">{averageRisk}%</span>
          </div>
          <div className="text-sm text-neutral-600">
            {getRiskLevel(averageRisk)}
          </div>
        </div>
      </div>

      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompany" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Burnout Risk"]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="team"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorTeam)"
              name="Your Team"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="company"
              stroke="#0ea5e9"
              fillOpacity={1}
              fill="url(#colorCompany)"
              name="Company Average"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger"></div>
          <span className="text-xs text-neutral-600">Your Team</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brisk-500"></div>
          <span className="text-xs text-neutral-600">Company Average</span>
        </div>
      </div>
    </div>
  );
}
