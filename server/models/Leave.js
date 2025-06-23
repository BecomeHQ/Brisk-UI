const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  user: String,
  dates: { type: [Date], required: true },
  reason: String,
  status: { type: String, default: "Pending" },
  leaveType: { type: String, required: true },
  leaveDay: { type: [String], required: true },
  leaveTime: { type: [String], required: true },
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = { Leave };
