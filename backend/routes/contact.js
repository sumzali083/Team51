// backend/routes/contact.js
const express = require("express");
const db = require("../config/db"); // mysql2/promise pool

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  // basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // email format validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // length validation (security + coursework marks)
  if (name.length > 100 || email.length > 100) {
    return res.status(400).json({ message: "Input too long." });
  }

  if (message.length > 1000) {
    return res.status(400).json({ message: "Message too long." });
  }

  try {
    const sql =
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";

    await db.query(sql, [name.trim(), email.trim(), message.trim()]);

    // success
    return res.json({ message: "Thank you! Your message has been sent." });
  } catch (err) {
    console.error("Contact DB error:", err.code || err.message);

    // proper error response
    return res.status(500).json({
      message:
        "Sorry, we couldn't send your message right now. Please try again later.",
    });
  }
});

module.exports = router;
