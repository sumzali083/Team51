// frontend/src/components/Registration.jsx
import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import api from "../api";

export function Registration({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/users/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setMessage(res.data?.message || "Account created successfully!");

      if (onSuccess) {
        onSuccess(email.trim()); // let parent auto-fill login email
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      const msg =
        err?.response?.data?.message || "Could not create account right now.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1
          style={{
            fontWeight: 800,
            fontSize: 26,
            marginBottom: 6,
            color: "#ff5a00",
          }}
        >
          Sign Up
        </h1>
        <p style={{ color: "#bbb", fontSize: 15 }}>
          Create an account to start shopping!
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#5c1a1a",
            color: "#ffe5e5",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            background: "#1d3b21",
            color: "#e1ffe5",
            padding: "10px 14px",
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        {/* Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#222",
            borderRadius: 8,
            padding: "12px 16px",
            border: "1px solid #333",
          }}
        >
          <CiUser style={{ fontSize: 22, color: "#ff5a00", marginRight: 8 }} />
          <input
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 16,
              flex: 1,
            }}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#222",
            borderRadius: 8,
            padding: "12px 16px",
            border: "1px solid #333",
          }}
        >
          <CiUser style={{ fontSize: 22, color: "#ff5a00", marginRight: 8 }} />
          <input
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 16,
              flex: 1,
            }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#222",
            borderRadius: 8,
            padding: "12px 16px",
            border: "1px solid #333",
          }}
        >
          <RiLockPasswordLine
            style={{ fontSize: 22, color: "#ff5a00", marginRight: 8 }}
          />
          <input
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 16,
              flex: 1,
            }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#222",
            borderRadius: 8,
            padding: "12px 16px",
            border: "1px solid #333",
          }}
        >
          <RiLockPasswordLine
            style={{ fontSize: 22, color: "#ff5a00", marginRight: 8 }}
          />
          <input
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 16,
              flex: 1,
            }}
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#aa4400" : "#ff5a00",
            color: "#fff",
            borderRadius: 8,
            padding: "13px 0",
            fontWeight: 700,
            fontSize: 17,
            border: "none",
            cursor: loading ? "default" : "pointer",
            marginTop: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,.10)",
          }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
