const db = require("../config/db");

async function fetchOrders(userId) {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return orders;
  } catch (err) {
    // Older schemas might not have created_at on orders.
    if (err && err.code === "ER_BAD_FIELD_ERROR") {
      const [orders] = await db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
        [userId]
      );
      return orders;
    }
    throw err;
  }
}

async function fetchOrderItems(orderId) {
  try {
    const [items] = await db.query(
      `SELECT
        oi.product_id,
        oi.quantity,
        oi.price_each,
        p.name,
        (
          SELECT pi.url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.sort_order ASC, pi.id ASC
          LIMIT 1
        ) AS image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [orderId]
    );
    return items;
  } catch (err) {
    // If image-table/column is missing, still return order items.
    if (
      err &&
      (err.code === "ER_NO_SUCH_TABLE" || err.code === "ER_BAD_FIELD_ERROR")
    ) {
      const [items] = await db.query(
        `SELECT
          oi.product_id,
          oi.quantity,
          oi.price_each,
          p.name,
          NULL AS image
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        [orderId]
      );
      return items;
    }
    throw err;
  }
}

async function getOrderHistoryForUser(userId) {
  const orders = await fetchOrders(userId);

  for (const order of orders) {
    order.items = await fetchOrderItems(order.id);
  }

  return orders;
}

module.exports = { getOrderHistoryForUser };
