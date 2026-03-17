import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

/* Shared input/label style tokens */
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

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const clearTimer = useRef(null);
  const revealRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ ADDED: map interaction state
  const [mapInteractive, setMapInteractive] = useState(false);

  useEffect(() => {
    if (!revealRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(revealRef.current);

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.includes("@")) return "Valid email is required";
    if (!form.message.trim()) return "Message is required";
    return null;
  };

  const showAlert = (a) => {
    setAlert(a);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    if (a?.type === "success") {
      clearTimer.current = setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return showAlert({ type: "danger", text: v });

    setLoading(true);
    showAlert(null);

    try {
      const messageBody = form.subject.trim()
        ? `Subject: ${form.subject.trim()}\n\n${form.message.trim()}`
        : form.message.trim();

      const res = await api.post("/api/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: messageBody,
      });

      showAlert({ type: "success", text: res.data?.message || "Message sent!" });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err.code === "ECONNABORTED" ? "Request timed out" : "Server error");
      showAlert({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  const titleSlideFadeIn = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-90px)",
    transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const formSlideFadeIn = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateX(0)" : "translateX(-120px)",
    transition: "opacity 0.9s ease 0.12s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.12s",
  };

  return (
    <div
      ref={revealRef}
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 24px 80px",
      }}
    >
      <h1 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: "clamp(56px, 11vw, 120px)",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "-0.01em",
        lineHeight: 0.92,
        color: "#fff",
        marginBottom: 48,
        textAlign: "center",
        ...titleSlideFadeIn,
      }}>
        Get In Touch
      </h1>

      <div style={{
        width: "100%",
        maxWidth: 620,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "32px 32px 28px",
        ...formSlideFadeIn,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h3 style={{ color: "#fff", fontWeight: 600, margin: 0, fontSize: 18 }}>
            General
          </h3>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              width: 34,
              height: 34,
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ←
          </button>
        </div>

        {alert && (
          <div style={{ marginBottom: 20 }}>
            {alert.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={INPUT} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={INPUT} />
          <textarea name="message" value={form.message} onChange={handleChange} style={INPUT} />

          <button type="submit">{loading ? "Sending..." : "Submit"}</button>
        </form>
      </div>

      {/* ✅ MAP SECTION FIXED */}
      <div style={{ width: "100%", maxWidth: 620, marginTop: 60 }}>
        <div
          onClick={() => {
            if (!mapInteractive) {
              window.open(
                "https://www.google.com/maps/dir/?api=1&destination=134a+Aston+Road,+Birmingham,+UK&travelmode=driving",
                "_blank"
              );
            }
          }}
          onMouseEnter={() => setMapInteractive(true)}
          onMouseLeave={() => setMapInteractive(false)}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            overflow: "hidden",
            aspectRatio: "16 / 9",
            cursor: "pointer",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?..."
            width="100%"
            height="100%"
            style={{
              border: "none",
              pointerEvents: mapInteractive ? "auto" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
