// Simple test script to verify late night check-in calculation
// Run with: node test-late-night.js

// Mock the functions for testing
const isLateNightCheckin = (checkinTime) => {
  try {
    const convertTimeToHours = (time) => {
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

const calculateLateNightCheckinsByUsers = (allAttendanceData) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const usersWithLateNightCheckins = new Set();

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

// Test data
const sampleAttendanceData = {
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

console.log("=== Testing Late Night Check-in Calculation ===\n");

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

if (uniqueUsersWithLateNightCheckins === 3) {
  console.log(
    "✅ Test PASSED! Correctly identified 3 users with late night check-ins."
  );
} else {
  console.log(
    "❌ Test FAILED! Expected 3 users, got",
    uniqueUsersWithLateNightCheckins
  );
}
