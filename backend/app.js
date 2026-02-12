// backend/app.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const app = express();

// 1. TRUST PROXY: Required for Aston VM HTTPS sessions
app.set("trust proxy", 1);

// === MIDDLEWARE ===
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cs2team51.cs2410-web01pvm.aston.ac.uk",
    "http://cs2team51.cs2410-web01pvm.aston.ac.uk",
  ],
  credentials: true
}));

app.use(express.json());

// === SESSION MIDDLEWARE ===
// This fixes the 401 error by making the cookie secure and cross-origin friendly
app.use(session({
  name: "osai.sid", 
  secret: process.env.SESSION_SECRET || "osai-fashion-secret-key-summer",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // Required for HTTPS
    httpOnly: true,
    sameSite: "none",  // Required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 
  }
}));

// === API ROUTES ===
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/users");
const feedbackRoutes = require("./routes/feedback");
const contactRoutes = require("./routes/contact");

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);

// === FRONTEND SERVING (The Fix for 'Cannot GET') ===
// Move this AFTER all your /api routes
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// The "Catch-All" to make React Router work
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) return res.status(404).json({ error: "API Route not found" });
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 21051;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});