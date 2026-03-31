import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper — creates a token for a user ID
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // payload — what's inside the token
    process.env.JWT_SECRET,            // secret key to sign it
    { expiresIn: process.env.JWT_EXPIRE }  // expiry time
  );
};

// ── REGISTER ──────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3. Create user — password auto-hashed by pre("save") hook
    const user = await User.create({ name, email, password });

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send back user info + token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ── LOGIN ──────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Compare password with hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send back user info + token
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ── GET CURRENT USER ───────────────────────────────
export const getMe = async (req, res) => {
  // req.user is set by protect middleware
  res.json({
    success: true,
    user: req.user,
  });
};