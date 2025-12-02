import React, { useState } from "react";
import axios from "axios";
export default function Contact({ onNavigate }) {
  // form state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger', text: '' }

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // basic validation (client-side)
  const validate = () => {
    if (!form.name || form.name.trim() === "") return "Name is required";
    if (!form.email || !form.email.includes("@")) return "Valid email is required";
    if (!form.message || form.message.trim() === "") return "Message is required";
    return null;
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (v) {
      setAlert({ type: "danger", text: v });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // POST to backend (assumes backend mounted at /api/contact)
      const res = await axios.post("/api/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setAlert({ type: "success", text: res.data?.message || "Message sent" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Server error";
      setAlert({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mt-5" style={{ maxWidth: 900 }}>
      <div className="p-4 bg-white rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Contact Us</h2>
          {/* optional back link using your onNavigate pattern */}
          {typeof onNavigate === "function" && (
            <button
              className="btn btn-link text-decoration-none"
              onClick={(e) => onNavigate(e, "home")}
            >
              ← Back to Home
            </button>
          )}
        </div>

        <p className="text-muted">
          Have a question about sizing, orders, or returns? Drop us a message and we'll get back to you by email.
        </p>

        {alert && (
          <div className={`alert alert-${alert.type} mt-2`} role="alert">
            {alert.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3">
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
              }}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* footer block matches the style in your HomePage */}
      <footer className="bg-dark text-light mt-4 p-4 rounded text-center">
        <h5 className="mb-1">Osai</h5>
        <p className="small mb-0">134a Aston Road, Birmingham, United Kingdom</p>
        <p className="small mb-0">
          Email: <a className="text-warning" href="mailto:support@osai.example">support@osai.example</a>
        </p>
      </footer>
    </main>
  );
}

