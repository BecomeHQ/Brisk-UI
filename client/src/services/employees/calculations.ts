import { TeamMetrics } from "./types";

// Interface for attendance data
export interface AttendanceRecord {
  _id: string;
  user: string;
  checkinTime: string;
  checkoutTime: string;
  date: string;
}

// Interface for daily metrics
export interface DailyMetrics {
  workingHours: number;
  isLateNight: boolean;
  isOvertime: boolean;
  overtimeHours: number;
}

// Interface for weekly metrics
export interface WeeklyMetrics {
  totalWorkingHours: number;
  averageDailyHours: number;
  lateNightSessions: number;
  overtimeDays: number;
  totalOvertimeHours: number;
  burnoutRiskScore: number;
  workLifeBalanceScore: number;
}

// Calculate working hours from check-in and check-out times
export const calculateWorkingHours = (
  checkinTime: string,
  checkoutTime: string
): number => {
  if (!checkinTime || !checkoutTime) return 0;

  try {
    const convertTimeToMinutes = (time: string): number => {
      const parts = time.split(":");
      if (parts.length < 2) return 0;

      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;

      return hours * 60 + minutes + seconds / 60;
    };

    const checkinMinutes = convertTimeToMinutes(checkinTime);
    const checkoutMinutes = convertTimeToMinutes(checkoutTime);

    // Handle case where checkout is next day (e.g., 21:00 to 02:00)
    let totalMinutes;
    if (checkoutMinutes >= checkinMinutes) {
      totalMinutes = checkoutMinutes - checkinMinutes;
    } else {
      // Crosses midnight
      totalMinutes = 24 * 60 - checkinMinutes + checkoutMinutes;
    }

    const hours = totalMinutes / 60;
    return isNaN(hours) ? 0 : Math.max(0, hours); // Ensure non-negative and valid
  } catch (error) {
    console.error("Error calculating working hours:", error);
    return 0;
  }
};

// Check if work session is late night (after 7 PM or before 6 AM)
export const isLateNightWork = (
  checkinTime: string,
  checkoutTime: string
): boolean => {
  try {
    const convertTimeToHours = (time: string): number => {
      const parts = time.split(":");
      if (parts.length < 2) return 0;

      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;

      return hours + minutes / 60;
    };

    const checkinHours = convertTimeToHours(checkinTime);
    const checkoutHours = convertTimeToHours(checkoutTime);

    // Late night: after 7 PM (19:00) or before 6 AM (6:00)
    const isLateNight =
      checkinHours >= 19 ||
      checkinHours < 6 ||
      checkoutHours >= 19 ||
      checkoutHours < 6;

    return isLateNight;
  } catch (error) {
    console.error("Error checking late night work:", error);
    return false;
  }
};

// Check if check-in time is after 7 PM
export const isLateNightCheckin = (checkinTime: string): boolean => {
  try {
    const convertTimeToHours = (time: string): number => {
      const parts = time.split(":");
      if (parts.length < 2) return 0;

      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;

      return hours + minutes / 60;
    };

    const checkinHours = convertTimeToHours(checkinTime);

    // Late night check-in: after 7 PM (19:00)
    return checkinHours >= 19;
  } catch (error) {
    console.error("Error checking late night check-in:", error);
    return false;
  }
};

// Calculate daily metrics for a single day
export const calculateDailyMetrics = (
  attendanceRecords: AttendanceRecord[]
): DailyMetrics => {
  let totalWorkingHours = 0;
  let hasLateNightWork = false;

  // Sum up all working hours for the day
  attendanceRecords.forEach((record) => {
    const hours = calculateWorkingHours(
      record.checkinTime,
      record.checkoutTime
    );
    totalWorkingHours += hours;

    if (isLateNightWork(record.checkinTime, record.checkoutTime)) {
      hasLateNightWork = true;
    }
  });

  const isOvertime = totalWorkingHours > 8;
  const overtimeHours = isOvertime ? totalWorkingHours - 8 : 0;

  return {
    workingHours: totalWorkingHours,
    isLateNight: hasLateNightWork,
    isOvertime: isOvertime,
    overtimeHours: overtimeHours,
  };
};

