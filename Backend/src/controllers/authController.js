import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import pool from "../db.js";

dotenv.config();

const generateToken = (user, res) => {
  console.log("🔹 Generating token for:", user.username);

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, faculty: user.faculty },
    process.env.JWT_SECRET || "project112233", // Ensure JWT_SECRET is set
    { expiresIn: "24h" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 13 * 60 * 60 * 1000, // 13 hours
  });

  console.log("✅ Token generated successfully.");
};

export const login = async (req, res) => {
  try {
    console.log("🔹 Login attempt:", req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Missing username or password" });
    }

    console.log("🔹 Checking database for user:", username);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    console.log("🔹 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(user, res);
    console.log("✅ Login successful for:", username);
    res.json({ message: "Login successful", role: user.role });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  console.log("🔹 Logging out user...");
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
  console.log("✅ User logged out.");
};