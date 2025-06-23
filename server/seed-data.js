const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const { Leave } = require("./models/Leave");
const { User } = require("./models/User");
const { Attendance } = require("./models/Attendance");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await Leave.deleteMany({});
    await User.deleteMany({});
    await Attendance.deleteMany({});

    // Create test users
    const users = [
      { username: "john_doe", slackId: "U1234567890" },
      { username: "jane_smith", slackId: "U1234567891" },
      { username: "mike_wilson", slackId: "U1234567892" },
      { username: "sarah_jones", slackId: "U1234567893" },
      { username: "alex_brown", slackId: "U1234567894" },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create test leave data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const leaves = [
      {
        user: "U1234567890", // john_doe's Slack ID
        dates: [today], // Today
        reason: "Personal day",
        status: "Approved",
        leaveType: "casualLeave",
        leaveDay: ["Full Day"],
        leaveTime: ["Full Day"],
      },
      {
        user: "U1234567891", // jane_smith's Slack ID
        dates: [today], // Today
        reason: "Doctor appointment",
        status: "Approved",
        leaveType: "sickLeave",
        leaveDay: ["Full Day"],
        leaveTime: ["Full Day"],
      },
      {
        user: "U1234567892", // mike_wilson's Slack ID
        dates: [nextWeek], // Next week
        reason: "Vacation",
        status: "Approved",
        leaveType: "casualLeave",
        leaveDay: ["Full Day"],
        leaveTime: ["Full Day"],
      },
      {
        user: "U1234567893", // sarah_jones's Slack ID
        dates: [nextWeek], // Next week
        reason: "Family event",
        status: "Pending",
        leaveType: "casualLeave",
        leaveDay: ["Full Day"],
        leaveTime: ["Full Day"],
      },
      {
        user: "U1234567894", // alex_brown's Slack ID
        dates: [tomorrow], // Tomorrow
        reason: "Work from home",
        status: "Approved",
        leaveType: "wfhLeave",
        leaveDay: ["Full Day"],
        leaveTime: ["Full Day"],
      },
    ];

    const createdLeaves = await Leave.insertMany(leaves);
    console.log(`✅ Created ${createdLeaves.length} leave records`);

    // Create test attendance data
    const todayString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const attendanceRecords = [
      {
        user: "U1234567892", // mike_wilson (not on leave today)
        checkinTime: "09:00",
        date: todayString,
      },
      {
        user: "U1234567893", // sarah_jones (not on leave today)
        checkinTime: "08:30",
        date: todayString,
      },
      {
        user: "U1234567894", // alex_brown (not on leave today)
        checkinTime: "09:15",
        date: todayString,
      },
      // Note: john_doe and jane_smith are on leave today, so no attendance records for them
    ];

    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${createdAttendance.length} attendance records`);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📊 Test Data Summary:");
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Leave Records: ${createdLeaves.length}`);
    console.log(`- Attendance Records: ${createdAttendance.length}`);
    console.log(`- Employees on leave today: 2 (john_doe, jane_smith)`);
    console.log(`- Employees on leave next week: 2 (mike_wilson, sarah_jones)`);
    console.log(
      `- Employees checked in today: 3 (mike_wilson, sarah_jones, alex_brown)`
    );
    console.log(`- Expected attendance percentage: 60% (3/5)`);
    console.log("\n🔗 Slack ID to Username Mapping:");
    users.forEach((user) => {
      console.log(`  ${user.slackId} -> ${user.username}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedData();
});
