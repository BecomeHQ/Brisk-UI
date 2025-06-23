import {
  ActionableInsights,
  insights,
} from "@/components/dashboard/ActionableInsights";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TeamLeaveCalendar } from "@/components/dashboard/TeamLeaveCalendar";
import { LeaveManagementDialog } from "@/components/dashboard/LeaveManagementDialog";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { getHighBurnoutRiskEmployees, teamLeaves } from "@/services/mockData";
import { getCalculatedTeamMetrics } from "@/services/employees/attendanceService";
import { apiService } from "@/services/api";
import {
  AlertCircle,
  CalendarCheck,
  Calendar,
  Clock,
  Download,
  Users,
  Activity,
  Moon,
  TrendingUp,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { TeamMetrics } from "@/services/employees/types";

const Dashboard = () => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState<string[]>(
    []
  );
  const [employeesOnLeaveNextWeek, setEmployeesOnLeaveNextWeek] = useState<
    string[]
  >([]);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [teamMetrics, setTeamMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextWeekLoading, setNextWeekLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [teamMetricsLoading, setTeamMetricsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextWeekError, setNextWeekError] = useState<string | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [teamMetricsError, setTeamMetricsError] = useState<string | null>(null);

  const highRiskEmployees = getHighBurnoutRiskEmployees();

  // Get today's date
  const today = new Date();

  // Fetch calculated team metrics
  useEffect(() => {
    const fetchTeamMetrics = async () => {
      try {
        setTeamMetricsLoading(true);
        const metrics = await getCalculatedTeamMetrics();
        setTeamMetrics(metrics);
      } catch (error) {
        console.error("Error fetching team metrics:", error);
        setTeamMetricsError("Failed to fetch team metrics");
      } finally {
        setTeamMetricsLoading(false);
      }
    };

    fetchTeamMetrics();
  }, []);

  // Fetch employees on leave today from MongoDB
  useEffect(() => {
    const fetchEmployeesOnLeaveToday = async () => {
      try {
        setLoading(true);
        const response = await apiService.getEmployeesOnLeaveToday();

        if (response.error) {
          setError(response.error);
        } else {
          setEmployeesOnLeaveToday(response.data || []);
        }
      } catch (err) {
        setError("Failed to fetch employees on leave today");
        console.error("Error fetching employees on leave today:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesOnLeaveToday();
  }, []);

  // Fetch employees on leave next week from MongoDB
  useEffect(() => {
    const fetchEmployeesOnLeaveNextWeek = async () => {
      try {
        setNextWeekLoading(true);
        const response = await apiService.getEmployeesOnLeaveNextWeek();

        if (response.error) {
          setNextWeekError(response.error);
        } else {
          setEmployeesOnLeaveNextWeek(response.data || []);
        }
      } catch (err) {
        setNextWeekError("Failed to fetch employees on leave next week");
        console.error("Error fetching employees on leave next week:", err);
      } finally {
        setNextWeekLoading(false);
      }
    };

    fetchEmployeesOnLeaveNextWeek();
  }, []);

  // Fetch pending leave requests from MongoDB
  useEffect(() => {
    const fetchPendingLeaveRequests = async () => {
      try {
        setPendingLoading(true);
        const response = await apiService.getPendingLeaveRequests();

        if (response.error) {
          setPendingError(response.error);
        } else {
          setPendingLeaveRequests(response.data || []);
        }
      } catch (err) {
        setPendingError("Failed to fetch pending leave requests");
        console.error("Error fetching pending leave requests:", err);
      } finally {
        setPendingLoading(false);
      }
    };

    fetchPendingLeaveRequests();
  }, []);

  // Fetch attendance statistics from MongoDB
  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        setAttendanceLoading(true);
        const response = await apiService.getTodayAttendanceStats();

        if (response.error) {
          setAttendanceError(response.error);
        } else {
          setAttendanceStats(response.data);
        }
      } catch (err) {
        setAttendanceError("Failed to fetch attendance statistics");
        console.error("Error fetching attendance statistics:", err);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendanceStats();
  }, []);

  return (
    <Layout noPadding>
      <div className="dashboard-container">
        <div className="px-6 pt-6 pb-6 space-y-6">
          <div className="mb-3">
            <p className="text-neutral-600">
              Here's the pulse of your team for the week of{" "}
              {format(today, "MMMM d, yyyy")}
            </p>
          </div>

          {/* High priority leave metrics - First row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link to="#" className="block h-full">
              <MetricCard
                title="On Leave Today"
                value={loading ? "..." : employeesOnLeaveToday.length}
                subtitle={
                  loading
                    ? "Loading..."
                    : employeesOnLeaveToday.length > 0
                    ? `${employeesOnLeaveToday.slice(0, 2).join(", ")}${
                        employeesOnLeaveToday.length > 2
                          ? ` +${employeesOnLeaveToday.length - 2} more`
                          : ""
                      }`
                    : "No one is on leave today"
                }
                icon={<CalendarCheck size={18} />}
                variant={
                  employeesOnLeaveToday.length > 3 ? "warning" : "default"
                }
              />
            </Link>

            <Link to="#" className="block h-full">
              <MetricCard
                title="On Leave Next Week"
                value={
                  nextWeekLoading ? "..." : employeesOnLeaveNextWeek.length
                }
                subtitle={
                  nextWeekLoading
                    ? "Loading..."
                    : employeesOnLeaveNextWeek.length > 0
                    ? `${employeesOnLeaveNextWeek.slice(0, 2).join(", ")}${
                        employeesOnLeaveNextWeek.length > 2
                          ? ` +${employeesOnLeaveNextWeek.length - 2} more`
                          : ""
                      }`
                    : "No planned leaves next week"
                }
                icon={<Calendar size={18} />}
                variant={
                  employeesOnLeaveNextWeek.length > 5 ? "warning" : "default"
                }
              />
            </Link>

            <div
              className="block h-full cursor-pointer"
              onClick={() => setIsLeaveDialogOpen(true)}
            >
              <MetricCard
                title="Leaves To Approve"
                value={pendingLoading ? "..." : pendingLeaveRequests.length}
                subtitle={
                  pendingLoading
                    ? "Loading..."
                    : pendingLeaveRequests.length > 0
                    ? `${pendingLeaveRequests
                        .slice(0, 2)
                        .map((r) => r.username)
                        .join(", ")}${
                        pendingLeaveRequests.length > 2
                          ? ` +${pendingLeaveRequests.length - 2} more`
                          : ""
                      }`
                    : "No pending approvals"
                }
                icon={<Clock size={18} />}
                variant={
                  pendingLeaveRequests.length > 0 ? "warning" : "success"
                }
              />
            </div>

            <MetricCard
              title="Checked-in Today"
              value={
                attendanceLoading
                  ? "..."
                  : attendanceStats
                  ? `${attendanceStats.checkedInCount}/${attendanceStats.availableEmployees}`
                  : "0/0"
              }
              subtitle={
                attendanceLoading
                  ? "Loading..."
                  : attendanceStats
                  ? `${attendanceStats.attendancePercentage}% of team present`
                  : "0% of team present"
              }
              icon={<UserCheck size={18} />}
              trend={
                attendanceStats && attendanceStats.checkedInCount > 0
                  ? {
                      value: attendanceStats.checkedInCount,
                      positive: true,
                    }
                  : undefined
              }
              variant={
                attendanceStats && attendanceStats.attendancePercentage < 70
                  ? "warning"
                  : "success"
              }
            />
          </div>

          {/* Normal metric cards with updated light shade styling */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link to="/work-life-balance" className="block h-full">
              <MetricCard
                title="High Burnout Risk"
                value={
                  teamMetricsLoading
                    ? "..."
                    : teamMetrics?.activeBurnoutRisks || 0
                }
                subtitle={
                  teamMetricsLoading
                    ? "Loading..."
                    : `${teamMetrics?.burnoutRiskPercentage || 0}% of team`
                }
                icon={<AlertCircle size={16} />}
                variant="light-rose"
              />
            </Link>

            <Link to="/work-life-balance" className="block h-full">
              <MetricCard
                title="Work-Life Balance"
                value={
                  teamMetricsLoading
                    ? "..."
                    : `${teamMetrics?.averageWorkLifeBalance || 0}%`
                }
                subtitle="Team average score"
                icon={<Activity size={16} />}
                variant="light-mint"
              />
            </Link>

            <MetricCard
              title="Weekend Workers"
              value={
                teamMetricsLoading ? "..." : teamMetrics?.weekendWorkers || 0
              }
              subtitle={
                teamMetricsLoading
                  ? "Loading..."
                  : `${teamMetrics?.weekendWorkersPercentage || 0}% of team`
              }
              icon={<TrendingUp size={16} />}
              variant="light-sky"
            />

            <MetricCard
              title="Late Night Check-ins"
              value={
                teamMetricsLoading ? "..." : teamMetrics?.lateNightCheckins || 0
              }
              subtitle="Users who checked in after 7 PM this week"
              icon={<Moon size={16} />}
              variant="light-lavender"
            />

            <Link className="block h-full">
              <MetricCard
                title="Actionable Insights"
                value={insights.length}
                subtitle="Employees needing attention"
                icon={<AlertCircle size={16} />}
                variant="light-peach"
              />
            </Link>
          </div>

          {/* Team Leave Calendar with added border for visibility */}
          <div className="border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
            <TeamLeaveCalendar />
          </div>
        </div>
      </div>

      {/* Leave Management Dialog */}
      <LeaveManagementDialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
      />
    </Layout>
  );
};
export default Dashboard;