// Calculate weekly metrics for a user
export const calculateWeeklyMetrics = (
  attendanceRecords: AttendanceRecord[]
): WeeklyMetrics => {
  // Get records from the past 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyRecords = attendanceRecords.filter((record) => {
    try {
      const recordDate = new Date(record.date);
      return recordDate >= weekAgo;
    } catch (error) {
      console.error("Error parsing date:", record.date, error);
      return false;
    }
  });

  // Group by date
  const dailyRecords = weeklyRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  // Calculate metrics for each day
  const dailyMetrics: DailyMetrics[] = [];
  let totalWorkingHours = 0;
  let lateNightSessions = 0;
  let overtimeDays = 0;
  let totalOvertimeHours = 0;

  Object.values(dailyRecords).forEach((dayRecords) => {
    const dayMetrics = calculateDailyMetrics(dayRecords);
    dailyMetrics.push(dayMetrics);

    totalWorkingHours += dayMetrics.workingHours;
    if (dayMetrics.isLateNight) lateNightSessions++;
    if (dayMetrics.isOvertime) {
      overtimeDays++;
      totalOvertimeHours += dayMetrics.overtimeHours;
    }
  });

  const averageDailyHours =
    dailyMetrics.length > 0 ? totalWorkingHours / dailyMetrics.length : 0;

  // Calculate burnout risk score (0-100)
  let burnoutRiskScore = 0;

  // Base risk from average daily hours (8 hours is standard)
  if (averageDailyHours > 10) burnoutRiskScore += 40; // More than 10 hours/day
  else if (averageDailyHours > 9)
    burnoutRiskScore += 30; // More than 9 hours/day
  else if (averageDailyHours > 8)
    burnoutRiskScore += 20; // More than 8 hours/day
  else if (averageDailyHours < 6) burnoutRiskScore += 10; // Less than 6 hours/day

  // Risk from overtime days (days working more than 8 hours)
  const overtimeDayPercentage =
    dailyMetrics.length > 0 ? (overtimeDays / dailyMetrics.length) * 100 : 0;
  burnoutRiskScore += Math.min(overtimeDayPercentage * 0.5, 30);

  // Risk from late night work
  burnoutRiskScore += Math.min(lateNightSessions * 15, 30);

  // Cap at 100
  burnoutRiskScore = Math.min(burnoutRiskScore, 100);

  // Calculate work-life balance score (0-100)
  let workLifeBalanceScore = 100;

  // Deduct points for overtime
  workLifeBalanceScore -= Math.min(overtimeDayPercentage * 0.4, 30);

  // Deduct points for late night work
  workLifeBalanceScore -= Math.min(lateNightSessions * 10, 40);

  // Deduct points for excessive daily hours
  if (averageDailyHours > 10) workLifeBalanceScore -= 25;
  else if (averageDailyHours > 9) workLifeBalanceScore -= 20;
  else if (averageDailyHours > 8) workLifeBalanceScore -= 15;

  // Ensure score is between 0 and 100
  workLifeBalanceScore = Math.max(0, Math.min(100, workLifeBalanceScore));

  return {
    totalWorkingHours,
    averageDailyHours,
    lateNightSessions,
    overtimeDays,
    totalOvertimeHours,
    burnoutRiskScore: Math.round(burnoutRiskScore),
    workLifeBalanceScore: Math.round(workLifeBalanceScore),
  };
};

// Calculate team metrics from all employees' attendance data
export const calculateTeamMetrics = (
  allAttendanceData: Record<string, AttendanceRecord[]>
): TeamMetrics => {
  const employeeMetrics: WeeklyMetrics[] = [];

  // Calculate metrics for each employee
  Object.values(allAttendanceData).forEach((employeeRecords) => {
    if (employeeRecords && employeeRecords.length > 0) {
      const metrics = calculateWeeklyMetrics(employeeRecords);
      employeeMetrics.push(metrics);
    }
  });

  // Calculate team averages
  const totalEmployees = employeeMetrics.length;
  if (totalEmployees === 0) {
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

  const averageWorkHours =
    employeeMetrics.reduce(
      (sum, metrics) =>
        sum +
        (isNaN(metrics.averageDailyHours) ? 0 : metrics.averageDailyHours),
      0
    ) / totalEmployees;
  const averageBurnoutScore =
    employeeMetrics.reduce(
      (sum, metrics) =>
        sum + (isNaN(metrics.burnoutRiskScore) ? 0 : metrics.burnoutRiskScore),
      0
    ) / totalEmployees;
  const averageWorkLifeBalance =
    employeeMetrics.reduce(
      (sum, metrics) =>
        sum +
        (isNaN(metrics.workLifeBalanceScore)
          ? 0
          : metrics.workLifeBalanceScore),
      0
    ) / totalEmployees;

  // Calculate unique users with late night check-ins (after 7 PM)
  const lateNightCheckins =
    calculateLateNightCheckinsByUsers(allAttendanceData);

  const highBurnoutRiskEmployees = employeeMetrics.filter(
    (metrics) => metrics.burnoutRiskScore > 70
  ).length;

  return {
    averageWorkHours:
      Math.round((isNaN(averageWorkHours) ? 0 : averageWorkHours) * 10) / 10,
    averageBurnoutScore: Math.round(
      isNaN(averageBurnoutScore) ? 0 : averageBurnoutScore
    ),
    averageWorkLifeBalance: Math.round(
      isNaN(averageWorkLifeBalance) ? 0 : averageWorkLifeBalance
    ),
    pendingLeaveRequests: 0, // This would come from leave data
    activeBurnoutRisks: highBurnoutRiskEmployees,
    employeeLeavesToday: 0, // This would come from leave data
    employeeCheckIns: totalEmployees,
    totalEmployees,
    leavePercentage: 0, // This would come from leave data
    burnoutRiskPercentage: Math.round(
      (highBurnoutRiskEmployees / totalEmployees) * 100
    ),
    weekendWorkers: 0, // This would need weekend attendance data
    weekendWorkersPercentage: 0,
    lateNightCheckins: lateNightCheckins,
    yesterdayCheckins: totalEmployees, // Simplified for now
  };
};

// Calculate unique users with late night check-ins for the whole week
export const calculateLateNightCheckinsByUsers = (
  allAttendanceData: Record<string, AttendanceRecord[]>
): number => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const usersWithLateNightCheckins = new Set<string>();

  // Iterate through all employees
  Object.entries(allAttendanceData).forEach(([userId, attendanceRecords]) => {
    // Filter records from the past 7 days
    const weeklyRecords = attendanceRecords.filter((record) => {
      try {
        const recordDate = new Date(record.date);
        return recordDate >= weekAgo;
      } catch (error) {
        console.error("Error parsing date:", record.date, error);
        return false;
      }
    });

    // Check if this user has any late night check-ins
    const hasLateNightCheckin = weeklyRecords.some((record) =>
      isLateNightCheckin(record.checkinTime)
    );

    if (hasLateNightCheckin) {
      usersWithLateNightCheckins.add(userId);
    }
  });

  return usersWithLateNightCheckins.size;
};
