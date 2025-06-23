const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test data
const testUser = {
  username: "test_user",
  slackId: "U1234567890",
};

const testAttendance = {
  user: "test_user",
  checkinTime: "09:00",
  date: new Date().toISOString().split("T")[0],
};

const testLeave = {
  user: "test_user",
  dates: [new Date("2024-02-01"), new Date("2024-02-02")],
  reason: "Test leave request",
  leaveType: "casualLeave",
  leaveDay: ["Thursday", "Friday"],
  leaveTime: ["Full Day", "Full Day"],
};

async function testAPI() {
  console.log("🧪 Testing Lovable Dashboard API...\n");

  try {
    // Test server health
    console.log("1. Testing server health...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log("✅ Server is healthy:", healthResponse.data.status);

    // Test user creation
    console.log("\n2. Testing user creation...");
    const userResponse = await axios.post(`${BASE_URL}/users`, testUser);
    console.log("✅ User created:", userResponse.data.username);
    const userId = userResponse.data._id;

    // Test attendance check-in
    console.log("\n3. Testing attendance check-in...");
    const attendanceResponse = await axios.post(
      `${BASE_URL}/attendance/checkin`,
      testAttendance
    );
    console.log("✅ Attendance recorded:", attendanceResponse.data.checkinTime);
    const attendanceId = attendanceResponse.data._id;

    // Test leave request
    console.log("\n4. Testing leave request...");
    const leaveResponse = await axios.post(`${BASE_URL}/leaves`, testLeave);
    console.log("✅ Leave request created:", leaveResponse.data.status);

    // Test get all users
    console.log("\n5. Testing get all users...");
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log("✅ Users retrieved:", usersResponse.data.length, "users");

    // Test get attendance by user
    console.log("\n6. Testing get attendance by user...");
    const userAttendanceResponse = await axios.get(
      `${BASE_URL}/attendance/user/${testUser.username}`
    );
    console.log(
      "✅ User attendance retrieved:",
      userAttendanceResponse.data.length,
      "records"
    );

    // Test get leaves by user
    console.log("\n7. Testing get leaves by user...");
    const userLeavesResponse = await axios.get(
      `${BASE_URL}/leaves/user/${testUser.username}`
    );
    console.log(
      "✅ User leaves retrieved:",
      userLeavesResponse.data.length,
      "records"
    );

    // Test attendance check-out
    console.log("\n8. Testing attendance check-out...");
    const checkoutResponse = await axios.patch(
      `${BASE_URL}/attendance/checkout/${attendanceId}`,
      {
        checkoutTime: "17:00",
      }
    );
    console.log("✅ Check-out recorded:", checkoutResponse.data.checkoutTime);

    // Test leave status update
    console.log("\n9. Testing leave status update...");
    const leaveStatusResponse = await axios.patch(
      `${BASE_URL}/leaves/${leaveResponse.data._id}/status`,
      {
        status: "Approved",
      }
    );
    console.log("✅ Leave status updated:", leaveStatusResponse.data.status);

    // Test user leave balance update
    console.log("\n10. Testing user leave balance update...");
    const leaveBalanceResponse = await axios.patch(
      `${BASE_URL}/users/${userId}/leaves`,
      {
        casualLeave: 10,
        sickLeave: 5,
      }
    );
    console.log("✅ Leave balances updated:", {
      casualLeave: leaveBalanceResponse.data.casualLeave,
      sickLeave: leaveBalanceResponse.data.sickLeave,
    });

    console.log("\n🎉 All tests passed! API is working correctly.");
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
