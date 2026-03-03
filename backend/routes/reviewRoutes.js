const express = require("express");
const router = express.Router();

// Temporary in-memory storage example
// (later you can connect this to DB products)
let reviews = [];

// POST review
router.post("/products/:id/reviews", (req, res) => {
  const productId = req.params.id;
  const { rating, comment, user } = req.body;

  const review = {
    productId,
    rating,
    comment,
    user,
    createdAt: new Date()
  };

  reviews.push(review);

  res.json({ message: "Review added", review });
});

// GET reviews for product
router.get("/products/:id/reviews", (req, res) => {
  const productId = req.params.id;
  const productReviews = reviews.filter(r => r.productId === productId);
  res.json(productReviews);
});

module.exports = router;
