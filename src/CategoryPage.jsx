import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PRODUCTS } from "./data";

const PER_PAGE = 6;

export function CategoryPage({ cat, pageTitle }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || (cat === "new-arrivals" ? "newest" : "featured"));
  const q = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // Sorting logic
  let filtered = PRODUCTS.filter(
    (p) =>
      p.cat === cat &&
      (!q || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  if (sort === "price-high-low") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === "price-low-high") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "newest") {
    // Assuming newest are first in PRODUCTS for new-arrivals, otherwise by id or add a date field
    filtered = [...filtered];
  }

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    setSearchParams(params);
  };

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);

  const goPage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  return (
    <>
      <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <span id="count" className="chip">
          {total} item{total !== 1 ? "s" : ""} · {pageTitle}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="sort-select" style={{ fontWeight: 500, marginRight: 4 }}>Sort By:</label>
          <select id="sort-select" value={sort} onChange={handleSortChange} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc' }}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-high-low">Price: High-Low</option>
            <option value="price-low-high">Price: Low-High</option>
          </select>
        </div>
      </div>

      <section
        id="grid"
        className="grid mt-3"
        role="list"
        aria-label={`${pageTitle} products`}
      >
        {slice.map((p) => (
          <article key={p.id} className="card" role="listitem">
            <Link to={`/product/${encodeURIComponent(p.id)}`} aria-label={p.name}>
              <div className="thumb">
                <img src={p.images[0]} alt={p.name} />
              </div>
              <div className="body">
                <div className="title">{p.name}</div>
                <div className="meta">
                  <span className="price">£{p.price.toFixed(2)}</span>
                  {p.tag && <span className="badge">{p.tag}</span>}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <nav className="pagination" role="navigation" aria-label="Pagination">
        <button
          className="btn"
          onClick={() => goPage(safePage - 1)}
          disabled={safePage <= 1}
        >
          Prev
        </button>
        <span className="chip" id="pageStat">
          Page {safePage} of {pages}
        </span>
        <button
          className="btn"
          onClick={() => goPage(safePage + 1)}
          disabled={safePage >= pages}
        >
          Next
        </button>
      </nav>
    </>
  );
}
