import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { AuthContext } from "./context/AuthContext";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/api/reviews/${productId}`)
      .then((res) => {
        if (!cancelled) {
          setReviews(res.data || []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function loadReviews() {
    try {
      const res = await api.get(`/api/reviews/${productId}`);
      setReviews(res.data || []);
    } catch {
      setReviews([]);
    }
  }

  async function submitReview(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/api/reviews/${productId}`, {
        rating: Number(rating),
        comment,
        reviewer_name: user.name || "Customer",
      });

      setComment("");
      setRating(5);
      setMsg("Review added!");
      loadReviews();
    } catch {
      setMsg("Error adding review.");
    }
  }

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="card p-4">
      <h4>Ratings & Reviews</h4>

      <p>
        Average Rating: <strong>{average}</strong> / 5
      </p>

      {reviews.length === 0 && <p>No reviews yet.</p>}

      {reviews.map((r, i) => (
        <div key={i} className="border-bottom mb-2 pb-2">
          <strong>{r.reviewer_name || r.user_name || r.user || "Customer"}</strong> {"\u2014"} {"\u2605".repeat(r.rating)}
          {"\u2606".repeat(5 - r.rating)}
          <div>{r.comment}</div>
        </div>
      ))}

      <hr />

      {!user ? (
        <button
          className="btn btn-dark"
          onClick={() => navigate("/login")}
        >
          Login to leave a review
        </button>
      ) : (
        <form onSubmit={submitReview}>
          <label className="form-label">Rating</label>
          <select
            className="form-select mb-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Bad</option>
          </select>

          <textarea
            className="form-control mb-2"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            required
          />

          <button className="btn btn-dark">
            Post Review
          </button>

          {msg && <div className="mt-2">{msg}</div>}
        </form>
      )}
    </div>
  );
}
