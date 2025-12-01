import React from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "./data";

export function ProductPage() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);

  const [activeImg, setActiveImg] = React.useState(0);
  const [size, setSize] = React.useState(product?.sizes?.[0] ?? "");
  const [color, setColor] = React.useState(product?.colors?.[0] ?? "");
  const [msg, setMsg] = React.useState("");

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
    setMsg(
      `Added “${product.name}” (${color}, ${size}) to bag (demo).`
    );
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
                className={
                  "thumb-btn" + (i === activeImg ? " active" : "")
                }
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img
                  alt={`${product.name} thumbnail ${i + 1}`}
                  src={src}
                />
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
        </div>
      </section>
    </>
  );
}
