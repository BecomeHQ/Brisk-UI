const express = require("express");
const router = express.Router();
const { Attendance } = require("../models/Attendance");
const { User } = require("../models/User");

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics for today
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Get all attendance records for today
    const todayAttendance = await Attendance.find({ date: todayString });

    // Get all users to calculate total available employees
    const allUsers = await User.find();

    // Get unique users who checked in today
    const checkedInUsers = [
      ...new Set(todayAttendance.map((record) => record.user)),
    ];

    // Map Slack IDs to usernames for checked-in users
    const checkedInUserIds = [
      ...new Set(todayAttendance.map((record) => record.user)),
    ];
    const checkedInUserDetails = await User.find({
      slackId: { $in: checkedInUserIds },
    });

    const userMap = {};
    checkedInUserDetails.forEach((user) => {
      userMap[user.slackId] = user.username;
    });

    const checkedInUsernames = checkedInUserIds.map(
      (slackId) => userMap[slackId] || slackId
    );

    // Calculate statistics
    const totalEmployees = allUsers.length;
    const checkedInCount = checkedInUsers.length;
    const availableEmployees = totalEmployees; // All employees are available (not considering leaves)
    const attendancePercentage =
      availableEmployees > 0
        ? Math.round((checkedInCount / availableEmployees) * 100)
        : 0;

    const response = {
      totalEmployees,
      checkedInCount,
      availableEmployees,
      attendancePercentage,
      checkedInUsers: checkedInUsernames,
      todayDate: todayString,
    };

    console.log("Today's attendance statistics:", response);
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by user
router.get("/user/:user", async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.params.user }).sort({
      date: -1,
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance by date
router.get("/date/:date", async (req, res) => {
  try {
    const attendance = await Attendance.find({ date: req.params.date });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new attendance record (check-in)
// router.post("/checkin", async (req, res) => {
//   try {
//     const { user, checkinTime, date } = req.body;

//     // Check if attendance record already exists for today
//     const existingRecord = await Attendance.findOne({ user, date });

//     if (existingRecord) {
//       return res
//         .status(400)
//         .json({ message: "Attendance record already exists for today" });
//     }

//     const attendance = new Attendance({
//       user,
//       checkinTime,
//       date,
//     });

//     const newAttendance = await attendance.save();
//     res.status(201).json(newAttendance);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update attendance record (check-out)
// router.patch("/checkout/:id", async (req, res) => {
//   try {
//     const { checkoutTime } = req.body;
//     const attendance = await Attendance.findById(req.params.id);

//     if (!attendance) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     attendance.checkoutTime = checkoutTime;
//     const updatedAttendance = await attendance.save();
//     res.json(updatedAttendance);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update attendance record
// router.patch("/:id", async (req, res) => {
//   try {
//     const attendance = await Attendance.findById(req.params.id);

//     if (!attendance) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     Object.assign(attendance, req.body);
//     const updatedAttendance = await attendance.save();
//     res.json(updatedAttendance);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete attendance record
// router.delete("/:id", async (req, res) => {
//   try {
//     const attendance = await Attendance.findById(req.params.id);

//     if (!attendance) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     await attendance.deleteOne();
//     res.json({ message: "Attendance record deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
