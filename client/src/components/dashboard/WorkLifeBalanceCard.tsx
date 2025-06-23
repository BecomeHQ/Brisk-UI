import { BurnoutMeter } from "@/components/employees/BurnoutMeter";
import { getHighBurnoutRiskEmployees } from "@/services/mockData";
import { getCalculatedTeamMetrics } from "@/services/employees/attendanceService";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TeamMetrics } from "@/services/employees/types";

export function WorkLifeBalanceCard() {
  const highRiskEmployees = getHighBurnoutRiskEmployees();
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMetrics = async () => {
      try {
        setLoading(true);
        const metrics = await getCalculatedTeamMetrics();
        setTeamMetrics(metrics);
      } catch (error) {
        console.error("Error fetching team metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMetrics();
  }, []);

  if (loading || !teamMetrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-neutral-600">
            Work-Life Balance
          </h3>
          <div className="text-neutral-500">
            <Users size={18} />
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-neutral-500 text-sm">Loading metrics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-neutral-600">
          Work-Life Balance
        </h3>
        <div className="text-neutral-500">
          <Users size={18} />
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <div className="text-2xl font-semibold">
          {teamMetrics.averageWorkLifeBalance}%
        </div>
        <div className="text-xs font-medium flex items-center text-danger">
          ↓ 3%
        </div>
      </div>

      <div className="text-xs text-neutral-500 mb-4">Team average score</div>

      <div className="space-y-4">
        <BurnoutMeter
          score={teamMetrics.averageBurnoutScore}
          label="Team Average Burnout Risk"
          size="md"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">High Risk Employees</h4>
            <Link
              to="/employees"
              className="text-xs text-brisk-600 font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {highRiskEmployees.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {highRiskEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-2 bg-[#FCE4EC] border border-pink-200 rounded-md"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 text-xs">
                        {employee.name.split(" ")[0][0]}
                      </div>
                      <span className="text-xs font-medium">
                        {employee.name}
                      </span>
                    </div>
                    <div className="bg-danger-light text-danger text-xs font-medium px-1.5 py-0.5 rounded">
                      {employee.metrics.burnoutScore}%
                    </div>
                  </div>
                  <div className="ml-7.5 text-xs text-neutral-500 mb-1">
                    {employee.role}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-xs text-neutral-500">
              No high-risk employees
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
