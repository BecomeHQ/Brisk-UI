const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const attendanceRoutes = require("./routes/attendance");
const leaveRoutes = require("./routes/leaves");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 1099;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Lovable Dashboard API",
    status: "Server is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      attendance: "/api/attendance",
      leaves: "/api/leaves",
      users: "/api/users",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get("/api/status", (req, res) => {
  res.json({
    message: "API is working correctly",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API status: http://localhost:${PORT}/api/status`);
  console.log(`📝 Attendance API: http://localhost:${PORT}/api/attendance`);
  console.log(`🏖️  Leaves API: http://localhost:${PORT}/api/leaves`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
});

module.exports = app;
