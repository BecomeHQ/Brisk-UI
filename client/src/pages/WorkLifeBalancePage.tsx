import Layout from "@/components/layout/Layout";
import { BurnoutMeter } from "@/components/employees/BurnoutMeter";
import {
  getCalculatedTeamMetrics,
  getHighRiskEmployees,
  HighRiskEmployee,
} from "@/services/employees/attendanceService";
import {
  ArrowLeft,
  Users,
  Clock,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BurnoutRiskChart } from "@/components/dashboard/BurnoutRiskChart";
import { useState, useEffect } from "react";
import { TeamMetrics } from "@/services/employees/types";

const WorkLifeBalancePage = () => {
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics | null>(null);
  const [highRiskEmployees, setHighRiskEmployees] = useState<
    HighRiskEmployee[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both team metrics and high-risk employees
        const [metrics, highRisk] = await Promise.all([
          getCalculatedTeamMetrics(),
          getHighRiskEmployees(),
        ]);

        setTeamMetrics(metrics);
        setHighRiskEmployees(highRisk);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-500">Loading team metrics...</div>
        </div>
      </Layout>
    );
  }

  if (!teamMetrics) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-neutral-500">Failed to load team metrics</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-brisk-600 mb-4 hover:underline"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-semibold">Work-Life Balance</h1>
        <p className="text-neutral-500 mt-1">
          Detailed view of your team's work-life balance metrics and burnout
          risks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Balance Score</CardTitle>
            <CardDescription>
              Overall work-life balance assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-3">
              <div className="text-3xl font-semibold">
                {teamMetrics.averageWorkLifeBalance}%
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Your team's work-life balance score is{" "}
              {teamMetrics.averageWorkLifeBalance < 65 ? "below" : "above"} the
              recommended threshold of 65%.
            </p>
            <BurnoutMeter
              score={teamMetrics.averageBurnoutScore}
              label="Team Average Burnout Risk"
              size="lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Burnout Risk Distribution</CardTitle>
            <CardDescription>Risk levels across departments</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <BurnoutRiskChart />
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Section */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">High Risk Employees</CardTitle>
          <CardDescription>
            Team members with elevated burnout indicators (Burnout Score &gt;
            70%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {highRiskEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highRiskEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-4 bg-white border border-neutral-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 text-sm">
                        {employee.name[0]}
                      </div>
                      <div>
                        <h3 className="font-medium">{employee.name}</h3>
                        <p className="text-xs text-neutral-500">
                          {employee.role}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {employee.department}
                        </p>
                      </div>
                    </div>
                    <div className="bg-danger-light text-danger text-xs font-medium px-2 py-1 rounded">
                      {employee.metrics.burnoutScore}%
                    </div>
                  </div>

                  <BurnoutMeter
                    score={employee.metrics.burnoutScore}
                    showLabel={true}
                    size="md"
                  />

                  <div className="mt-3 text-xs text-neutral-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Weekly hours:</span>
                      <span className="font-medium">
                        {employee.metrics.workHoursThisWeek.toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily average:</span>
                      <span className="font-medium">
                        {employee.metrics.averageDailyHours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late night sessions:</span>
                      <span className="font-medium">
                        {employee.metrics.lateNightCheckins}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overtime days:</span>
                      <span className="font-medium">
                        {employee.metrics.overtimeDays}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work-life balance:</span>
                      <span className="font-medium">
                        {employee.metrics.workLifeBalance}%
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/employees/${employee.id}`}
                    className="mt-4 text-xs text-brisk-600 font-medium hover:underline block text-center"
                  >
                    View employee profile
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-500">
              <div className="mb-2">🎉 No high-risk employees detected!</div>
              <div className="text-sm">
                Your team's burnout risk is well managed.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default WorkLifeBalancePage;
