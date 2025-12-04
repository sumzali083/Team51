// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Login } from "../components/Login";
import { Registration } from "../components/Registration";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [prefillEmail, setPrefillEmail] = useState("");

  return (
    <main className="container mt-5" style={{ maxWidth: 600 }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 24,
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: mode === "login" ? "#ff5a00" : "#333",
            color: "#fff",
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: mode === "signup" ? "#ff5a00" : "#333",
            color: "#fff",
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Card containing whichever form is active */}
      <div
        style={{
          background: "#111",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        }}
      >
        {mode === "login" ? (
          <Login initialEmail={prefillEmail} />
        ) : (
          <Registration
            onSuccess={(email) => {
              setPrefillEmail(email);
              setMode("login"); // switch back to login after signup
            }}
          />
        )}
      </div>
    </main>
  );
}
