const express = require("express");
const router = express.Router();

// Temporary in-memory reviews storage
// Structure: { productId: [ { rating, comment, user, createdAt } ] }
const reviewsStore = {};

// GET reviews for a product
router.get("/products/:id/reviews", (req, res) => {
  const productId = String(req.params.id);
  const reviews = reviewsStore[productId] || [];
  res.json(reviews);
});

// POST a review for a product
router.post("/products/:id/reviews", (req, res) => {
  const productId = String(req.params.id);
  const { rating, comment, user } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  if (!comment || comment.trim().length < 2) {
    return res.status(400).json({ message: "Comment is too short" });
  }

  if (!reviewsStore[productId]) {
    reviewsStore[productId] = [];
  }

  const review = {
    rating: Number(rating),
    comment: comment.trim(),
    user: user || "Anonymous",
    createdAt: new Date()
  };

  reviewsStore[productId].push(review);

  res.json({ message: "Review added", review });
});

module.exports = router;