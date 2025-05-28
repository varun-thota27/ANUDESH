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
    origin: process.env.REACT_APP_API_URL, // Ensure the frontend can communicate
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
app.use("/employees", employeeRoutes);
app.use("/info", infoRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/leave", leaveRoutes);
app.use("/leave-history", leaveRoutes);
app.use("/retire", retire);
app.use("/api/auth", authRoutes);
app.use("/employeesAll", getEmployeeRoutes);
app.use('/', signupRoute);
app.use('/part2', part2order);
app.use("/man-power", manPowerRoutes);
// ✅ Change the server to listen on all interfaces (for XAMPP proxy)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));