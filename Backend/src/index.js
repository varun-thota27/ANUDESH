import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

// Import Routes
import part2order from './routes/Part2orderRoute.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import getEmployeeRoutes from './routes/getEmployeeRoutes.js';
import infoRoutes from './routes/infoRoutes.js';
import kinderedRollRoutes from './routes/kinderedRollRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import manPowerRoutes from './routes/manPowerRoutes.js';
import retire from "./routes/retireRouter.js";
import signupRoute from './routes/signupRoute.js';

dotenv.config();

const app = express();

// ✅ Allow API requests from the frontend running on Apache (port 8080)
app.use(
  cors({
    origin: "http://localhost:3001", // Ensure the frontend can communicate
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Debugging - Log when the backend starts
console.log("🚀 Backend is starting...");

// ✅ Health Check Route - Check if API is working
app.get('/api', (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ Login Route
app.get('/api/login', (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "project112233");
    res.json({ role: decoded.role });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ error: "Invalid token" });
  }
});

// ✅ Use API Routes
app.use('/kinderedroll', kinderedRollRoutes);
console.log("✅ Kindred Roll Routes Loaded");

app.use("/employees", employeeRoutes);
console.log("✅ Employee Routes Loaded");

app.use("/info", infoRoutes);
console.log("✅ Info Routes Loaded");

app.use("/attendance", attendanceRoutes);
console.log("✅ Attendance Routes Loaded");

app.use("/leave", leaveRoutes);
console.log("✅ Leave Routes Loaded");

// ✅ Fixed duplicate /api/leave-history route (Changed it to leaveHistoryRoutes if needed)
app.use("/leave-history", leaveRoutes);
console.log("✅ Leave History Routes Loaded");

app.use("/retire", retire);
console.log("✅ Retire Routes Loaded");

app.use("/api/auth", authRoutes);
console.log("✅ Auth Routes Loaded");

app.use("/employeesAll", getEmployeeRoutes);
console.log("✅ Get Employee Routes Loaded");

app.use('/', signupRoute);
console.log("✅ Signup Routes Loaded");

app.use('/part2', part2order);
console.log("✅ Part2 Order Routes Loaded");

app.use("/man-power", manPowerRoutes);
console.log("✅ Man Power Routes Loaded");

// ✅ Change the server to listen on all interfaces (for XAMPP proxy)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));