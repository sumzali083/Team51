const express = require("express");
const db = require("../config/db"); // same as in products/cart/orders
const router = express.Router();

/**
 * POST /api/feedback
 * Body: { userId?, productId?, rating, comment }
 */
router.post("/", async (req, res) => {
    //submit feedback
  try {
    //get data from request body
    const { userId, productId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        //validate rating
      return res
        .status(400)
        .json({ message: "rating is required and must be between 1 and 5" });
        //return 400 bad request if rating is invalid
    }

    if (!comment || comment.trim() === "") {
        //validate comment
      return res.status(400).json({ message: "comment is required" });
      //return 400 bad request if comment is missing
    }

    const [result] = await db.query(
        //insert feedback into database
      `INSERT INTO feedback (user_id, product_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
       //use null for userId/productId if not provided
      [userId || null, productId || null, rating, comment.trim()]
      //execute sql query to insert feedback
    );

    res.status(201).json({
        //return success response
      message: "Feedback submitted",
      id: result.insertId,
    });
  } catch (err) {
    //catch any errors and return server error
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/feedback
 * Optional: ?productId=1 to filter
 */
router.get("/", async (req, res) => {
  try {
    //get optional productId from query parameters
    const { productId } = req.query;

    let sql = `
      SELECT f.*, u.name AS user_name, p.name AS product_name
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN products p ON f.product_id = p.id
    `;
    const params = [];
    //array to hold query parameters

    if (productId) {
        //if productId is specified add to sql query and params
      sql += " WHERE f.product_id = ?";
      //if productId is specified add to sql query and params
      params.push(productId);
    }
    //if productId is specified add to sql query and params

    sql += " ORDER BY f.created_at DESC";
    //order by most recent feedback

    const [rows] = await db.query(sql, params);
    //execute sql query to get feedback
    res.json(rows);
    //try to execute the query and return results as json
  } catch (err) {
    console.error("Error fetching feedback:", err);
    //catch any errors and return server error
    res.status(500).json({ message: "Server error" });
  }
  //try to execute the query and return results as json, catch any errors and return server error
});

module.exports = router;
//export the router
