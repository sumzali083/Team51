// src/pages/FeedbackPage.jsx
import React, { useState, useRef } from "react";
import api from "../api";

export default function FeedbackPage({ onNavigate }) {
  const [form, setForm] = useState({
    rating: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const clearTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const ratingNum = Number(form.rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return "Rating must be between 1 and 5";
    }
    if (!form.comment || form.comment.trim() === "") {
      return "Comment is required";
    }
    return null;
  };

  const showAlert = (a) => {
    setAlert(a);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    if (a && a.type === "success") {
      clearTimer.current = setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      showAlert({ type: "danger", text: v });
      return;
    }

    setLoading(true);
    showAlert(null);

    try {
      const payload = {
        rating: Number(form.rating),
        comment: form.comment.trim(),
        userId: null,      // you can wire real user/product later
        productId: null,
      };

      const res = await api.post("/api/feedback", payload);

      showAlert({
        type: "success",
        text:
          res.data?.message ||
          "Feedback submitted (DB may not be available locally but will work on the uni server).",
      });

      setForm({ rating: "", comment: "" });
    } catch (err) {
      console.error("FEEDBACK ERROR:", err);
      const msg =
        err?.response?.data?.message || "Server error submitting feedback";
      showAlert({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mt-5" style={{ maxWidth: 900 }}>
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Send Us Feedback</h2>
          {typeof onNavigate === "function" && (
            <button
              className="btn btn-link text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(e, "home");
              }}
            >
              ← Back to Home
            </button>
          )}
        </div>

        <p className="text-muted">
          Tell us what you think about our products, website, or anything else.
        </p>

        {alert && (
          <div
            className={`alert alert-${alert.type} mt-2`}
            role="alert"
            aria-live="polite"
          >
            {alert.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3" noValidate>
          <div className="mb-3">
            <label htmlFor="feedback-rating" className="form-label">
              Rating (1–5)
            </label>
            <select
              id="feedback-rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Choose a rating…</option>
              <option value="1">1 – Very bad</option>
              <option value="2">2</option>
              <option value="3">3 – Okay</option>
              <option value="4">4</option>
              <option value="5">5 – Excellent</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="feedback-comment" className="form-label">
              Comment
            </label>
            <textarea
              id="feedback-comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="5"
              className="form-control"
              placeholder="Share your thoughts…"
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Sending..." : "Submit Feedback"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setForm({ rating: "", comment: "" });
                if (clearTimer.current) clearTimeout(clearTimer.current);
                setAlert(null);
              }}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
