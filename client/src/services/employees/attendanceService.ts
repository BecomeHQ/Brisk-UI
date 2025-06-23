import { apiService } from "../api";
import {
  calculateTeamMetrics,
  AttendanceRecord,
  calculateWeeklyMetrics,
} from "./calculations";
import { TeamMetrics } from "./types";

// Interface for high-risk employee data
export interface HighRiskEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  metrics: {
    workHoursThisWeek: number;
    lateNightCheckins: number;
    burnoutScore: number;
    workLifeBalance: number;
    averageDailyHours: number;
    overtimeDays: number;
    totalOvertimeHours: number;
  };
}

// Get high-risk employees based on calculated metrics
export const getHighRiskEmployees = async (): Promise<HighRiskEmployee[]> => {
  try {
    // First, get all users
    const usersResponse = await apiService.getAllUsers();
    if (usersResponse.error || !usersResponse.data) {
      console.error("Failed to fetch users:", usersResponse.error);
      return [];
    }

    const users = usersResponse.data;
    const highRiskEmployees: HighRiskEmployee[] = [];

    // Calculate metrics for each user
    for (const user of users) {
      try {
        const userId = user.slackId || user.user || user.username;
        if (!userId) {
          console.warn("User without ID:", user);
          continue;
        }

        // Get attendance data for this user
        const attendanceResponse = await apiService.getAttendanceByUser(userId);
        if (!attendanceResponse.error && attendanceResponse.data) {
          const attendanceRecords: AttendanceRecord[] =
            attendanceResponse.data.map((record: any) => ({
              _id: record._id || "",
              user: record.user || userId,
              checkinTime: record.checkinTime || "",
              checkoutTime: record.checkoutTime || "",
              date: record.date || "",
            }));

          // Calculate weekly metrics
          const weeklyMetrics = calculateWeeklyMetrics(attendanceRecords);

          // Check if employee is high risk (burnout score > 70)
          if (weeklyMetrics.burnoutRiskScore > 70) {
            highRiskEmployees.push({
              id: userId,
              name: user.username || user.name || userId,
              role: user.role || "Employee",
              department: user.department || "General",
              metrics: {
                workHoursThisWeek: weeklyMetrics.totalWorkingHours,
                lateNightCheckins: weeklyMetrics.lateNightSessions,
                burnoutScore: weeklyMetrics.burnoutRiskScore,
                workLifeBalance: weeklyMetrics.workLifeBalanceScore,
                averageDailyHours: weeklyMetrics.averageDailyHours,
                overtimeDays: weeklyMetrics.overtimeDays,
                totalOvertimeHours: weeklyMetrics.totalOvertimeHours,
              },
            });
          }
        }
      } catch (error) {
        console.warn(
          `Failed to process user ${user.slackId || user.user}:`,
          error
        );
      }
    }

    // Sort by burnout score (highest first)
    highRiskEmployees.sort(
      (a, b) => b.metrics.burnoutScore - a.metrics.burnoutScore
    );

    console.log(`Found ${highRiskEmployees.length} high-risk employees`);
    return highRiskEmployees;
  } catch (error) {
    console.error("Error getting high-risk employees:", error);
    return [];
  }
};

// Fetch all attendance data for all users
export const fetchAllAttendanceData = async (): Promise<
  Record<string, AttendanceRecord[]>
> => {
  try {
    // First, get all users to know which users to fetch attendance for
    const usersResponse = await apiService.getAllUsers();
    if (usersResponse.error || !usersResponse.data) {
      console.error("Failed to fetch users:", usersResponse.error);
      return {};
    }

    const users = usersResponse.data;
    console.log("Found users:", users.length);

    const attendanceData: Record<string, AttendanceRecord[]> = {};

    // Fetch attendance data for each user
    for (const user of users) {
      try {
        const userId = user.slackId || user.user || user.username;
        if (!userId) {
          console.warn("User without ID:", user);
          continue;
        }

        const attendanceResponse = await apiService.getAttendanceByUser(userId);
        if (!attendanceResponse.error && attendanceResponse.data) {
          console.log(
            `Fetched ${attendanceResponse.data.length} attendance records for user ${userId}`
          );

          attendanceData[userId] = attendanceResponse.data.map(
            (record: any) => ({
              _id: record._id || "",
              user: record.user || userId,
              checkinTime: record.checkinTime || "",
              checkoutTime: record.checkoutTime || "",
              date: record.date || "",
            })
          );
        } else {
          console.warn(
            `No attendance data for user ${userId}:`,
            attendanceResponse.error
          );
        }
      } catch (error) {
        console.warn(
          `Failed to fetch attendance for user ${user.slackId || user.user}:`,
          error
        );
      }
    }

    console.log(
      "Total users with attendance data:",
      Object.keys(attendanceData).length
    );
    return attendanceData;
  } catch (error) {
    console.error("Error fetching all attendance data:", error);
    return {};
  }
};

