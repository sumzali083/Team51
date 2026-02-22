import { NavLink } from "react-router-dom";
import HeroCarouselNew from "../components/HeroCarouselNew";

const categories = [
  { label: "Mens",    to: "/mens",    img: "/images/Men1.jpg" },
  { label: "Womens",  to: "/womens",  img: "/images/Woman1.jpg" },
  { label: "Kids",    to: "/kids",    img: "/images/Kids1.jpg" },
];

const galleryImages = [
  { src: "/images/Men1.jpg",    alt: "Men's Fit" },
  { src: "/images/Woman1.jpg",  alt: "Women's Fit" },
  { src: "/images/Kids1.jpg",   alt: "Kids' Fit" },
  { src: "/images/Family1.jpg", alt: "Family Fit" },
  { src: "/images/Men2.jpg",    alt: "Men's Fit 2" },
  { src: "/images/Woman2.jpg",  alt: "Women's Fit 2" },
  { src: "/images/Kids2.jpg",   alt: "Kids' Fit 2" },
  { src: "/images/Family2.jpg", alt: "Family Fit 2" },
];

export function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroCarouselNew />

      {/* ── Category strip ── */}
      <section style={{ background: "#000", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex" }}>
          {categories.map((cat) => (
            <NavLink
              key={cat.to}
              to={cat.to}
              style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                aspectRatio: "1/1.1",
                display: "block",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <img
                src={cat.img}
                alt={cat.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "brightness(0.7)",
                  transition: "transform 0.5s ease, filter 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.04)";
                  e.currentTarget.style.filter = "brightness(0.85)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(0.7)";
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                padding: "24px 20px",
                background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
              }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(22px, 4vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#fff",
                  display: "block",
                }}>
                  {cat.label}
                </span>
                <span style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}>
                  Shop Now →
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* ── Welcome / Brand statement ── */}
      <section className="osai-welcome">
        <div>
          <h1 className="osai-welcome-heading">
            Wear<br />
            <span>Your</span><br />
            Story.
          </h1>
        </div>
        <div className="osai-welcome-body">
          <p>
            OSAI is one of the leading companies in the fashion industry.
            Pure fashion created from the finest Japanese fibers — hand-woven
            and tailor-made for every body type.
          </p>
          <p>
            From kids to adults, daily wear to timeless pieces, we have it all.
            You will always find something for everyone with us.
          </p>
          <NavLink to="/about" className="osai-cta-primary">
            Our Story →
          </NavLink>
        </div>
      </section>

      {/* ── Editorial Gallery ── */}
      <section className="osai-gallery-section">
        <div className="osai-gallery-header">
          <h2>Wear Your Style</h2>
          <NavLink
            to="/mens"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              transition: "color 0.15s",
            }}
          >
            View All →
          </NavLink>
        </div>
        <div className="osai-gallery-grid">
          {galleryImages.map((img, i) => (
            <div className="osai-gallery-grid-item" key={i}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
