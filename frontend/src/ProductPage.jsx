// src/ProductPage.jsx
import React, { useContext, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { PRODUCTS } from "./data";

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const product = PRODUCTS.find((p) => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [color, setColor] = useState(product?.colors?.[0] || "");
  const [msg, setMsg] = useState("");

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Product not found.</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      size,
      color,
      image: product.images?.[0] || product.image,
    });
    setMsg(`Added "${product.name}" to basket!`);
    setTimeout(() => setMsg(""), 3000);
  };

  const images = product.images || [product.image];

  return (
    <div className="container mt-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to={`/${product.cat}s`}>{product.cat}</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <img
            src={images[activeImg]}
            alt={product.name}
            className="img-fluid rounded mb-3"
          />
          <div className="d-flex gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className={`img-thumbnail ${i === activeImg ? 'border-primary' : ''}`}
                style={{ width: '80px', cursor: 'pointer' }}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h3 className="text-primary">£{product.price.toFixed(2)}</h3>
          <p className="mt-3">{product.desc || product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-bold">Size:</label>
              <div className="btn-group d-flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`btn ${size === s ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-bold">Color:</label>
              <div className="btn-group d-flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`btn ${color === c ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="btn btn-dark btn-lg w-100 mt-3"
            onClick={handleAddToCart}
          >
            Add to Basket
          </button>

          {msg && (
            <div className="alert alert-success mt-3" role="alert">
              {msg}
            </div>
          )}

          <button
            className="btn btn-outline-secondary w-100 mt-2"
            onClick={() => navigate(-1)}
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
