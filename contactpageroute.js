const express = require("express");
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "cs2team51",
  password: "vnCDK1Gy61wnAv3WlFzQvY9gH",
  database: "cs2team51_db",
});

module.exports = db;

const router = express.Router();

/**
 * POST /api/contact
 * Body: { name, email, message }
 */
router.post("/", async (req, res) => {
  try {
    // get data from request body
    const { name, email, message } = req.body;

    // validate name
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "name is required" });
      // return 400 if missing
    }

    // validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "valid email is required" });
      // return 400 if invalid
    }

    // validate message
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "message is required" });
      // return 400 if missing
    }

    // insert into database
    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (?, ?, ?)`,
      [name.trim(), email.trim(), message.trim()]
      // executes SQL insert
    );

    // return success response
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
 * Admin-only: list all contact messages
 */
router.get("/", async (req, res) => {
  try {
    let sql = `
      SELECT id, name, email, message, created_at
      FROM contact_messages
      ORDER BY created_at DESC
    `;

    const [rows] = await db.query(sql);
    // return messages as JSON

    res.json(rows);

  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
// export the router

