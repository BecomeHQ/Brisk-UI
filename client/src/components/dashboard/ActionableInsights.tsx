
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface Insight {
  id: string;
  priority: "high" | "medium" | "low";
  message: string;
  action: string;
  employee?: string;
}

export const insights: Insight[] = [{
  id: "1",
  priority: "high",
  message: "Priya Singh has worked late nights 4 times this week",
  action: "Consider checking in with Priya",
  employee: "Priya Singh"
}, {
  id: "2",
  priority: "high",
  message: "Sophia Wong hasn't taken a day off in 3 months",
  action: "Encourage leave next Friday",
  employee: "Sophia Wong"
}, {
  id: "3",
  priority: "medium",
  message: "Engineering team's average burnout score increased by 15%",
  action: "Schedule team check-in"
}, {
  id: "4",
  priority: "medium",
  message: "3 employees worked during the weekend",
  action: "Review workload distribution"
}, {
  id: "5",
  priority: "low",
  message: "8 employees have >50% of annual leave remaining",
  action: "Send leave utilization reminder"
}];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-danger border-danger/20 bg-danger-light";
    case "medium":
      return "text-warning border-warning/20 bg-warning-light";
    case "low":
      return "text-brisk-700 border-brisk-300/30 bg-brisk-100";
    default:
      return "text-neutral-700 border-neutral-200 bg-neutral-50";
  }
}

export function ActionableInsights() {
  const highPriorityItems = insights.filter(insight => insight.priority === "high").length;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Actionable Insights</span>
          <Link 
            to="/actionable-insights" 
            className="text-sm text-brisk-600 hover:underline"
          >
            View all
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[320px] overflow-y-auto">
          {insights.slice(0, 3).map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-md border ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{insight.message}</p>
                  <p className="text-xs mt-1 opacity-80">{insight.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
