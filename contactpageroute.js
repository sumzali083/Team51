// /routes/contact.js
const express = require("express");
const db = require("../config/db");
const router = express.Router();

/**
 * POST /api/contact
 * Body: { name, email, message }
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "name is required" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "valid email is required" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "message is required" });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (?, ?, ?)`,
      [name.trim(), email.trim(), message.trim()]
    );

    res.status(201).json({
      message: "Message received. We will contact you soon.",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * GET /api/contact
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
