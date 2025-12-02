import React, { useState, useRef } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  function showAlert(type, text) {
    setAlert({ type, text });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAlert(null), 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      showAlert("danger", "Comment is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/feedback", {
        userId: null,
        productId: null,
        rating: Number(rating),
        comment: comment.trim(),
      });
      showAlert("success", res.data.message || "Feedback submitted!");
      setRating("5");
      setComment("");
    } catch (err) {
      showAlert(
        "danger",
        err?.response?.data?.message || "Server error. Please try again."
      );
    }
    setLoading(false);
  }

  return (
    <main className="container mt-5" style={{ maxWidth: 900 }}>
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Leave Feedback</h2>
        </div>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Terrible</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Comment</label>
            <textarea
              className="form-control"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
            />
          </div>
          <button className="btn btn-dark" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </main>
  );
}
