const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.post("/checkout", async (req, res) => {
  const { userId } = req.body || {};

  // ✅ Guest checkout (allowed, but not saved)
  if (!userId) {
    return res.status(200).json({
      saved: false,
      message:
        "Guest checkout: order not saved. Please log in to place an order and store it in the database.",
    });
  }

  // ✅ Minimal security: ensure userId is a valid integer
  const userIdInt = Number(userId);
  if (!Number.isInteger(userIdInt) || userIdInt <= 0) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  let connection;

  try {
    // ✅ NEW: Validate user exists
    const [userRows] = await db.query("SELECT id FROM users WHERE id = ?", [
      userIdInt,
    ]);
    if (!userRows.length) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // 1) Get basket items with product price + stock
    const [cartItems] = await db.query(
      `SELECT b.id, b.product_id, b.quantity, p.price, p.stock
       FROM basket_items b
       JOIN products p ON b.product_id = p.id
       WHERE b.user_id = ?`,
      [userIdInt]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2) Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ID ${item.product_id}`,
        });
      }
    }

    // 3) Calculate total
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 4) Start transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 5) Insert order
    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [userIdInt, totalPrice]
    );
    const orderId = orderResult.insertId;

    // 6) Insert order items + reduce stock
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_each)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );

      await connection.query(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // 7) Clear basket
    await connection.query("DELETE FROM basket_items WHERE user_id = ?", [
      userIdInt,
    ]);

    // 8) Commit
    await connection.commit();

    return res.status(201).json({
      saved: true,
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

    return res.status(500).json({ message: "Server error during checkout" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;