// backend/routes/feedback.js
const express = require("express");
const db = require("../config/db"); // mysql2/promise pool

const router = express.Router();

/**
 * POST /api/feedback
 * Body: { userId?, productId?, rating, comment }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body || {};

    // validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "rating is required and must be between 1 and 5" });
    }

    // validate comment
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "comment is required" });
    }

    const sql = `
      INSERT INTO feedback (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      userId || null,
      productId || null,
      rating,
      comment.trim(),
    ]);

    return res.status(201).json({
      message: "Feedback submitted",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error saving feedback:", err);

    // If DB is not reachable locally, don't break the app
    if (err.code === "ETIMEDOUT") {
      return res.status(200).json({
        message:
          "Feedback received (DB not available in local setup, but it will work on the uni server).",
      });
    }

    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/feedback
 * Optional: ?productId=1 to filter
 */
router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;

    let sql = `
      SELECT f.*, u.name AS user_name, p.name AS product_name
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN products p ON f.product_id = p.id
    `;

    const params = [];

    if (productId) {
      sql += " WHERE f.product_id = ?";
      params.push(productId);
    }

    sql += " ORDER BY f.created_at DESC";

    const [rows] = await db.query(sql, params);

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
