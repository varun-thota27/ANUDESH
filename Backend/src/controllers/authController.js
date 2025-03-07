import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user, res) => {

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role ,faculty :user.faculty},
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 13* 60 * 60 * 1000, // 13 hour
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(user, res);
    res.json({ message: "Login successful", role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};
