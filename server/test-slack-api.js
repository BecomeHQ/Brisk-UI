const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testSlackIntegration() {
  console.log("🧪 Testing Slack Integration...\n");

  try {
    // Test server health
    console.log("1. Testing server health...");
    const healthResponse = await axios.get("http://localhost:5000/health");
    console.log("✅ Server is healthy:", healthResponse.data.status);

    // Test Slack users endpoint
    console.log("\n2. Testing Slack users endpoint...");
    try {
      const slackResponse = await axios.get(`${BASE_URL}/users/slack/users`);
      console.log("✅ Slack users endpoint response:", slackResponse.data);
      console.log(
        "   Available users (not in database):",
        slackResponse.data.users?.length || 0
      );

      if (slackResponse.data.users && slackResponse.data.users.length > 0) {
        console.log("   Sample available user:", {
          id: slackResponse.data.users[0].id,
          name: slackResponse.data.users[0].name,
          username: slackResponse.data.users[0].username,
          email: slackResponse.data.users[0].email,
        });
        console.log(
          "   Note: Names are automatically capitalized when added to the database"
        );
      } else {
        console.log(
          "   No new users available - all Slack users are already in the database"
        );
      }
    } catch (error) {
      console.log(
        "❌ Slack users endpoint failed:",
        error.response?.data?.error || error.message
      );
      console.log("   This is expected if SLACK_BOT_TOKEN is not configured");
    }

    // Test user creation endpoint
    console.log("\n3. Testing user creation endpoint...");
    const testUser = {
      username: "test_slack_user",
      slackId: "U1234567890",
    };

    try {
      const createResponse = await axios.post(`${BASE_URL}/users`, testUser);
      console.log("✅ User creation successful:", createResponse.data);
    } catch (error) {
      console.log(
        "❌ User creation failed:",
        error.response?.data?.message || error.message
      );
    }

    console.log("\n🎉 Slack integration test completed!");
    console.log("\n📝 Next steps:");
    console.log("1. Set up your SLACK_BOT_TOKEN in the .env file");
    console.log("2. Ensure MongoDB is running");
    console.log("3. Test the Add Employee functionality in the frontend");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testSlackIntegration();
