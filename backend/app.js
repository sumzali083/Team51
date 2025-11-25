const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working - Summer");
});

app.listen(21051, () => {
  console.log("Server running on http://localhost:${PORT}");
});

const productRoutes = require("./routes/products");
//use product routes for any requests to /api/products
app.use("/api/products", productRoutes);

const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);
//use cart routes for any requests to /api/cart

const orderRoutes = require("./routes/orders");
app.use("/api/orders", orderRoutes);
//use order routes for any requests to /api/orders

const feedbackRoutes = require("./routes/feedback");
app.use("/api/feedback", feedbackRoutes);
//use feedback routes for any requests to /api/feedback