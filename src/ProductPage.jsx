
import React, { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "./data";
import { CartContext } from "./context/CartContext";

// Simple in-memory review store (for demo)
const reviewStore = {};

export function ProductPage() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);
  const cartContext = useContext(CartContext);
  const [activeImg, setActiveImg] = React.useState(0);
  const [size, setSize] = React.useState(product?.sizes?.[0] ?? "");
  const [color, setColor] = React.useState(product?.colors?.[0] ?? "");
  const [msg, setMsg] = React.useState("");
  const [reviews, setReviews] = React.useState(() => reviewStore[id] || []);
  const [reviewText, setReviewText] = React.useState("");
  const [reviewStars, setReviewStars] = React.useState(0);
  const [showReviews, setShowReviews] = React.useState(true);

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1) : null;

  if (!product) {
    return (
      <>
        <div className="product">
          <div>Product not found.</div>
        </div>
        <div className="pagination">
          <Link className="btn" to="/mens">
            Back to store
          </Link>
        </div>
      </>
    );
  }

  const catToRoute = { men: "/mens", women: "/womens", kids: "/kids" };
  const catToLabel = { men: "Men", women: "Women", kids: "Kids" };
  const catRoute = catToRoute[product.cat] || "/mens";
  const catLabel = catToLabel[product.cat] || "Shop";

  const handleAdd = () => {
    // Add product to cart with selected size and color
    cartContext.addToCart({
      ...product,
      size,
      color,
      image: product.images[activeImg],
    });
    setMsg(`Added “${product.name}” (${color}, ${size}) to cart!`);
  };

  // Handle review submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewStars < 1 || reviewStars > 5) return;
    if (!reviewText.trim()) return;
    const newReview = { stars: reviewStars, text: reviewText, date: new Date().toISOString() };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    reviewStore[id] = updated;
    setReviewText("");
    setReviewStars(0);
  };

  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to={catRoute}>Home</Link> ›{" "}
        <Link to={catRoute}>{catLabel}</Link> ›{" "}
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product" aria-labelledby="ptitle">
        <div>
          <div className="gallery">
            <img
              id="mainImg"
              alt={product.name}
              src={product.images[activeImg]}
            />
          </div>
          <div className="thumbs" role="list" aria-label="Product thumbnails">
            {product.images.map((src, i) => (
              <button
                key={i}
                className={"thumb-btn" + (i === activeImg ? " active" : "")}
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img alt={`${product.name} thumbnail ${i + 1}`} src={src} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 id="ptitle" className="p-title">
            {product.name}
          </h1>
          <div className="p-price">£{product.price.toFixed(2)}</div>
          <p className="p-desc">{product.desc}</p>

          <div className="opt-row" aria-label="Size options">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={"opt" + (size === s ? " active" : "")}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="opt-row" aria-label="Color options">
            {product.colors.map((c) => (
              <button
                key={c}
                className={"opt" + (color === c ? " active" : "")}
                onClick={() => setColor(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="cta">
            <button className="btn primary" onClick={handleAdd}>
              Add to bag
            </button>
            <Link className="btn ghost" to={catRoute}>
              Back to products
            </Link>
          </div>

          <div className="note" id="msg" role="status" aria-live="polite">
            {msg}
          </div>

          {/* --- Product Reviews --- */}
          <div style={{ borderTop: '1px solid #eee', marginTop: 32, paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowReviews(v => !v)}>
              <div style={{ fontWeight: 600, fontSize: 20 }}>Reviews ({reviews.length})</div>
              <div>
                {avgRating && (
                  <span style={{ color: '#ffb400', fontSize: 20, fontWeight: 700, marginRight: 8 }}>
                    {Array.from({ length: 5 }, (_, i) => i < Math.round(avgRating) ? '★' : '☆').join('')}
                  </span>
                )}
                <span style={{ fontSize: 18 }}>{avgRating ? avgRating + ' stars' : 'No reviews yet'}</span>
                <span style={{ marginLeft: 8 }}>{showReviews ? '▲' : '▼'}</span>
              </div>
            </div>
            {showReviews && (
              <div style={{ marginTop: 18 }}>
                <form onSubmit={handleReviewSubmit} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        style={{ fontSize: 28, color: i < reviewStars ? '#ffb400' : '#ccc', cursor: 'pointer' }}
                        onClick={() => setReviewStars(i + 1)}
                        aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setReviewStars(i + 1)}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ marginLeft: 8, color: '#888', fontSize: 16 }}>{reviewStars > 0 ? `${reviewStars} star${reviewStars > 1 ? 's' : ''}` : ''}</span>
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    rows={3}
                    placeholder="Write a review..."
                    style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 10, fontSize: 15, marginBottom: 8 }}
                  />
                  <button type="submit" className="btn primary" style={{ marginTop: 4 }} disabled={reviewStars < 1 || !reviewText.trim()}>
                    Submit Review
                  </button>
                </form>
                {reviews.length === 0 && <div style={{ color: '#888', fontSize: 15 }}>No reviews yet. Be the first to review!</div>}
                {reviews.map((r, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
                    <div style={{ color: '#ffb400', fontSize: 18, fontWeight: 600 }}>
                      {Array.from({ length: 5 }, (_, i) => i < r.stars ? '★' : '☆').join('')}
                      <span style={{ color: '#222', fontWeight: 400, fontSize: 15, marginLeft: 8 }}>{r.stars} star{r.stars > 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ fontSize: 15, margin: '6px 0 2px 0' }}>{r.text}</div>
                    <div style={{ color: '#aaa', fontSize: 13 }}>{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