// Fetch today's attendance data
export const fetchTodayAttendanceData = async (): Promise<
  Record<string, AttendanceRecord[]>
> => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const response = await apiService.getAttendanceByDate(todayString);
    if (!response.error && response.data) {
      const attendanceData: Record<string, AttendanceRecord[]> = {};

      response.data.forEach((record: any) => {
        if (!attendanceData[record.user]) {
          attendanceData[record.user] = [];
        }
        attendanceData[record.user].push({
          _id: record._id || "",
          user: record.user || "",
          checkinTime: record.checkinTime || "",
          checkoutTime: record.checkoutTime || "",
          date: record.date || todayString,
        });
      });

      return attendanceData;
    }

    return {};
  } catch (error) {
    console.error("Error fetching today's attendance data:", error);
    return {};
  }
};

// Fetch attendance data for all users for the current week
export const fetchWeeklyAttendanceData = async (): Promise<
  Record<string, AttendanceRecord[]>
> => {
  try {
    // Get current date and week ago date
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Format dates for API calls
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    // Fetch attendance data for each day of the past week
    const attendanceData: Record<string, AttendanceRecord[]> = {};

    for (let d = new Date(weekAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d);
      try {
        const response = await apiService.getAttendanceByDate(dateStr);
        if (!response.error && response.data) {
          // Group by user
          response.data.forEach((record: any) => {
            if (!attendanceData[record.user]) {
              attendanceData[record.user] = [];
            }
            attendanceData[record.user].push({
              _id: record._id || "",
              user: record.user || "",
              checkinTime: record.checkinTime || "",
              checkoutTime: record.checkoutTime || "",
              date: record.date || dateStr,
            });
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch attendance for ${dateStr}:`, error);
      }
    }

    return attendanceData;
  } catch (error) {
    console.error("Error fetching weekly attendance data:", error);
    return {};
  }
};

// Get calculated team metrics based on real attendance data
export const getCalculatedTeamMetrics = async (): Promise<TeamMetrics> => {
  try {
    console.log("Starting team metrics calculation...");

    // Use all attendance data for more comprehensive metrics
    const attendanceData = await fetchAllAttendanceData();
    console.log("Attendance data structure:", {
      totalUsers: Object.keys(attendanceData).length,
      sampleUser: Object.keys(attendanceData)[0],
      sampleRecords:
        attendanceData[Object.keys(attendanceData)[0]]?.length || 0,
    });

    // Also get today's attendance stats for additional metrics
    const todayStatsResponse = await apiService.getTodayAttendanceStats();
    const todayStats = todayStatsResponse.data;

    const teamMetrics = calculateTeamMetrics(attendanceData);
    console.log("Calculated team metrics:", teamMetrics);

    // Update with real-time data if available
    if (todayStats) {
      teamMetrics.employeeCheckIns = todayStats.checkedInCount || 0;
      teamMetrics.totalEmployees = todayStats.totalEmployees || 0;
      teamMetrics.yesterdayCheckins = todayStats.checkedInCount || 0;
    }

    return teamMetrics;
  } catch (error) {
    console.error("Error calculating team metrics:", error);
    // Return default metrics if calculation fails
    return {
      averageWorkHours: 0,
      averageBurnoutScore: 0,
      averageWorkLifeBalance: 0,
      pendingLeaveRequests: 0,
      activeBurnoutRisks: 0,
      employeeLeavesToday: 0,
      employeeCheckIns: 0,
      totalEmployees: 0,
      leavePercentage: 0,
      burnoutRiskPercentage: 0,
      weekendWorkers: 0,
      weekendWorkersPercentage: 0,
      lateNightCheckins: 0,
      yesterdayCheckins: 0,
    };
  }
};

// Get individual employee metrics
export const getEmployeeMetrics = async (userId: string) => {
  try {
    const response = await apiService.getAttendanceByUser(userId);
    if (!response.error && response.data) {
      const attendanceRecords: AttendanceRecord[] = response.data.map(
        (record: any) => ({
          _id: record._id || "",
          user: record.user || userId,
          checkinTime: record.checkinTime || "",
          checkoutTime: record.checkoutTime || "",
          date: record.date || "",
        })
      );

      // Import the calculation function
      const { calculateWeeklyMetrics } = await import("./calculations");
      return calculateWeeklyMetrics(attendanceRecords);
    }
    return null;
  } catch (error) {
    console.error("Error fetching employee metrics:", error);
    return null;
  }
};
