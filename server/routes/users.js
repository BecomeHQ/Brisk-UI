const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const axios = require("axios");

// Slack API configuration
const SLACK_BOT_TOKEN =
  process.env.SLACK_BOT_TOKEN || "xoxb-your-slack-bot-token"; // Replace with your bot token

// Helper function to capitalize first letter of each word
const capitalizeWords = (str) => {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Slack users
router.get("/slack/users", async (req, res) => {
  try {
    const response = await axios.get("https://slack.com/api/users.list", {
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
    });

    if (!response.data.ok) {
      return res.status(500).json({ error: response.data.error });
    }

    // Get all existing users from database
    const existingUsers = await User.find({}, "slackId username");
    const existingSlackIds = new Set(existingUsers.map((user) => user.slackId));
    const existingUsernames = new Set(
      existingUsers.map((user) => user.username)
    );

    const members = response.data.members
      .filter(
        (user) => !user.deleted && !user.is_bot && user.id !== "USLACKBOT"
      )
      .filter(
        (user) =>
          !existingSlackIds.has(user.id) && !existingUsernames.has(user.name)
      )
      .map((user) => ({
        id: user.id,
        name: capitalizeWords(user.profile.real_name || user.name),
        email: user.profile.email || "",
        username: user.name,
        slackId: user.id,
      }));

    res.json({ users: members });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users from Slack" });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by Slack ID
router.get("/slack/:slackId", async (req, res) => {
  try {
    const user = await User.findOne({ slackId: req.params.slackId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { username, slackId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { slackId }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username: capitalizeWords(username),
      slackId,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Update user leave balances
// router.patch("/:id/leaves", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update leave balances
//     const leaveFields = [
//       "sickLeave",
//       "restrictedHoliday",
//       "burnout",
//       "mensuralLeaves",
//       "casualLeave",
//       "maternityLeave",
//       "unpaidLeave",
//       "paternityLeave",
//       "bereavementLeave",
//       "wfhLeave",
//       "internshipLeave",
//     ];

//     leaveFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         user[field] = req.body[field];
//       }
//     });

//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update user information
// router.patch("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     Object.assign(user, req.body);
//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete user
// router.delete("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await user.deleteOne();
//     res.json({ message: "User deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
