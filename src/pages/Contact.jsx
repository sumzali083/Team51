// src/pages/Contact.jsx
import React, { useState, useRef } from "react";
import axios from "axios";

export default function Contact({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const clearTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name || form.name.trim() === "") return "Name is required";
    if (!form.email || !form.email.includes("@")) return "Valid email is required";
    if (!form.message || form.message.trim() === "") return "Message is required";
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
      const res = await axios.post(
        "/api/contact",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        },
        { timeout: 8000 }
      );

      showAlert({ type: "success", text: res.data?.message || "Message sent" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err.code === "ECONNABORTED" ? "Request timed out" : "Server error");
      showAlert({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mt-5" style={{ maxWidth: 900 }}>
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Contact Us</h2>
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
          Have a question about sizing, orders, or returns? Drop us a message and we'll get back to you by email.
        </p>

        {alert && (
          <div className={`alert alert-${alert.type} mt-2`} role="alert" aria-live="polite">
            {alert.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3" noValidate>
          <div className="mb-3">
            <label htmlFor="contact-name" className="form-label">Name</label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-email" className="form-label">Email</label>
            <input
              id="contact-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact-message" className="form-label">Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              className="form-control"
              placeholder="Write your message here"
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setForm({ name: "", email: "", message: "" });
                setAlert(null);
                if (clearTimer.current) clearTimeout(clearTimer.current);
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
