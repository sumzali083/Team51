// routes/orders.js
const express = require("express");
// your mysql2/promise pool
const db = require("../config/db"); 
const router = express.Router();

/**
 * POST /api/orders/checkout
 * Body: { userId }
 *
 * Steps:
 * 1. Get all basket_items for that user joined with products (for price)
 * 2. If empty → 400
 * 3. Calculate total price
 * 4. Insert into orders
 * 5. Insert each item into order_items
 * 6. Clear basket_items for that user
 */
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;
  //get userId from request body

  if (!userId) {
    //validate userId
    return res.status(400).json({ message: "userId is required" });
    //return 400 bad request if userId is missing
  }

  let connection;

  try {
    // 1. Get basket items with product price
    const [cartItems] = await db.query(
      `SELECT b.id, b.product_id, b.quantity, p.price
       FROM basket_items b
       JOIN products p ON b.product_id = p.id
       WHERE b.user_id = ?`,
      [userId]
    );
    //execute sql query to get cart items for the user

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    //return 400 if cart is empty

    // 2. Calculate total
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
      //calculate total price of the cart items
    );

    // 3. Start transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 4. Insert into orders table
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [userId, totalPrice]
    );
    const orderId = orderResult.insertId;

    // 5. Insert order_items rows
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_each)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // 6. Clear basket for this user
    await connection.query(
      "DELETE FROM basket_items WHERE user_id = ?",
      [userId]
    );

    // 7. Commit
    await connection.commit();

    res.status(201).json({
      message: "Order placed",
      orderId,
      totalPrice,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback error:", rollbackErr);
      }
    }
    res.status(500).json({ message: "Server error during checkout" });
  } finally {
    if (connection) connection.release();
  }
});

/**
 * GET /api/orders?userId=1
 * Returns list of orders for a user
 */
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId query parameter is required" });
  }

  try {
    const [orders] = await db.query(
      `SELECT * FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC, id DESC`,
      [userId]
    );

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

/**
 * GET /api/orders/:id
 * Return single order + its items with product info
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get order
    const [orderRows] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];

    // 2. Get items for this order
    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      order,
      items,
    });
  } catch (err) {
    console.error("Get order details error:", err);
    res.status(500).json({ message: "Server error fetching order details" });
  }
});

module.exports = router;
