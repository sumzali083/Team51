import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminPage() {
  const [reports, setReports] = useState(null);
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingStockId, setSavingStockId] = useState(null);
  const [stockDraft, setStockDraft] = useState({});

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [reportsRes, productsRes, messagesRes, reviewsRes] = await Promise.all([
        api.get("/api/admin/reports"),
        api.get("/api/admin/products"),
        api.get("/api/admin/messages"),
        api.get("/api/admin/reviews"),
      ]);

      setReports(reportsRes.data || null);
      setProducts(productsRes.data || []);
      setMessages(messagesRes.data || []);
      setReviews(reviewsRes.data || []);
      setStockDraft(
        Object.fromEntries((productsRes.data || []).map((p) => [p.id, p.stock ?? 0]))
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateStock = async (productId) => {
    const value = Number(stockDraft[productId]);
    if (!Number.isInteger(value) || value < 0) return;
    setSavingStockId(productId);
    try {
      await api.put(`/api/admin/products/${productId}/stock`, { stock: value });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: value } : p))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setSavingStockId(null);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await api.delete(`/api/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete message");
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/api/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) return <div className="container mt-5">Loading admin dashboard...</div>;

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
        <button className="btn btn-outline-dark" onClick={loadAll}>Refresh</button>
      </div>

      {reports && (
        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="card p-3"><strong>Products</strong><div>{reports.totalProducts}</div></div></div>
          <div className="col-md-3"><div className="card p-3"><strong>Orders</strong><div>{reports.totalOrders}</div></div></div>
          <div className="col-md-3"><div className="card p-3"><strong>Revenue</strong><div>£{Number(reports.totalRevenue || 0).toFixed(2)}</div></div></div>
          <div className="col-md-3"><div className="card p-3"><strong>Low Stock</strong><div>{reports.lowStockCount}</div></div></div>
        </div>
      )}

      <h4 className="mt-4">Inventory Stock Management</h4>
      <div className="table-responsive mb-5">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category || "-"}</td>
                <td>£{Number(p.price || 0).toFixed(2)}</td>
                <td style={{ width: 120 }}>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    value={stockDraft[p.id] ?? 0}
                    onChange={(e) =>
                      setStockDraft((prev) => ({ ...prev, [p.id]: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-dark"
                    onClick={() => updateStock(p.id)}
                    disabled={savingStockId === p.id}
                  >
                    {savingStockId === p.id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Contact Messages</h4>
      <div className="table-responsive mb-5">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.message}</td>
                <td>{m.created_at ? new Date(m.created_at).toLocaleString() : "-"}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMessage(m.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Customer Reviews</h4>
      <div className="table-responsive mb-5">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Reviewer</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.product_id}</td>
                <td>{r.user_id}</td>
                <td>{r.rating}</td>
                <td>{r.reviewer_name}</td>
                <td>{r.comment}</td>
                <td>{r.created_at ? new Date(r.created_at).toLocaleString() : "-"}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReview(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

