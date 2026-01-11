// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Middleware to authenticate
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Signup failed" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        notificationsEnabled: user.notificationsEnabled,
        isPrivate: user.isPrivate,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Login failed" });
  }
});

// ==================== GET CURRENT USER ====================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch user" });
  }
});

// ==================== UPDATE PROFILE ====================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, profileImage },
      { new: true }
    ).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
});

// ==================== UPDATE NOTIFICATIONS ====================
router.put("/notifications", authMiddleware, async (req, res) => {
  try {
    const { notificationsEnabled } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationsEnabled },
      { new: true }
    ).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update notifications" });
  }
});

// ==================== UPDATE PRIVACY ====================
router.put("/privacy", authMiddleware, async (req, res) => {
  try {
    const { isPrivate } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isPrivate },
      { new: true }
    ).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update privacy" });
  }
});

module.exports = router;
