const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin");

const app = express();

// === MIDDLEWARE ===
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cs2team51.cs2410-web01pvm.aston.ac.uk",
      "http://cs2team51.cs2410-web01pvm.aston.ac.uk",
    ],
    credentials: true,
  })
);

app.use(express.json());

// === ROUTE IMPORTS ===
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const feedbackRoutes = require("./routes/feedback");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");

// === BASIC ROUTES ===
app.get("/", (req, res) => {
  res.send("Backend is working - Summer");
});

app.get("/api", (req, res) => {
  res.json({
    message: "API Backend is working - Summer",
    endpoints: [
      "GET /api/products",
      "GET /api/products/:id",
      "POST /api/cart",
      "POST /api/orders/checkout",
      "POST /api/feedback",
      "POST /api/contact",
      "POST /api/users/register",
      "POST /api/users/login",
<<<<<<< HEAD
      "GET /api/reviews/:productId",
      "POST /api/reviews/:productId",
      "DELETE /api/reviews/:reviewId"
    ]
=======
    ],
>>>>>>> 8586b13 (updated checkout page towards the database)
  });
});

// === API ROUTES ===
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
<<<<<<< HEAD
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes); // ✅ Added admin routes
=======
app.use("/api/admin", adminRoutes);
>>>>>>> 8586b13 (updated checkout page towards the database)

// === 404 HANDLER ===
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requested: `${req.method} ${req.originalUrl}`,
  });
});

// === START SERVER ===
const PORT = process.env.PORT || 21051;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🌐 Live URL: https://cs2team51.cs2410-web01pvm.aston.ac.uk`);
});