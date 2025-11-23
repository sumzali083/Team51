//naviagate to config folder and db file
const db = require("../config/db");
//use express libary to create routes simply
const express = require("express");
//router is a mini version of Express used to organize routes in a separate file.
const router = express.Router();

// --------------------------
// GET ALL PRODUCTS + FILTER
// --------------------------
router.get("/", async (req, res) => {
//when someone visits products run async(so code can pass while databse repsonds) function where rec is sent and res is sent back
  const { category, search } = req.query;
//get catagory and search from query parameters
  try {
    let sql = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    //base sql query to select all products and their category names
    const params = [];
    //array to hold query parameters
    if (category) {
      sql += " AND c.name = ?";
      params.push(category);
    }
    //if catagory is specified add to sql query and params

    if (search) {
      sql += " AND p.name LIKE ?";
      params.push(`%${search}%`);
    }
    //if search is specified add to sql query and params

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  //try to execute the query and return results as json, catch any errors and return server error
});

// --------------------------
// GET ONE PRODUCT BY ID
// --------------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  //get id from route parameters
  try {
    const [rows] = await db.query(
      `
        SELECT p.*, c.name AS category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `,
      [id]
    );
    //execute sql query to get product by id

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    //if no product found return 404

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  //try to execute the query and return result as json, catch any errors and return server error
});

module.exports = router;
//export the router to be used in app.js
