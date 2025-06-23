const express = require("express");
const router = express.Router();
const { Leave } = require("../models/Leave");
const { User } = require("../models/User");

// Get all leave records
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    // Get unique Slack IDs from leaves
    const slackIds = [...new Set(leaves.map((leave) => leave.user))];

    // Fetch usernames for these Slack IDs
    const users = await User.find({ slackId: { $in: slackIds } });

    // Create a mapping of slackId to username
    const userMap = {};
    users.forEach((user) => {
      userMap[user.slackId] = user.username;
    });

    // Add username field to each leave record
    const leavesWithUsernames = leaves.map((leave) => ({
      ...leave.toObject(),
      username: userMap[leave.user] || leave.user, // Fallback to Slack ID if username not found
    }));

    console.log(
      "All leave requests with usernames:",
      leavesWithUsernames.map((l) => ({
        user: l.user,
        username: l.username,
        status: l.status,
      }))
    );
    res.json(leavesWithUsernames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employees on leave today
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (1:00 PM)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow (1:00 PM)

    const leaves = await Leave.find({
      dates: {
        $gte: today,
        $lt: tomorrow, // Less than tomorrow (before 12:00 AM tomorrow)
      },
      status: { $in: ["Approved"] },
    });

    // Get unique Slack IDs from leaves
    const slackIds = [...new Set(leaves.map((leave) => leave.user))];

    // Fetch usernames for these Slack IDs
    const users = await User.find({ slackId: { $in: slackIds } });

    // Create a mapping of slackId to username
    const userMap = {};
    users.forEach((user) => {
      userMap[user.slackId] = user.username;
    });

    // Map Slack IDs to usernames
    const employeesOnLeave = slackIds
      .map((slackId) => userMap[slackId])
      .filter(Boolean);

    console.log("Employees on leave today:", employeesOnLeave);
    res.json(employeesOnLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employees on leave next week
router.get("/next-week", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (1:00 PM)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const leaves = await Leave.find({
      dates: {
        $gte: today,
        $lt: nextWeek,
      },
      status: { $in: ["Approved"] },
    });

    // Get unique Slack IDs from leaves
    const slackIds = [...new Set(leaves.map((leave) => leave.user))];

    // Fetch usernames for these Slack IDs
    const users = await User.find({ slackId: { $in: slackIds } });

    // Create a mapping of slackId to username
    const userMap = {};
    users.forEach((user) => {
      userMap[user.slackId] = user.username;
    });

    // Map Slack IDs to usernames
    const employeesOnLeave = slackIds
      .map((slackId) => userMap[slackId])
      .filter(Boolean);

    console.log("Employees on leave next week:", employeesOnLeave);
    res.json(employeesOnLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaves by user
router.get("/user/:user", async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.params.user }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaves by status
router.get("/status/:status", async (req, res) => {
  try {
    const leaves = await Leave.find({ status: req.params.status }).sort({
      createdAt: -1,
    });

    // If status is "Pending", map Slack IDs to usernames
    if (req.params.status === "Pending") {
      // Get unique Slack IDs from leaves
      const slackIds = [...new Set(leaves.map((leave) => leave.user))];

      // Fetch usernames for these Slack IDs
      const users = await User.find({ slackId: { $in: slackIds } });

      // Create a mapping of slackId to username
      const userMap = {};
      users.forEach((user) => {
        userMap[user.slackId] = user.username;
      });

      // Add username field to each leave record
      const leavesWithUsernames = leaves.map((leave) => ({
        ...leave.toObject(),
        username: userMap[leave.user] || leave.user, // Fallback to Slack ID if username not found
      }));

      console.log(
        "Pending leave requests with usernames:",
        leavesWithUsernames.map((l) => ({ user: l.user, username: l.username }))
      );
      res.json(leavesWithUsernames);
    } else {
      res.json(leaves);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaves by type
router.get("/type/:leaveType", async (req, res) => {
  try {
    const leaves = await Leave.find({ leaveType: req.params.leaveType }).sort({
      createdAt: -1,
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new leave request
// router.post("/", async (req, res) => {
//   try {
//     const { user, dates, reason, leaveType, leaveDay, leaveTime } = req.body;

//     const leave = new Leave({
//       user,
//       dates,
//       reason,
//       leaveType,
//       leaveDay,
//       leaveTime,
//     });

//     const newLeave = await leave.save();
//     res.status(201).json(newLeave);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update leave status
// router.patch("/:id/status", async (req, res) => {
//   try {
//     const { status } = req.body;
//     const leave = await Leave.findById(req.params.id);

//     if (!leave) {
//       return res.status(404).json({ message: "Leave record not found" });
//     }

//     leave.status = status;
//     const updatedLeave = await leave.save();
//     res.json(updatedLeave);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update leave record
// router.patch("/:id", async (req, res) => {
//   try {
//     const leave = await Leave.findById(req.params.id);

//     if (!leave) {
//       return res.status(404).json({ message: "Leave record not found" });
//     }

//     Object.assign(leave, req.body);
//     const updatedLeave = await leave.save();
//     res.json(updatedLeave);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete leave record
// router.delete("/:id", async (req, res) => {
//   try {
//     const leave = await Leave.findById(req.params.id);

//     if (!leave) {
//       return res.status(404).json({ message: "Leave record not found" });
//     }

//     await leave.deleteOne();
//     res.json({ message: "Leave record deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
