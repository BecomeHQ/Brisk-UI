import {
  calculateWorkingHours,
  isLateNightWork,
  isLateNightCheckin,
  calculateDailyMetrics,
  calculateWeeklyMetrics,
  calculateTeamMetrics,
  calculateLateNightCheckinsByUsers,
  AttendanceRecord,
} from "./calculations";

// Debug function to test calculations with sample data
export const debugCalculations = () => {
  console.log("=== Debugging Calculations ===\n");

  // Test with your specific data
  const testRecord: AttendanceRecord = {
    _id: "684abd903a97c9645c4549b6",
    user: "U05E5KBAT26",
    checkinTime: "17:14:16",
    checkoutTime: "17:14:28",
    date: "2025-06-12",
  };

  console.log("Test record:", testRecord);

  // Test working hours calculation
  const hours = calculateWorkingHours(
    testRecord.checkinTime,
    testRecord.checkoutTime
  );
  console.log(
    "Working hours:",
    hours,
    "Type:",
    typeof hours,
    "Is NaN:",
    isNaN(hours)
  );

  // Test late night detection
  const isLate = isLateNightWork(
    testRecord.checkinTime,
    testRecord.checkoutTime
  );
  console.log("Is late night:", isLate);

  // Test daily metrics
  const dailyMetrics = calculateDailyMetrics([testRecord]);
  console.log("Daily metrics:", dailyMetrics);

  // Test weekly metrics
  const weeklyMetrics = calculateWeeklyMetrics([testRecord]);
  console.log("Weekly metrics:", weeklyMetrics);

  // Test team metrics
  const teamData = {
    U05E5KBAT26: [testRecord],
  };
  const teamMetrics = calculateTeamMetrics(teamData);
  console.log("Team metrics:", teamMetrics);

  return {
    hours,
    isLate,
    dailyMetrics,
    weeklyMetrics,
    teamMetrics,
  };
};

// Example usage with the provided data structure
export const exampleCalculation = () => {
  const sampleAttendanceData: Record<string, AttendanceRecord[]> = {
    U05E5KBAT26: [
      {
        _id: "684abd903a97c9645c4549b6",
        user: "U05E5KBAT26",
        checkinTime: "09:00:00",
        checkoutTime: "17:00:00",
        date: "2025-01-13",
      },
      {
        _id: "684abd903a97c9645c4549b7",
        user: "U05E5KBAT26",
        checkinTime: "08:30:00",
        checkoutTime: "18:30:00",
        date: "2025-01-14",
      },
      {
        _id: "684abd903a97c9645c4549b8",
        user: "U05E5KBAT26",
        checkinTime: "21:00:00",
        checkoutTime: "02:00:00",
        date: "2025-01-15",
      },
    ],
  };

  const teamMetrics = calculateTeamMetrics(sampleAttendanceData);

  console.log("Team Balance Score:", teamMetrics.averageWorkLifeBalance + "%");
  console.log(
    "Team Average Burnout Risk:",
    teamMetrics.averageBurnoutScore + "%"
  );
  console.log("Average Work Hours:", teamMetrics.averageWorkHours + "h/day");
  console.log("Late Night Sessions:", teamMetrics.lateNightCheckins);
  console.log("High Risk Employees:", teamMetrics.activeBurnoutRisks);

  return teamMetrics;
};

// Example calculations for individual metrics
export const demonstrateCalculations = () => {
  console.log("=== Work-Life Balance Calculation Examples ===\n");

  // Example 1: Normal workday (8 hours)
  const normalHours = calculateWorkingHours("09:00:00", "17:00:00");
  console.log("Normal workday (9 AM - 5 PM):", normalHours + " hours");

  // Example 2: Overtime workday (10 hours)
  const overtimeHours = calculateWorkingHours("08:30:00", "18:30:00");
  console.log(
    "Overtime workday (8:30 AM - 6:30 PM):",
    overtimeHours + " hours"
  );

  // Example 3: Late night session (5 hours)
  const lateNightHours = calculateWorkingHours("21:00:00", "02:00:00");
  console.log("Late night session (9 PM - 2 AM):", lateNightHours + " hours");

  // Example 4: Late night detection
  const isLateNight = isLateNightWork("21:00:00", "02:00:00");
  console.log("Is late night work (9 PM - 2 AM):", isLateNight);

  // Example 5: Daily metrics calculation
  const dailyRecords: AttendanceRecord[] = [
    {
      _id: "1",
      user: "U05E5KBAT26",
      checkinTime: "09:00:00",
      checkoutTime: "17:00:00",
      date: "2025-01-13",
    },
    {
      _id: "2",
      user: "U05E5KBAT26",
      checkinTime: "08:30:00",
      checkoutTime: "18:30:00",
      date: "2025-01-14",
    },
    {
      _id: "3",
      user: "U05E5KBAT26",
      checkinTime: "21:00:00",
      checkoutTime: "02:00:00",
      date: "2025-01-15",
    },
  ];

  const weeklyMetrics = calculateWeeklyMetrics(dailyRecords);
  console.log("\nWeekly Metrics:");
  console.log("- Total working hours:", weeklyMetrics.totalWorkingHours);
  console.log(
    "- Average daily hours:",
    weeklyMetrics.averageDailyHours.toFixed(2)
  );
  console.log("- Late night sessions:", weeklyMetrics.lateNightSessions);
  console.log("- Overtime days:", weeklyMetrics.overtimeDays);
  console.log("- Total overtime hours:", weeklyMetrics.totalOvertimeHours);
  console.log("- Burnout risk score:", weeklyMetrics.burnoutRiskScore + "%");
  console.log(
    "- Work-life balance score:",
    weeklyMetrics.workLifeBalanceScore + "%"
  );

  return {
    normalHours,
    overtimeHours,
    lateNightHours,
    isLateNight,
    weeklyMetrics,
  };
};

