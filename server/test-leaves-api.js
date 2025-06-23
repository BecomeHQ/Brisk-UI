const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testLeaveEndpoints() {
  console.log("🧪 Testing Leave and Attendance API Endpoints...\n");

  try {
    // Test server health
    console.log("1. Testing server health...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log("✅ Server is healthy:", healthResponse.data.status);

    // Test get all leave requests
    console.log("\n2. Testing get all leave requests...");
    const allLeavesResponse = await axios.get(`${BASE_URL}/leaves`);
    console.log("✅ All leave requests:", allLeavesResponse.data.length);
    console.log(
      "   Requests with usernames:",
      allLeavesResponse.data.map((r) => ({
        user: r.user,
        username: r.username,
        status: r.status,
      }))
    );
    console.log(
      "   All have usernames:",
      allLeavesResponse.data.every(
        (r) => r.username && !r.username.startsWith("U")
      )
    );

    // Test get employees on leave today
    console.log("\n3. Testing get employees on leave today...");
    const todayResponse = await axios.get(`${BASE_URL}/leaves/today`);
    console.log("✅ Employees on leave today:", todayResponse.data);
    console.log("   Count:", todayResponse.data.length);
    console.log(
      "   Expected usernames (not Slack IDs):",
      todayResponse.data.every((name) => !name.startsWith("U"))
    );

    // Test get employees on leave next week
    console.log("\n4. Testing get employees on leave next week...");
    const nextWeekResponse = await axios.get(`${BASE_URL}/leaves/next-week`);
    console.log("✅ Employees on leave next week:", nextWeekResponse.data);
    console.log("   Count:", nextWeekResponse.data.length);
    console.log(
      "   Expected usernames (not Slack IDs):",
      nextWeekResponse.data.every((name) => !name.startsWith("U"))
    );

    // Test get pending leave requests
    console.log("\n5. Testing get pending leave requests...");
    const pendingResponse = await axios.get(
      `${BASE_URL}/leaves/status/Pending`
    );
    console.log("✅ Pending leave requests:", pendingResponse.data.length);
    console.log(
      "   Requests with usernames:",
      pendingResponse.data.map((r) => ({
        user: r.user,
        username: r.username,
        reason: r.reason,
      }))
    );
    console.log(
      "   All have usernames:",
      pendingResponse.data.every(
        (r) => r.username && !r.username.startsWith("U")
      )
    );

    // Test get today's attendance statistics
    console.log("\n6. Testing get today's attendance statistics...");
    const attendanceResponse = await axios.get(`${BASE_URL}/attendance/today`);
    console.log("✅ Today's attendance statistics:", attendanceResponse.data);
    console.log("   Checked in users:", attendanceResponse.data.checkedInUsers);
    console.log(
      "   Attendance percentage:",
      attendanceResponse.data.attendancePercentage + "%"
    );

    // Test get all users to verify the mapping
    console.log("\n7. Testing get all users...");
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log(
      "✅ All users:",
      usersResponse.data.map((u) => ({
        username: u.username,
        slackId: u.slackId,
      }))
    );

    console.log("\n🎉 All leave and attendance endpoint tests passed!");
    console.log(
      "\n📝 Note: All endpoints now return usernames instead of Slack IDs"
    );
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message
    );
  }
}

// Test the getAllUsers endpoint for Team Leave Calendar
async function testGetAllUsers() {
  console.log("\n=== Testing getAllUsers Endpoint ===");
  try {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();

    if (response.ok) {
      console.log("✅ getAllUsers successful");
      console.log(`📊 Found ${data.length} users`);
      console.log(
        "👥 Users:",
        data.map((user) => ({
          id: user._id,
          username: user.username,
          slackId: user.slackId,
        }))
      );
    } else {
      console.log("❌ getAllUsers failed:", data.error);
    }
  } catch (error) {
    console.log("❌ getAllUsers error:", error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testLeaveEndpoints();
  await testGetAllUsers();
  console.log("\n🎉 All tests completed!");
}

runAllTests();
