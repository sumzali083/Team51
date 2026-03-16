import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const INPUT = {
  width: "100%",
  display: "block",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "13px 16px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.18s ease",
  boxSizing: "border-box",
};

const LABEL = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 8,
};

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setResetUrl("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/users/forgot-password", { email });
      setMessage(
        res.data?.message ||
          "If this email exists, you will receive a password reset link."
      );
      if (res.data?.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const msg =
        err?.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 24px 80px",
      }}
    >
      {/* Page heading */}
      <h1
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(56px, 11vw, 110px)",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          lineHeight: 0.92,
          color: "#fff",
          marginBottom: 40,
          textAlign: "center",
        }}
      >
        Reset Password.
      </h1>

      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "32px 32px 28px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#fff",
            margin: "0 0 6px",
          }}
        >
          Forgot Password
        </h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 28 }}>
          Enter your account email and we will send you a reset link.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 13,
              background: "rgba(255,60,60,0.12)",
              border: "1px solid rgba(255,60,60,0.25)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 13,
              background: "rgba(0,200,80,0.12)",
              border: "1px solid rgba(0,200,80,0.25)",
              color: "#4ade80",
            }}
          >
            {message}
          </div>
        )}

        {resetUrl && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 13,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#bbb",
              wordBreak: "break-all",
            }}
          >
            <div style={{ marginBottom: 6, color: "#888" }}>Reset link (demo):</div>
            <a href={resetUrl} style={{ color: "#bbb" }}>
              {resetUrl}
            </a>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div>
            <label style={LABEL} htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={INPUT}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.35)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "#fff",
              color: "#000",
              border: "none",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
              transition: "background 0.18s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#e0e0e0";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#fff";
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div style={{ marginTop: 4 }}>
            <Link
              to="/login"
              style={{
                color: "#888",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