// Example with your specific data structure
export const demonstrateWithYourData = () => {
  console.log("=== Your Specific Data Example ===\n");

  // Your provided data
  const yourRecord: AttendanceRecord = {
    _id: "684abd903a97c9645c4549b6",
    user: "U05E5KBAT26",
    checkinTime: "17:14:16",
    checkoutTime: "17:14:28",
    date: "2025-06-12",
  };

  // Calculate working hours
  const workingHours = calculateWorkingHours(
    yourRecord.checkinTime,
    yourRecord.checkoutTime
  );
  console.log("Working hours:", workingHours + " hours");

  // Check if late night
  const isLateNight = isLateNightWork(
    yourRecord.checkinTime,
    yourRecord.checkoutTime
  );
  console.log("Is late night work:", isLateNight);

  // Check if overtime (more than 8 hours)
  const isOvertime = workingHours > 8;
  console.log("Is overtime (>8 hours):", isOvertime);

  // Calculate daily metrics
  const dailyMetrics = calculateDailyMetrics([yourRecord]);
  console.log("\nDaily Metrics:");
  console.log("- Working hours:", dailyMetrics.workingHours);
  console.log("- Is late night:", dailyMetrics.isLateNight);
  console.log("- Is overtime:", dailyMetrics.isOvertime);
  console.log("- Overtime hours:", dailyMetrics.overtimeHours);

  return {
    workingHours,
    isLateNight,
    isOvertime,
    dailyMetrics,
  };
};

// Test the new late night check-in calculation
export const testLateNightCheckinsByUsers = () => {
  console.log("=== Testing Late Night Check-ins by Users ===\n");

  // Sample data with multiple users and some late night check-ins
  const sampleAttendanceData: Record<string, AttendanceRecord[]> = {
    user1: [
      {
        _id: "1",
        user: "user1",
        checkinTime: "09:00:00",
        checkoutTime: "17:00:00",
        date: "2025-01-13",
      },
      {
        _id: "2",
        user: "user1",
        checkinTime: "20:00:00", // Late night check-in after 7 PM
        checkoutTime: "23:00:00",
        date: "2025-01-14",
      },
    ],
    user2: [
      {
        _id: "3",
        user: "user2",
        checkinTime: "08:30:00",
        checkoutTime: "18:30:00",
        date: "2025-01-13",
      },
      {
        _id: "4",
        user: "user2",
        checkinTime: "19:30:00", // Late night check-in after 7 PM
        checkoutTime: "22:30:00",
        date: "2025-01-15",
      },
    ],
    user3: [
      {
        _id: "5",
        user: "user3",
        checkinTime: "09:00:00",
        checkoutTime: "17:00:00",
        date: "2025-01-13",
      },
      {
        _id: "6",
        user: "user3",
        checkinTime: "10:00:00", // Normal check-in time
        checkoutTime: "18:00:00",
        date: "2025-01-16",
      },
    ],
    user4: [
      {
        _id: "7",
        user: "user4",
        checkinTime: "21:00:00", // Late night check-in after 7 PM
        checkoutTime: "01:00:00",
        date: "2025-01-17",
      },
    ],
  };

  // Test individual late night check-in detection
  console.log("Testing individual late night check-in detection:");
  console.log("20:00:00 is late night:", isLateNightCheckin("20:00:00")); // Should be true
  console.log("19:30:00 is late night:", isLateNightCheckin("19:30:00")); // Should be true
  console.log("19:00:00 is late night:", isLateNightCheckin("19:00:00")); // Should be true
  console.log("18:59:00 is late night:", isLateNightCheckin("18:59:00")); // Should be false
  console.log("10:00:00 is late night:", isLateNightCheckin("10:00:00")); // Should be false

  // Test the new function
  const uniqueUsersWithLateNightCheckins =
    calculateLateNightCheckinsByUsers(sampleAttendanceData);

  console.log("\nResults:");
  console.log("Total users in data:", Object.keys(sampleAttendanceData).length);
  console.log(
    "Users with late night check-ins (after 7 PM):",
    uniqueUsersWithLateNightCheckins
  );

  // Expected: user1, user2, and user4 have late night check-ins, user3 doesn't
  console.log("Expected result: 3 users (user1, user2, user4)");

  // Test with team metrics calculation
  const teamMetrics = calculateTeamMetrics(sampleAttendanceData);
  console.log(
    "\nTeam metrics late night check-ins:",
    teamMetrics.lateNightCheckins
  );

  return {
    uniqueUsersWithLateNightCheckins,
    teamMetrics,
  };
};
