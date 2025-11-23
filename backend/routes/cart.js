// routes/cart.js
const express = require("express");
const db = require("../config/db");
 // your mysql2/promise pool
const router = express.Router();

// Table name for cart items
const TABLE_NAME = "basket_items";

/**
 * POST /api/cart
 * Body: { userId, productId, quantity }
 * - if item exists for that user+product → increase quantity
 * - else → insert new row
 */
router.post("/", async (req, res) => {
    //add item to cart or update quantity if already exists
  try {
    const { userId, productId, quantity } = req.body;
    //get userId, productId and quantity from request body

    if (!userId || !productId || !quantity) {
        //validate required fields
      return res.status(400).json({ message: "userId, productId and quantity are required" });
      //return 400 bad request if any field is missing 
    }

    // 1. check if this product is already in the user's cart
    const [existingRows] = await db.query(
        //use sql query to check for existing cart item
      `SELECT * FROM ${TABLE_NAME} WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );

    if (existingRows.length > 0) {
      // update quantity (add to existing)
      const current = existingRows[0];
      //get current cart item
      const newQty = current.quantity + Number(quantity);

      await db.query(
        //with sql query update the quantity of the existing cart item
        `UPDATE ${TABLE_NAME} SET quantity = ? WHERE id = ?`,
        [newQty, current.id]
      );

      return res.json({
        //return success response
        message: "Cart item updated",
        itemId: current.id,
        // return the id of the updated item
        quantity: newQty,
      });
    } else {
      // insert new row
      const [result] = await db.query(
        `INSERT INTO ${TABLE_NAME} (user_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [userId, productId, quantity]
      );

      return res.status(201).json({
        //return success response for new item
        message: "Item added to cart",
        itemId: result.insertId,
      });
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/cart?userId=1
 * Returns all items in user's cart with product info
 */
router.get("/", async (req, res) => {
  try {
    //get all cart items for a user
    const { userId } = req.query;

    if (!userId) {
        //validate userId query parameter
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    const [rows] = await db.query(
      `SELECT b.*, p.name, p.price
      //get cart items joined with product info
       FROM ${TABLE_NAME} b
       JOIN products p ON b.product_id = p.id
       WHERE b.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/cart/:itemId
 * Removes a single cart item by its id
 */
router.delete("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const [result] = await db.query(
      `DELETE FROM ${TABLE_NAME} WHERE id = ?`,
      [itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item removed" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ message: "Server error" });
  }
  //try to delete the cart item by id, return appropriate response
});

/**
 * DELETE /api/cart?userId=1
 * Clears all items in a user's cart
 */
router.delete("/", async (req, res) => {
  try {
    
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    await db.query(
      `DELETE FROM ${TABLE_NAME} WHERE user_id = ?`,
      [userId]
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
