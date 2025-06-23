
import Layout from "@/components/layout/Layout";
import { insights } from "@/components/dashboard/ActionableInsights";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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

const ActionableInsightsPage = () => {
  const highPriorityCount = insights.filter(insight => insight.priority === "high").length;
  
  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-brisk-600 mb-4 hover:underline">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-semibold">Actionable Insights</h1>
        <p className="text-neutral-500 mt-1">
          {insights.length} items requiring attention, including {highPriorityCount} high-priority items
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Insights</CardTitle>
          <CardDescription>Items that require your attention based on employee data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-md border ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <p className="text-base font-medium">{insight.message}</p>
                      <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-white/50">
                        {insight.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm opacity-80">
                        <strong>Recommended action:</strong> {insight.action}
                      </p>
                      {insight.employee && (
                        <Link 
                          to={`/employees/${insight.employee.toLowerCase().replace(' ', '-')}`}
                          className="text-sm font-medium text-brisk-600 hover:underline"
                        >
                          View employee profile
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ActionableInsightsPage;
