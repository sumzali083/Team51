const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config(); 

const app = express();

// === PROXY SETTING ===
// Required for sessions to work over HTTPS on your university VM
app.set('trust proxy', 1);

// === MIDDLEWARE ===
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cs2team51.cs2410-web01pvm.aston.ac.uk",
    "http://cs2team51.cs2410-web01pvm.aston.ac.uk"
  ],
  credentials: true
}));

app.use(express.json());

// === SESSION MIDDLEWARE ===
app.use(session({
  secret: process.env.SESSION_SECRET || "osai-fashion-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // Required for HTTPS
    httpOnly: true,    // Extra security
    sameSite: 'none',  // Allows cookies to work across subdomains
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// === ROUTE IMPORTS ===
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const feedbackRoutes = require("./routes/feedback");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/users");
const chatbotRoutes = require("./routes/chatbot");

// === API ROUTES ===
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chatbot", chatbotRoutes);

// === FRONTEND SERVING ===
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fix for PathError: Serve index.html for non-API routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Safe fallback for React routing (No '*' to avoid PathError)
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// === START SERVER ===
const PORT = process.env.PORT || 21051;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});