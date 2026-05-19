import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";         // /api/auth
import bookingRoutes from "./routes/bookingRoutes.js";   // /api/bookings
import driverRoutes from "./routes/driver.js";           // /api/driver
import adminRoutes from "./routes/admin.js";             // /api/admin

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("🚗 MyRide Backend API"));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/driver", driverRoutes);       // ✅ MOUNTED CORRECTLY
app.use("/api/admin", adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  // ✅ These are deprecated in latest Mongoose but still safe to keep
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`); // ✅ Fix backtick
});