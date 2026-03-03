// src/ProductPage.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import { PRODUCTS } from "./data";      // local demo products
import api from "./api";                // your axios instance for backend
import Reviews from "./components/Reviews";


export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        // 1) Try to load from backend API using DB id (works for category pages)
        const res = await api.get(`/api/products/${id}`);
        if (cancelled) return;

        const row = res.data;

        // try to find matching local product by name (for sizes/images)
        const localMatch =
          PRODUCTS.find((p) => p.name === row.name) ||
          PRODUCTS.find((p) => String(p.id) === String(id));

        const combined = {
          id: String(row.id),
          name: row.name,
          price: Number(row.price),
          description: row.description,
          desc: row.description,
          // images: use local images if we have them, otherwise DB image_url
          images:
            (localMatch && localMatch.images && localMatch.images.length > 0
              ? localMatch.images
              : row.image_url
              ? [row.image_url]
              : []),
          image: row.image_url,
          // category: try to map to the "cat" used in your frontend (men/women/kids)
          cat: localMatch?.cat
            ? localMatch.cat
            : row.category_name
            ? row.category_name.toLowerCase().includes("men")
              ? "men"
              : row.category_name.toLowerCase().includes("women")
              ? "women"
              : "kids"
            : "men",
          // sizes from local demo data if available, otherwise a simple default
          sizes:
            (localMatch && localMatch.sizes && localMatch.sizes.length > 0
              ? localMatch.sizes
              : ["S", "M", "L", "XL"]),
        };

        setProduct(combined);
        setActiveImg(0);
        setSize(combined.sizes[0] || "");
      } catch (err) {
        console.error("Error loading product from API, falling back to local:", err);

        // 2) Fallback: use local PRODUCTS (this is what search is already using)
        const local = PRODUCTS.find((p) => String(p.id) === String(id));
        if (!local) {
          setError("Product not found.");
        } else {
          setProduct(local);
          setActiveImg(0);
          setSize(local.sizes?.[0] || "");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const images =
      product.images && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [];

    addToCart({
      ...product,
      size,
      image: images[0],
    });
    setMsg(`Added "${product.name}" to basket!`);
    setTimeout(() => setMsg(""), 3000);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">{error || "Product not found."}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="container mt-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          {product.cat && (
            <li className="breadcrumb-item">
              <Link to={`/${product.cat}s`}>{product.cat}</Link>
            </li>
          )}
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Images */}
        <div className="col-md-6">
          {images[activeImg] && (
            <img
              src={images[activeImg]}
              alt={product.name}
              className="img-fluid rounded mb-3"
            />
          )}
          <div className="d-flex gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className={`img-thumbnail ${
                  i === activeImg ? "border-primary" : ""
                }`}
                style={{ width: "80px", cursor: "pointer" }}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <h3 className="text-primary">£{product.price.toFixed(2)}</h3>
          <p className="mt-3">{product.desc || product.description}</p>
          
          

          {/* Size options ONLY */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-bold">Size:</label>
              <div className="btn-group d-flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`btn ${
                      size === s ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setSize(s)}
                  >
                    {s}
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

      {/* Ratings & Reviews Section */}
      <div className="mt-5">
        <Reviews productId={String(product.id)} />
      </div>

    </div>
  );

}

export default ProductPage;
